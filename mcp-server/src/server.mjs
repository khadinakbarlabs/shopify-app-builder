import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { findGuidance, searchGuidance } from "./catalog.mjs";
import { createBuildPlan } from "./plan.mjs";

const SAFETY_ANNOTATIONS = Object.freeze({
  readOnlyHint: true,
  openWorldHint: false,
  destructiveHint: false,
});

function textResult(structuredContent, text) {
  return {
    structuredContent,
    content: [{ type: "text", text }],
  };
}

export function createShopifyAppBuilderServer(catalog, version = "1.5.1") {
  const server = new McpServer(
    { name: "shopify-app-builder", version },
    {
      instructions:
        "Shopify App Builder is a read-only engineering-guidance server. It never connects to a Shopify store, asks for credentials, or performs actions. Use search to discover focused guidance, fetch to read one document, and create_shopify_app_plan to produce a deterministic implementation checklist. Verify time-sensitive Shopify platform details against current official documentation before production work.",
    },
  );

  server.registerTool(
    "search",
    {
      title: "Search Shopify engineering guidance",
      description:
        "Use this when the user needs to find Shopify app engineering guidance for a specific feature, platform area, quality concern, or launch task.",
      inputSchema: {
        query: z.string().trim().min(2).max(240).describe("A focused Shopify app engineering query."),
        limit: z.number().int().min(1).max(10).optional().describe("Maximum number of matching guidance documents to return."),
      },
      outputSchema: {
        results: z.array(z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          url: z.string().url(),
        })),
      },
      annotations: SAFETY_ANNOTATIONS,
    },
    async ({ query, limit }) => {
      const results = searchGuidance(catalog, query, limit ?? 8);
      return textResult({ results }, results.length ? `Found ${results.length} guidance document${results.length === 1 ? "" : "s"}.` : "No matching guidance documents were found.");
    },
  );

  server.registerTool(
    "fetch",
    {
      title: "Fetch Shopify engineering guidance",
      description:
        "Use this after search when the user needs the complete guidance for one specific Shopify App Builder document.",
      inputSchema: {
        id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/).describe("The guidance document ID returned by search."),
        maxCharacters: z.number().int().min(1_000).max(24_000).optional().describe("Maximum guidance characters to return."),
      },
      outputSchema: {
        id: z.string(),
        title: z.string(),
        description: z.string(),
        text: z.string(),
        truncated: z.boolean(),
        url: z.string().url(),
      },
      annotations: SAFETY_ANNOTATIONS,
    },
    async ({ id, maxCharacters }) => {
      const entry = findGuidance(catalog, id);
      if (!entry) {
        throw new Error(`Guidance document "${id}" was not found. Use search to find a valid ID.`);
      }
      const maximum = maxCharacters ?? 12_000;
      const text = entry.body.slice(0, maximum);
      const truncated = text.length < entry.body.length;
      return textResult(
        { id: entry.id, title: entry.title, description: entry.description, text, truncated, url: entry.sourceUrl },
        `${entry.title}${truncated ? " (truncated)" : ""}.`,
      );
    },
  );

  server.registerTool(
    "create_shopify_app_plan",
    {
      title: "Create a Shopify app build plan",
      description:
        "Use this when the user wants a safe, phased implementation plan for a Shopify app feature or app idea before code, deployment, or store changes.",
      inputSchema: {
        goal: z.string().trim().min(8).max(2_000).describe("The Shopify app outcome to plan."),
        constraints: z.string().trim().max(2_000).optional().describe("Optional technical, product, compliance, or timeline constraints."),
      },
      outputSchema: {
        goal: z.string(),
        constraints: z.string().nullable(),
        scope: z.array(z.string()),
        phases: z.array(z.object({ name: z.string(), actions: z.array(z.string()) })),
        recommendedGuidance: z.array(z.object({ id: z.string(), title: z.string(), url: z.string().url() })),
      },
      annotations: SAFETY_ANNOTATIONS,
    },
    async ({ goal, constraints }) => {
      const plan = createBuildPlan(catalog, goal, constraints);
      return textResult(plan, `Created a ${plan.phases.length}-phase Shopify app build plan with ${plan.recommendedGuidance.length} guidance documents.`);
    },
  );

  return server;
}
