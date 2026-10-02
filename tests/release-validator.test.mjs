import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  AGENT_PLUGINS_SCHEMA,
  findForbiddenText,
  findForbiddenTextInReleaseFile,
  validateAgentPluginManifest,
} from "../scripts/validate-release.mjs";

test("release scanner rejects personal paths and live-token shapes", () => {
  const personalPath = ["", "Users", "example", "private", "file"].join("/");
  const syntheticFixture = `ghp_${"abcdefghijklmnopqrstuvwxyz123456"}`;
  assert.deepEqual(findForbiddenText(personalPath), [
    "personal filesystem path",
  ]);
  assert.deepEqual(findForbiddenText(syntheticFixture), [
    "GitHub token",
  ]);
});

test("release scanner permits explicit credential placeholders", () => {
  assert.deepEqual(
    findForbiddenText("SHOPIFY_API_SECRET=<SHOPIFY_API_SECRET>"),
    [],
  );
});

test("release scanner permits only the approved OpenAI developer identity field", () => {
  const approvedName = ["Khadin", "Akbar"].join(" ");
  const manifest = {
    extensions: { "com.openai": { interface: { developerName: approvedName } } },
  };
  assert.deepEqual(findForbiddenTextInReleaseFile("plugin.json", JSON.stringify(manifest)), []);
  assert.deepEqual(
    findForbiddenTextInReleaseFile("README.md", JSON.stringify(manifest)),
    ["personal publisher identity"],
  );
  manifest.other = approvedName;
  assert.deepEqual(
    findForbiddenTextInReleaseFile("plugin.json", JSON.stringify(manifest)),
    ["personal publisher identity"],
  );
});

test("release scanner rejects additional common provider credentials", () => {
  const syntheticFixtures = [
    {sample: `sk-ant-${"a".repeat(24)}`, expected: "Anthropic key"},
    {sample: `AIza${"a".repeat(32)}`, expected: "Google API key"},
    {sample: `AKIA${"A".repeat(16)}`, expected: "AWS access key"},
  ];
  for (const fixture of syntheticFixtures) {
    assert.deepEqual(findForbiddenText(fixture.sample), [fixture.expected]);
  }
});

test("shipped skills do not instruct an agent to read local runtime secrets", async () => {
  const skillsDirectory = "skills";
  const entries = await readdir(skillsDirectory, { withFileTypes: true });

  for (const entry of entries.filter((candidate) => candidate.isDirectory())) {
    const skillPath = path.join(skillsDirectory, entry.name, "SKILL.md");
    const skill = await readFile(skillPath, "utf8");
    assert.doesNotMatch(skill, /process\.env|os\.getenv|os\.environ|Deno\.env|Bun\.env/,
      `${skillPath} must use an explicit application configuration boundary`);
  }
});

test("authentication guidance does not interpolate credentials into queries or trust substring shop validation", async () => {
  const appAuth = await readFile("skills/app-auth/SKILL.md", "utf8");
  const hydrogen = await readFile("skills/hydrogen-storefront/SKILL.md", "utf8");

  assert.doesNotMatch(appAuth, /customer\(customerAccessToken:\s*"\$\{/);
  assert.doesNotMatch(appAuth, /\.includes\(['"]\.myshopify\.com['"]\)/);
  assert.match(appAuth, /context\.customerAccount\.query/);
  assert.match(hydrogen, /context\.customerAccount\.query/);
  assert.doesNotMatch(hydrogen, /hydrogen deploy --set PRIVATE_STOREFRONT_API_TOKEN/);
});

test("App Bridge guidance does not retrieve credentials or accept unverified JWTs", async () => {
  const skill = await readFile("skills/app-bridge/SKILL.md", "utf8");
  assert.doesNotMatch(skill, /\.idToken\s*\(|\.getSessionToken\s*\(|Bearer\s+\$\{/);
  assert.doesNotMatch(skill, /jwtDecode\s*\(|verify_signature["']?\s*:\s*False/);
  assert.match(skill, /await authenticate\.admin\(request\)/);
});

test("MCP runtime environment access is limited to server binding and guidance location", async () => {
  const allowed = new Set(["PORT", "HOST", "SHOPIFY_APP_BUILDER_SKILLS_DIR"]);
  for (const directory of ["api", "mcp-server/src"]) {
    for (const name of await readdir(directory)) {
      if (!name.endsWith(".mjs")) continue;
      const source = await readFile(path.join(directory, name), "utf8");
      for (const match of source.matchAll(/process\.env(?:\.([A-Z_]+))?/g)) {
        assert.ok(allowed.has(match[1]), `${directory}/${name}: unexpected runtime environment access`);
      }
    }
  }
});

test("Agent Plugins manifest validator rejects nonportable schema fields", () => {
  assert.deepEqual(
    validateAgentPluginManifest({
      $schema: AGENT_PLUGINS_SCHEMA,
      name: "shopify-app-builder",
      unsupported: true,
    }),
    ["unknown top-level field: unsupported"],
  );
});

test("Claude directory manifest declares the public privacy policy", async () => {
  const claude = JSON.parse(await readFile(".claude-plugin/plugin.json", "utf8"));
  const portable = JSON.parse(await readFile("plugin.json", "utf8"));
  assert.equal(claude.privacyPolicyUrl, portable.extensions["com.openai"].interface.privacyPolicyURL);
  assert.equal(new URL(claude.privacyPolicyUrl).protocol, "https:");
  assert.match(claude.privacyPolicyUrl, /\/PRIVACY\.md$/);
});

test("Claude directory listing has the approved publisher, website, links, and icon", async () => {
  const claude = JSON.parse(await readFile(".claude-plugin/plugin.json", "utf8"));
  const marketplace = JSON.parse(await readFile(".claude-plugin/marketplace.json", "utf8"));
  const portable = JSON.parse(await readFile("plugin.json", "utf8"));
  const listing = portable.extensions["com.openai"].interface;
  const approvedName = ["Khadin", "Akbar"].join(" ");
  assert.equal(claude.author.name, approvedName);
  assert.equal(marketplace.owner.name, approvedName);
  assert.equal(claude.author.url, "https://khadinakbar.com/");
  assert.equal(claude.homepage, "https://khadinakbar.com/");
  assert.equal(claude.supportUrl, listing.supportURL);
  assert.equal(claude.termsOfServiceUrl, listing.termsOfServiceURL);
  assert.equal(claude.documentationUrl, portable.repository + "#readme");
  for (const field of ["homepage", "documentationUrl", "supportUrl", "privacyPolicyUrl", "termsOfServiceUrl"]) {
    assert.equal(new URL(claude[field]).protocol, "https:");
  }
  assert.equal(claude.icon, "./assets/icon.png");
  const icon = await readFile(claude.icon);
  assert.deepEqual([...icon.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(icon.readUInt32BE(16), icon.readUInt32BE(20));
});

test("release scanner allows approved public publisher fields but not unrelated names or secrets", () => {
  const approvedName = ["Khadin", "Akbar"].join(" ");
  for (const file of ["plugin.json", ".claude-plugin/plugin.json", ".codex-plugin/plugin.json", ".cursor-plugin/plugin.json"]) {
    const manifest = {author: {name: approvedName}};
    assert.deepEqual(findForbiddenTextInReleaseFile(file, JSON.stringify(manifest)), []);
    manifest.description = approvedName;
    assert.deepEqual(findForbiddenTextInReleaseFile(file, JSON.stringify(manifest)), ["personal publisher identity"]);
    delete manifest.description;
    manifest.author.name = `ghp_${"abcdefghijklmnopqrstuvwxyz123456"}`;
    assert.deepEqual(findForbiddenTextInReleaseFile(file, JSON.stringify(manifest)), ["GitHub token"]);
  }
  assert.deepEqual(findForbiddenTextInReleaseFile("package.json", JSON.stringify({author: approvedName})), []);
  assert.deepEqual(findForbiddenTextInReleaseFile(".claude-plugin/marketplace.json", JSON.stringify({owner: {name: approvedName}})), []);
});

test("native remote MCP configuration declares Claude's HTTP transport", async () => {
  const native = JSON.parse(await readFile(".mcp.json", "utf8"));
  const portable = JSON.parse(await readFile("mcp.json", "utf8"));
  assert.deepEqual(Object.keys(native.mcpServers), ["shopify-app-builder"]);
  const nativeServer = native.mcpServers["shopify-app-builder"];
  assert.equal(nativeServer.type, "http");
  assert.equal(nativeServer.url, portable.mcpServers["shopify-app-builder"].url);
  assert.equal(new URL(nativeServer.url).protocol, "https:");
  assert.equal(portable.mcpServers["shopify-app-builder"].type, "streamable-http");
});
