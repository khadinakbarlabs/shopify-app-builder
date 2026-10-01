import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadGuidanceCatalog } from "../mcp-server/src/catalog.mjs";
import { createMcpRequestHandler } from "../mcp-server/src/http.mjs";
import { createShopifyAppBuilderServer } from "../mcp-server/src/server.mjs";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(moduleDirectory, "..");
const skillsDirectory = path.join(projectRoot, "skills");
const catalog = loadGuidanceCatalog({ skillsDirectory });
const handleMcpRequest = createMcpRequestHandler({
  createMcpServer: () => createShopifyAppBuilderServer(catalog),
});

export default async function handler(request, response) {
  request.url = "/mcp";
  await handleMcpRequest(request, response);
}
