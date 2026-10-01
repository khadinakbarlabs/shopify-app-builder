import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { findGuidance, loadGuidanceCatalog, searchGuidance } from "../src/catalog.mjs";
import { createBuildPlan } from "../src/plan.mjs";

const catalog = [
  { id: "app-auth", title: "App Auth", description: "OAuth and secure session storage.", body: "OAuth token exchange HMAC verification", sourceUrl: "https://example.test/auth" },
  { id: "admin-graphql", title: "Admin GraphQL", description: "Products and inventory with GraphQL.", body: "GraphQL pagination product inventory", sourceUrl: "https://example.test/graphql" },
  { id: "app-accessibility", title: "App Accessibility", description: "WCAG for embedded apps.", body: "Keyboard focus screen reader", sourceUrl: "https://example.test/a11y" },
  { id: "app-performance", title: "App Performance", description: "Performance budgets.", body: "Latency performance", sourceUrl: "https://example.test/performance" },
  { id: "app-validation", title: "App Validation", description: "Validate a merchant problem.", body: "Merchant research", sourceUrl: "https://example.test/validation" },
  { id: "shopify-cli", title: "Shopify CLI", description: "Create Shopify apps.", body: "Scaffold an app", sourceUrl: "https://example.test/cli" },
  { id: "polaris-ui", title: "Polaris UI", description: "Polaris components.", body: "Embedded app UI", sourceUrl: "https://example.test/polaris" },
  { id: "webhooks", title: "Webhooks", description: "Shopify webhook handling.", body: "Retry webhook", sourceUrl: "https://example.test/webhooks" },
];

test("searchGuidance scores focused Shopify terms and respects the limit", () => {
  const results = searchGuidance(catalog, "oauth session", 1);
  assert.deepEqual(results.map((result) => result.id), ["app-auth"]);
});

test("review prompts rank the requested subject ahead of generic Shopify text", () => {
  const skillsDirectory = fileURLToPath(new URL("../../skills/", import.meta.url));
  const publishedCatalog = loadGuidanceCatalog({ skillsDirectory: path.resolve(skillsDirectory) });
  for (const [query, expected] of [
    ["What bundled guidance should I use to design subscription billing for a Shopify app?", "app-billing"],
    ["Open the Shopify app accessibility guidance and list the highest priority checks.", "app-accessibility"],
    ["Open the Shopify app authentication guidance and summarize its implementation checks.", "app-auth"],
  ]) {
    assert.equal(searchGuidance(publishedCatalog, query, 1)[0]?.id, expected, query);
  }
});

test("repeating query words does not change search relevance", () => {
  assert.deepEqual(searchGuidance(catalog, "OAuth session OAuth OAuth"), searchGuidance(catalog, "OAuth session"));
});

test("findGuidance returns only an exact catalog identifier", () => {
  assert.equal(findGuidance(catalog, "webhooks")?.title, "Webhooks");
  assert.equal(findGuidance(catalog, "WEBHOOKS"), null);
});

test("createBuildPlan adds domain guidance without promising execution", () => {
  const plan = createBuildPlan(catalog, "Build an OAuth-protected product inventory sync with webhooks");
  assert.ok(plan.recommendedGuidance.some((skill) => skill.id === "app-auth"));
  assert.ok(plan.recommendedGuidance.some((skill) => skill.id === "admin-graphql"));
  assert.ok(plan.recommendedGuidance.some((skill) => skill.id === "webhooks"));
  assert.match(plan.scope.join(" "), /do not use this planning output as authorization/i);
});
