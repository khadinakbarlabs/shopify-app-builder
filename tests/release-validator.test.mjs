import assert from "node:assert/strict";
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
