import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  AGENT_PLUGINS_SCHEMA,
  findForbiddenText,
  validateAgentPluginManifest,
} from "../scripts/validate-release.mjs";

test("release scanner rejects personal paths and live-token shapes", () => {
  const personalPath = ["", "Users", "example", "private", "file"].join("/");
  const githubToken = `ghp_${"abcdefghijklmnopqrstuvwxyz123456"}`;
  assert.deepEqual(findForbiddenText(personalPath), [
    "personal filesystem path",
  ]);
  assert.deepEqual(findForbiddenText(`token = ${githubToken}`), [
    "GitHub token",
  ]);
});

test("release scanner permits explicit credential placeholders", () => {
  assert.deepEqual(
    findForbiddenText("SHOPIFY_API_SECRET=<SHOPIFY_API_SECRET>"),
    [],
  );
});

test("release scanner rejects additional common provider credentials", () => {
  const anthropicKey = `sk-ant-${"a".repeat(24)}`;
  const googleKey = `AIza${"a".repeat(32)}`;
  const awsKey = `AKIA${"A".repeat(16)}`;

  assert.deepEqual(findForbiddenText(anthropicKey), ["Anthropic key"]);
  assert.deepEqual(findForbiddenText(googleKey), ["Google API key"]);
  assert.deepEqual(findForbiddenText(awsKey), ["AWS access key"]);
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
