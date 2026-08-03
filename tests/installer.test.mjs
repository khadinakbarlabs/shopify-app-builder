import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  installSkills,
  resolveTargetDirectory,
} from "../scripts/install-agent-skills.mjs";
import { backupCaches } from "../scripts/reset-shopify-cache.mjs";

const execFileAsync = promisify(execFile);

test("resolves documented global directories for supported agents", () => {
  const home = "/tmp/example-home";

  assert.equal(
    resolveTargetDirectory("claude-code", { global: true, home }),
    path.join(home, ".claude", "skills"),
  );
  assert.equal(
    resolveTargetDirectory("codex", { global: true, home }),
    path.join(home, ".codex", "skills"),
  );
  assert.equal(
    resolveTargetDirectory("opencode", { global: true, home }),
    path.join(home, ".config", "opencode", "skills"),
  );
  assert.equal(
    resolveTargetDirectory("cursor", { global: true, home }),
    path.join(home, ".cursor", "skills"),
  );
  assert.equal(
    resolveTargetDirectory("command-code", { global: true, home }),
    path.join(home, ".commandcode", "skills"),
  );
  assert.equal(
    resolveTargetDirectory("gemini-cli", { global: true, home }),
    path.join(home, ".gemini", "skills"),
  );
});

test("npm-style symlink executes the installer CLI", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "shopify-cli-link-test-"));
  const binPath = path.join(root, "shopify-app-builder");
  const cliPath = path.resolve("scripts/install-agent-skills.mjs");
  await symlink(cliPath, binPath);

  const { stdout } = await execFileAsync(binPath, ["--help"]);

  assert.match(stdout, /Shopify App Builder agent-skill installer/);
  assert.match(stdout, /shopify-app-builder install --agent/);
});

test("dry-run reports installs without writing target files", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "shopify-app-builder-test-"));
  const source = path.join(root, "source");
  const target = path.join(root, "target");
  await mkdir(path.join(source, "sample-skill"), { recursive: true });
  await writeFile(
    path.join(source, "sample-skill", "SKILL.md"),
    "---\nname: sample-skill\ndescription: Test skill\n---\n",
  );

  const result = await installSkills({ source, target, dryRun: true });

  assert.deepEqual(result.installed, ["sample-skill"]);
  await assert.rejects(readFile(path.join(target, "sample-skill", "SKILL.md")));
});

test("installer copies valid skills and refuses to replace existing skills by default", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "shopify-app-builder-test-"));
  const source = path.join(root, "source");
  const target = path.join(root, "target");
  await mkdir(path.join(source, "sample-skill"), { recursive: true });
  await writeFile(
    path.join(source, "sample-skill", "SKILL.md"),
    "---\nname: sample-skill\ndescription: Test skill\n---\n",
  );

  const first = await installSkills({ source, target });
  const second = await installSkills({ source, target });

  assert.deepEqual(first.installed, ["sample-skill"]);
  assert.deepEqual(second.skipped, ["sample-skill"]);
});

test("force install refuses a symlinked destination", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "shopify-app-builder-test-"));
  const source = path.join(root, "source");
  const target = path.join(root, "target");
  const outside = path.join(root, "outside");
  await mkdir(path.join(source, "sample-skill"), { recursive: true });
  await mkdir(target, { recursive: true });
  await mkdir(outside, { recursive: true });
  await writeFile(
    path.join(source, "sample-skill", "SKILL.md"),
    "---\nname: sample-skill\ndescription: Test skill\n---\n",
  );
  await symlink(outside, path.join(target, "sample-skill"));

  await assert.rejects(
    installSkills({ source, target, force: true }),
    /symbolic link/,
  );
});

test("cache reset moves only allowlisted caches into a recoverable backup", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "shopify-cache-test-"));
  await mkdir(path.join(root, ".next"), { recursive: true });
  await writeFile(path.join(root, ".next", "cache.txt"), "cached");

  const result = await backupCaches({ root, include: [".next"] });

  assert.deepEqual(result.moved, [".next"]);
  assert.equal(
    await readFile(path.join(result.backupDirectory, ".next", "cache.txt"), "utf8"),
    "cached",
  );
  await assert.rejects(readFile(path.join(root, ".next", "cache.txt")));
  await assert.rejects(
    backupCaches({ root, include: ["../outside"] }),
    /Unsupported cache path/,
  );
});
