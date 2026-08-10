import assert from "node:assert/strict";
import { once } from "node:events";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { loadGuidanceCatalog } from "../src/catalog.mjs";
import { createMcpHttpServer } from "../src/http.mjs";
import { createShopifyAppBuilderServer } from "../src/server.mjs";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const catalog = loadGuidanceCatalog({ skillsDirectory: path.resolve(testDirectory, "../../skills") });

test("Streamable HTTP server exposes only the documented read-only tools", async () => {
  const httpServer = createMcpHttpServer({
    createMcpServer: () => createShopifyAppBuilderServer(catalog),
  });
  httpServer.listen(0, "127.0.0.1");
  await once(httpServer, "listening");
  const address = httpServer.address();
  assert.ok(address && typeof address !== "string");

  const client = new Client({ name: "test-client", version: "1.0.0" });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${address.port}/mcp`)));
    const tools = await client.listTools();
    assert.deepEqual(tools.tools.map((tool) => tool.name), ["search", "fetch", "create_shopify_app_plan"]);
    assert.ok(tools.tools.every((tool) => tool.annotations?.readOnlyHint === true));
    assert.ok(tools.tools.every((tool) => tool.annotations?.openWorldHint === false));
    assert.ok(tools.tools.every((tool) => tool.annotations?.destructiveHint === false));

    const search = await client.callTool({ name: "search", arguments: { query: "OAuth authentication", limit: 3 } });
    assert.match(search.content[0].text, /^Found /);

    const fetch = await client.callTool({ name: "fetch", arguments: { id: "app-auth", maxCharacters: 1_000 } });
    assert.match(fetch.content[0].text, /App Auth/);

    const missing = await client.callTool({ name: "fetch", arguments: { id: "does-not-exist" } });
    assert.equal(missing.isError, true);
    assert.match(missing.content[0].text, /was not found/);
  } finally {
    await client.close();
    await new Promise((resolve, reject) => httpServer.close((error) => (error ? reject(error) : resolve())));
  }
});
