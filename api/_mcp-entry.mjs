import path from "node:path";

import { loadGuidanceCatalog } from "../mcp-server/src/catalog.mjs";
import { createMcpRequestHandler } from "../mcp-server/src/http.mjs";
import { createShopifyAppBuilderServer } from "../mcp-server/src/server.mjs";

const projectRoot = path.resolve(__dirname, "..");
const skillsDirectory = path.join(projectRoot, "skills");
const catalog = loadGuidanceCatalog({ skillsDirectory });
const handleMcpRequest = createMcpRequestHandler({
  createMcpServer: () => createShopifyAppBuilderServer(catalog),
});

export default async function handler(request, response) {
  request.url = "/mcp";
  await handleMcpRequest(request, response);
}
