#!/usr/bin/env node

import { access, cp, lstat, mkdir, readdir } from "node:fs/promises";
import { realpathSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_DIRECTORIES = Object.freeze({
  "claude-code": [".claude", "skills"],
  codex: [".agents", "skills"],
  opencode: [".opencode", "skills"],
  cursor: [".agents", "skills"],
  "command-code": [".commandcode", "skills"],
  universal: [".agents", "skills"],
});

const GLOBAL_DIRECTORIES = Object.freeze({
  "claude-code": [".claude", "skills"],
  codex: [".codex", "skills"],
  opencode: [".config", "opencode", "skills"],
  cursor: [".cursor", "skills"],
  "command-code": [".commandcode", "skills"],
  universal: [".agents", "skills"],
});

export const SUPPORTED_AGENTS = Object.freeze(Object.keys(PROJECT_DIRECTORIES));

async function pathExists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function assertNoSymlinks(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    const stats = await lstat(entryPath);
    if (stats.isSymbolicLink()) {
      throw new Error(`Refusing to install symbolic link: ${entryPath}`);
    }
    if (stats.isDirectory()) {
      await assertNoSymlinks(entryPath);
    }
  }
}

async function assertSafeTargetPath(targetRoot, targetSkill) {
  for (const candidate of [targetRoot, targetSkill]) {
    if (!(await pathExists(candidate))) continue;
    const stats = await lstat(candidate);
    if (stats.isSymbolicLink()) {
      throw new Error(`Refusing to write through symbolic link: ${candidate}`);
    }
  }
}

export function resolveTargetDirectory(
  agent,
  { global = false, cwd = process.cwd(), home = os.homedir() } = {},
) {
  const mapping = global ? GLOBAL_DIRECTORIES : PROJECT_DIRECTORIES;
  const segments = mapping[agent];
  if (!segments) {
    throw new Error(
      `Unsupported agent "${agent}". Choose one of: ${SUPPORTED_AGENTS.join(", ")}`,
    );
  }
  return path.join(global ? home : cwd, ...segments);
}

export async function installSkills({
  source,
  target,
  dryRun = false,
  force = false,
}) {
  const sourceEntries = await readdir(source, { withFileTypes: true });
  const skillNames = sourceEntries
    .filter((entry) => entry.isDirectory() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  const installed = [];
  const skipped = [];

  for (const skillName of skillNames) {
    const sourceSkill = path.join(source, skillName);
    const skillManifest = path.join(sourceSkill, "SKILL.md");
    if (!(await pathExists(skillManifest))) continue;
    await assertNoSymlinks(sourceSkill);

    const targetSkill = path.join(target, skillName);
    if ((await pathExists(targetSkill)) && !force) {
      skipped.push(skillName);
      continue;
    }

    await assertSafeTargetPath(target, targetSkill);
    if ((await pathExists(targetSkill)) && force) {
      await assertNoSymlinks(targetSkill);
    }

    installed.push(skillName);
    if (!dryRun) {
      await mkdir(target, { recursive: true });
      await cp(sourceSkill, targetSkill, {
        recursive: true,
        force,
        errorOnExist: !force,
      });
    }
  }

  return { installed, skipped, target };
}

function usage() {
  return `Shopify App Builder agent-skill installer

Usage:
  shopify-app-builder install --agent <name> [--global] [--dry-run] [--force]
  shopify-app-builder install --all [--global] [--dry-run] [--force]
  shopify-app-builder reset-cache [--include prisma/.prisma]

Agents: ${SUPPORTED_AGENTS.join(", ")}

The installer copies only the bundled skills. It never reads credentials,
runs postinstall hooks, or deletes an existing skill directory.`;
}

async function runCli() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    return;
  }

  const command = args.shift();
  if (command === "reset-cache") {
    const include = [];
    for (let index = 0; index < args.length; index += 1) {
      if (args[index] === "--include" && args[index + 1]) {
        include.push(args[index + 1]);
        index += 1;
      }
    }
    const { backupCaches } = await import("./reset-shopify-cache.mjs");
    const result = await backupCaches({
      root: process.cwd(),
      include: include.length ? include : undefined,
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command !== "install") throw new Error(`Unknown command: ${command}`);

  const isGlobal = args.includes("--global") || args.includes("-g");
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const installAll = args.includes("--all");
  const agentIndex = args.indexOf("--agent");
  const selectedAgent = agentIndex >= 0 ? args[agentIndex + 1] : null;
  const agents = installAll ? SUPPORTED_AGENTS : [selectedAgent].filter(Boolean);
  if (agents.length === 0) {
    throw new Error("Choose --agent <name> or --all.");
  }

  const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const source = path.join(packageRoot, "skills");
  const results = [];
  const seenTargets = new Set();

  for (const agent of agents) {
    const target = resolveTargetDirectory(agent, { global: isGlobal });
    if (seenTargets.has(target)) continue;
    seenTargets.add(target);
    results.push({
      agent,
      ...(await installSkills({ source, target, dryRun, force })),
    });
  }

  console.log(JSON.stringify({ dryRun, global: isGlobal, results }, null, 2));
}

const isDirectExecution = process.argv[1]
  ? realpathSync(path.resolve(process.argv[1])) ===
    realpathSync(fileURLToPath(import.meta.url))
  : false;

if (isDirectExecution) {
  runCli().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
