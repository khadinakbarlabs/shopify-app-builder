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
  ".vercel",
  "node_modules",
  ".shopify-app-builder-backups",
]);

// Top-level keys Claude Code reads from .claude-plugin/plugin.json. Listing-only
// and cross-tool keys are rejected so the directory scan stays clean.
export const CLAUDE_MANIFEST_FIELDS = Object.freeze(new Set([
  "name",
  "version",
  "description",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
  "commands",
  "agents",
  "skills",
  "hooks",
  "mcpServers",
  "outputStyles",
  "lspServers",
  "userConfig",
  "dependencies",
  "channels",
  "settings",
]));

export function findUnknownClaudeManifestFields(manifest) {
  return Object.keys(manifest).filter((field) => !CLAUDE_MANIFEST_FIELDS.has(field));
}

const FORBIDDEN_PATTERNS = Object.freeze([
  ["personal filesystem path", /(?:\/Users\/[A-Za-z0-9._-]+\/|\/home\/[A-Za-z0-9._-]+\/|[A-Za-z]:\\Users\\[^\\]+\\)/],
  ["personal publisher identity", /Khadin\s+Akbar/i],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["GitHub token", /(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})/],
  ["npm token", /npm_[A-Za-z0-9]{20,}/],
  ["Apify token", /apify_api_[A-Za-z0-9_-]{20,}/],
  ["Shopify token", /(?:shpat|shpca|shpss|shpua)_[A-Za-z0-9]{20,}/],
  ["OpenAI key", /sk-(?!ant-)(?:proj-)?[A-Za-z0-9_-]{20,}/],
  ["Anthropic key", /sk-ant-[A-Za-z0-9_-]{20,}/],
  ["Google API key", /AIza[A-Za-z0-9_-]{30,}/],
  ["AWS access key", /(?:AKIA|ASIA)[A-Z0-9]{16}/],
  ["Stripe live key", /(?:sk|rk)_live_[A-Za-z0-9]{16,}/],
  ["Slack token", /xox[baprs]-[A-Za-z0-9-]{10,}/],
]);

export function findForbiddenText(text) {
  return FORBIDDEN_PATTERNS
    .filter(([, pattern]) => pattern.test(text))
    .map(([label]) => label);
}

export function findForbiddenTextInReleaseFile(relative, text) {
  const approvedPublisherNames = new Set(["Khadin Akbar", "Khadin Akbar Ventures"]);
  const publisherFields = {
    ".claude-plugin/plugin.json": ["author.name"],
    ".claude-plugin/marketplace.json": ["owner.name"],
    ".codex-plugin/plugin.json": ["author.name", "interface.developerName"],
    ".cursor-plugin/plugin.json": ["author.name"],
    "package.json": ["author"],
  };
  if (!Object.hasOwn(publisherFields, relative)) return findForbiddenText(text);
  const manifest = JSON.parse(text);
  for (const field of publisherFields[relative]) {
    const keys = field.split(".");
    const key = keys.pop();
    const parent = keys.reduce((value, part) => value?.[part], manifest);
    if (approvedPublisherNames.has(parent?.[key])) {
      parent[key] = "[approved public publisher]";
    }
  }
  return findForbiddenText(JSON.stringify(manifest));
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
    ".agents/plugins/marketplace.json",
    ".claude-plugin/plugin.json",
    ".claude-plugin/marketplace.json",
    ".codex/INSTALL.md",
    ".codex-plugin/plugin.json",
    ".cursor-plugin/plugin.json",
    ".opencode/INSTALL.md",
    ".opencode/plugins/shopify-app-builder.js",
    "docs/agents/README.md",
    "docs/agents/claude-code.md",
    "docs/agents/codex.md",
    "docs/agents/command-code.md",
    "docs/agents/cursor.md",
    "docs/agents/gemini-cli.md",
    "docs/agents/opencode.md",
    "docs/agents/other-agents.md",
    "docs/release-notes-v1.4.0.md",
    "docs/release-notes-v1.4.1.md",
    "docs/release-notes-v1.4.2.md",
    "docs/release-notes-v1.5.0.md",
    "docs/release-notes-v1.5.2.md",
    "docs/release-notes-v1.5.3.md",
    "docs/release-notes-v1.5.4.md",
    "docs/release-notes-v1.5.5.md",
    "docs/release-notes-v1.5.6.md",
    "docs/release-notes-v1.5.7.md",
    "docs/release-notes-v1.5.8.md",
    "GEMINI.md",
    "gemini-extension.json",
    "LICENSE",
    "PRIVACY.md",
    "README.md",
    "SECURITY.md",
    "TERMS.md",
    "package.json",
    "skills/using-shopify-app-builder/SKILL.md",
    "skills/shopify-connections/SKILL.md",
    "skills/app-market-research/SKILL.md",
    "skills/app-framework/SKILL.md",
    "skills/app-release-readiness/SKILL.md",
    "skills/shopify-project-copilot/SKILL.md",
    "skills/shopify-project-copilot/scripts/project.mjs",
    "skills/shopify-project-copilot/references/context.md",
    "skills/shopify-project-copilot/references/check-ins.md",
    "docs/release-notes-v2.1.0.md",
    "docs/project-copilot-evaluation.md",
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
  const cursorManifest = JSON.parse(
    await readFile(path.join(root, ".cursor-plugin", "plugin.json"), "utf8"),
  );
  const geminiManifest = JSON.parse(
    await readFile(path.join(root, "gemini-extension.json"), "utf8"),
  );
  const claudeMarketplace = JSON.parse(
    await readFile(path.join(root, ".claude-plugin", "marketplace.json"), "utf8"),
  );
  const codexMarketplace = JSON.parse(
    await readFile(path.join(root, ".agents", "plugins", "marketplace.json"), "utf8"),
  );
  const versionedSurfaces = [
    codexManifest.version,
    claudeManifest.version,
    cursorManifest.version,
    geminiManifest.version,
    claudeMarketplace.plugins?.[0]?.version,
    codexMarketplace.plugins?.[0]?.version,
  ];
  if (versionedSurfaces.some((version) => version !== packageJson.version)) {
    errors.push("package.json and all plugin surface versions must match");
  }
  for (const field of findUnknownClaudeManifestFields(claudeManifest)) {
    errors.push(`.claude-plugin/plugin.json has a key Claude Code does not read: ${field}`);
  }
  if (claudeManifest.name !== packageJson.name) {
    errors.push("Claude manifest name must match package.json name");
  }
  const subtitle = codexManifest.interface?.shortDescription;
  if (typeof subtitle === "string" && subtitle.length > 30) {
    errors.push("Codex listing shortDescription must be at most 30 characters");
  }
  if (relativeFiles.has("plugin.json") || packageJson.files?.includes("plugin.json")) {
    errors.push("Release must not ship a root plugin.json manifest");
  }
  for (const forbidden of ["mcp.json", ".mcp.json", "api/mcp.mjs", "mcp-server/package.json", "vercel.json", "chatgpt-app-submission.json"]) {
    if (relativeFiles.has(forbidden)) errors.push(`Skills-only release must not ship ${forbidden}`);
  }
  if (packageJson.files?.some(file => /mcp|^api$|^vercel/.test(file))) {
    errors.push("Skills-only npm package must not include an MCP runtime or host configuration");
  }
  for (const manifest of [codexManifest, claudeManifest, cursorManifest, geminiManifest]) {
    if (Object.hasOwn(manifest, "mcpServers") || Object.hasOwn(manifest, "apps")) {
      errors.push("Skills-only manifests must not declare servers or app bindings");
    }
  }
  if (codexMarketplace.plugins?.[0]?.source?.path !== "../..") {
    errors.push("Codex marketplace source must resolve to the repository root");
  }
  if (packageJson.dependencies || packageJson.optionalDependencies) {
    errors.push("The public installer must remain dependency-free");
  }
  if (packageJson.main !== ".opencode/plugins/shopify-app-builder.js") {
    errors.push("package.json main must expose the OpenCode adapter");
  }
  if (packageJson.bin?.["shopify-app-builder"] !== "scripts/install-agent-skills.mjs") {
    errors.push("package.json bin must use npm's canonical relative path");
  }
  if (packageJson.bin?.["shopify-project"] !== "skills/shopify-project-copilot/scripts/project.mjs") {
    errors.push("Project CLI must use the contained portable skill helper");
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
    for (const label of findForbiddenTextInReleaseFile(relative, text)) {
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
