import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const VERSIONED_MANIFESTS = [
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  "gemini-extension.json",
];

const AGENT_GUIDES = [
  "claude-code",
  "codex",
  "cursor",
  "opencode",
  "command-code",
  "gemini-cli",
  "other-agents",
];

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

test("ships native manifests and a Codex marketplace", async () => {
  const packageJson = await readJson("package.json");
  assert.equal(
    packageJson.bin["shopify-app-builder"],
    "scripts/install-agent-skills.mjs",
  );

  for (const file of VERSIONED_MANIFESTS) {
    const manifest = await readJson(file);
    assert.equal(manifest.name, "shopify-app-builder", file);
    assert.equal(manifest.version, packageJson.version, file);
  }

  const marketplace = await readJson(".agents/plugins/marketplace.json");
  assert.equal(marketplace.plugins[0].name, "shopify-app-builder");
  assert.equal(marketplace.plugins[0].source.source, "local");
  assert.equal(marketplace.plugins[0].source.path, "../..");
});

test("ships an agent-specific guide for every supported harness tier", async () => {
  for (const agent of AGENT_GUIDES) {
    const guide = await readFile(`docs/agents/${agent}.md`, "utf8");
    assert.match(guide, /^# /);
    assert.match(guide, /## Best use cases/);
    assert.match(guide, /## Operating guidelines/);
    assert.match(guide, /## Verify/);
  }
});

test("ships a routing skill that points agents to focused Shopify skills", async () => {
  const router = await readFile(
    "skills/using-shopify-app-builder/SKILL.md",
    "utf8",
  );

  assert.match(router, /^---\nname: using-shopify-app-builder\n/);
  assert.match(router, /admin-graphql/);
  assert.match(router, /app-auth/);
  assert.match(router, /built-for-shopify-standards/);
  assert.match(router, /shopify-app-store-ads/);
});

test("OpenCode plugin registers the canonical skills directory once", async () => {
  const { ShopifyAppBuilderPlugin } = await import(
    "../.opencode/plugins/shopify-app-builder.js"
  );
  const hooks = await ShopifyAppBuilderPlugin({});
  const config = {};

  await hooks.config(config);
  await hooks.config(config);

  assert.equal(config.skills.paths.length, 1);
  assert.match(config.skills.paths[0], /shopify-app-builder\/skills$/);
});
