#!/usr/bin/env node

import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TEXT_EXTENSIONS = new Set([
  "",
  ".json",
  ".md",
  ".mjs",
  ".js",
  ".yaml",
  ".yml",
  ".toml",
  ".txt",
]);

const EXCLUDED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  ".shopify-app-builder-backups",
]);

const FORBIDDEN_PATTERNS = Object.freeze([
  ["personal filesystem path", /(?:\/Users\/[A-Za-z0-9._-]+\/|\/home\/[A-Za-z0-9._-]+\/|[A-Za-z]:\\Users\\[^\\]+\\)/],
  ["personal publisher identity", /Khadin\s+Akbar/i],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["GitHub token", /(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})/],
  ["npm token", /npm_[A-Za-z0-9]{20,}/],
  ["Shopify token", /(?:shpat|shpca|shpss|shpua)_[A-Za-z0-9]{20,}/],
  ["OpenAI key", /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/],
  ["Slack token", /xox[baprs]-[A-Za-z0-9-]{10,}/],
]);

export function findForbiddenText(text) {
  return FORBIDDEN_PATTERNS
    .filter(([, pattern]) => pattern.test(text))
    .map(([label]) => label);
}

async function walkFiles(root, directory = root) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && EXCLUDED_DIRECTORIES.has(entry.name)) continue;
    const entryPath = path.join(directory, entry.name);
    const stats = await lstat(entryPath);
    if (stats.isSymbolicLink()) {
      throw new Error(`Symbolic links are not allowed in the public source: ${entryPath}`);
    }
    if (stats.isDirectory()) files.push(...(await walkFiles(root, entryPath)));
    else if (stats.isFile()) files.push(entryPath);
  }
  return files;
}

function parseFrontmatterName(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const nameLine = match[1]
    .split(/\r?\n/)
    .find((line) => line.startsWith("name:"));
  return nameLine ? nameLine.slice("name:".length).trim().replace(/^['"]|['"]$/g, "") : null;
}

export async function validateRelease(root) {
  const errors = [];
  const requiredFiles = [
    ".claude-plugin/plugin.json",
    ".claude-plugin/marketplace.json",
    ".codex-plugin/plugin.json",
    "assets/icon.png",
    "assets/logo.png",
    "LICENSE",
    "PRIVACY.md",
    "README.md",
    "SECURITY.md",
    "TERMS.md",
    "package.json",
  ];

  const files = await walkFiles(root);
  const relativeFiles = new Set(files.map((file) => path.relative(root, file)));
  for (const requiredFile of requiredFiles) {
    if (!relativeFiles.has(requiredFile)) errors.push(`Missing required file: ${requiredFile}`);
  }

  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const codexManifest = JSON.parse(
    await readFile(path.join(root, ".codex-plugin", "plugin.json"), "utf8"),
  );
  const claudeManifest = JSON.parse(
    await readFile(path.join(root, ".claude-plugin", "plugin.json"), "utf8"),
  );
  if (packageJson.version !== codexManifest.version || packageJson.version !== claudeManifest.version) {
    errors.push("package.json and plugin manifest versions must match");
  }
  if (packageJson.dependencies || packageJson.optionalDependencies) {
    errors.push("The public installer must remain dependency-free");
  }
  for (const lifecycle of ["install", "postinstall", "prepare"]) {
    if (packageJson.scripts?.[lifecycle]) {
      errors.push(`Disallowed npm lifecycle script: ${lifecycle}`);
    }
  }

  const skillsRoot = path.join(root, "skills");
  for (const entry of await readdir(skillsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillPath = path.join(skillsRoot, entry.name, "SKILL.md");
    const text = await readFile(skillPath, "utf8");
    const frontmatterName = parseFrontmatterName(text);
    if (frontmatterName !== entry.name) {
      errors.push(`Skill name mismatch: ${entry.name} declares ${frontmatterName ?? "no name"}`);
    }
  }

  for (const file of files) {
    const relative = path.relative(root, file);
    if (relative === "scripts/validate-release.mjs") continue;
    if (!TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
    const text = await readFile(file, "utf8");
    for (const label of findForbiddenText(text)) {
      errors.push(`${label} found in ${relative}`);
    }
  }

  return [...new Set(errors)].sort();
}

const isDirectExecution = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectExecution) {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  validateRelease(root)
    .then((errors) => {
      if (errors.length) {
        console.error(errors.join("\n"));
        process.exitCode = 1;
      } else {
        console.log("Release validation passed.");
      }
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
