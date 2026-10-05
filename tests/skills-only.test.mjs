import assert from "node:assert/strict";
import { access, mkdtemp, readdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { installSkills } from "../scripts/install-agent-skills.mjs";
import { buildResearchInput } from "../scripts/prepare-app-research.mjs";

test("distribution has no bundled MCP, host API, or stale MCP review material", async () => {
  for (const file of ["mcp.json", ".mcp.json", "mcp-server/package.json", "api/mcp.mjs", "vercel.json", "chatgpt-app-submission.json", "skills/shopify-mcp/SKILL.md"]) {
    await assert.rejects(access(file), { code: "ENOENT" }, file);
  }
  const pkg = JSON.parse(await readFile("package.json", "utf8"));
  assert.ok(!pkg.files.some(file => /mcp|^api$|^vercel/.test(file)));
  assert.ok(!Object.keys(pkg.scripts).some(key => key.startsWith("mcp:")));
  for (const file of ["plugin.json", ".claude-plugin/plugin.json", ".codex-plugin/plugin.json", ".cursor-plugin/plugin.json", "gemini-extension.json"]) {
    const manifest = JSON.parse(await readFile(file, "utf8"));
    const listing = manifest.extensions?.["com.openai"]?.interface ?? manifest.interface;
    if (listing?.shortDescription) assert.ok(listing.shortDescription.length <= 30, file);
    assert.ok(!("mcpServers" in manifest), file);
    assert.ok(!("apps" in manifest), file);
    assert.ok(manifest.extensions?.["com.openai"]?.apps == null, file);
    assert.ok(!manifest.extensions?.["com.openai"]?.review?.demo_recording_url, "old MCP video must not describe the new release");
  }
  const claude = JSON.parse(await readFile(".claude-plugin/plugin.json", "utf8"));
  // Claude 2.1.289 inventory exposes the documented default scan, while the
  // explicit file array passed validation but reported zero loaded agents.
  assert.equal(Object.hasOwn(claude,"agents"), false);
  const agents=await readdir("agents");
  assert.equal(agents.length,8);
  for (const agent of agents) await access(`agents/${agent}`);
});

test("copy-only installation retains every focused skill and its contained references", async () => {
  const target = await mkdtemp(path.join(os.tmpdir(), "shopify-skills-only-"));
  const result = await installSkills({source: path.resolve("skills"), target});
  for (const required of ["using-shopify-app-builder", "shopify-connections", "app-market-research", "app-framework", "app-release-readiness"]) {
    assert.ok(result.installed.includes(required), required);
  }
  assert.ok(!result.installed.includes("shopify-mcp"));
  for (const name of result.installed) {
    const entrypoint = path.join(target, name, "SKILL.md");
    const source = await readFile(entrypoint, "utf8");
    assert.ok(source.split("\n").length <= 120, `${name}: entrypoint should be focused`);
    for (const match of source.matchAll(/\]\(([^)]+\.md)(?:#[^)]*)?\)/g)) {
      const link = match[1];
      if (/^https?:/.test(link)) continue;
      const destination = path.resolve(path.dirname(entrypoint), link);
      assert.ok(destination.startsWith(target + path.sep), `${name}: link escapes installed skills`);
      await access(destination);
    }
  }
});

test("all native command and agent skill routes resolve", async () => {
  const names = new Set(await readdir("skills"));
  for (const directory of ["commands", "agents"]) {
    for (const file of await readdir(directory)) {
      const text = await readFile(path.join(directory, file), "utf8");
      const routeLine = text.match(/^Skills: (.+)$/m);
      assert.ok(routeLine, `${directory}/${file}: explicit portable skill routes`);
      for (const name of routeLine[1].split(",").map(value => value.trim())) {
        assert.ok(names.has(name), `${directory}/${file}: unknown route ${name}`);
      }
    }
  }
});

test("research input is bounded, explicit and contains no credentials", () => {
  const input = buildResearchInput({queries: ["inventory alerts"]});
  assert.deepEqual(input.queries, ["inventory alerts"]);
  assert.equal(input.maxApps, 5);
  assert.equal(input.scrapeReviews, false);
  assert.equal(input.enrichDetails, false);
  assert.ok(!("token" in input));
  assert.throws(() => buildResearchInput({}), /query or app URL/);
  assert.throws(() => buildResearchInput({queries: ["a", "b"]}), /one query/);
  assert.throws(() => buildResearchInput({queries: ["a"], maxApps: 500}), /maxApps/);
  assert.throws(() => buildResearchInput({startUrls: ["https://apps.shopify.com.evil.example/x"]}), /apps.shopify.com/);
  const credentialUrl = new URL("https://apps.shopify.com/x");
  credentialUrl.username = "synthetic-user";
  credentialUrl.password = ["test", "fixture"].join("-");
  assert.throws(() => buildResearchInput({startUrls: [credentialUrl.href]}), /credentials/);
  assert.throws(() => buildResearchInput({startUrls: ["http://apps.shopify.com/x"]}), /HTTPS/);
  const review = buildResearchInput({startUrls: ["https://apps.shopify.com/example/reviews"], maxReviews: 10});
  assert.equal(review.maxReviews, 10);
  assert.deepEqual(review.startUrls, [{url: "https://apps.shopify.com/example/reviews"}]);
});
