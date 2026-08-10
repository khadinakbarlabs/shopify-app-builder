import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadGuidanceCatalog } from "./catalog.mjs";
import { createMcpHttpServer } from "./http.mjs";
import { createShopifyAppBuilderServer } from "./server.mjs";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(moduleDirectory, "../..");
const skillsDirectory = process.env.SHOPIFY_APP_BUILDER_SKILLS_DIR ?? path.join(projectRoot, "skills");
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const host = process.env.HOST ?? "0.0.0.0";

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const catalog = loadGuidanceCatalog({ skillsDirectory });
const httpServer = createMcpHttpServer({
  createMcpServer: () => createShopifyAppBuilderServer(catalog),
  challengeToken: process.env.OPENAI_APPS_CHALLENGE_TOKEN ?? "",
});

httpServer.listen(port, host, () => {
  console.log(`Shopify App Builder MCP listening on http://${host}:${port}/mcp with ${catalog.length} guidance documents.`);
});
