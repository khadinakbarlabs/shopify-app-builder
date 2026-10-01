import { createServer } from "node:http";

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const MAX_REQUEST_BYTES = 64 * 1024;
const REQUEST_TIMEOUT_MS = 15_000;
const HEADERS_TIMEOUT_MS = 10_000;
const KEEP_ALIVE_TIMEOUT_MS = 5_000;

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "x-content-type-options": "nosniff",
  });
  response.end(JSON.stringify(payload));
}

export function createMcpRequestHandler({ createMcpServer, challengeToken = "" }) {
  return async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://localhost");
    const contentLength = Number(request.headers["content-length"] ?? 0);

    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      sendJson(response, 413, { error: "request_too_large" });
      return;
    }

    if (requestUrl.pathname === "/health" && request.method === "GET") {
      sendJson(response, 200, { status: "ok", service: "shopify-app-builder-mcp" });
      return;
    }

    if (requestUrl.pathname === "/.well-known/openai-apps-challenge" && request.method === "GET") {
      if (!challengeToken) {
        sendJson(response, 404, { error: "challenge_not_configured" });
        return;
      }
      response.writeHead(200, {
        "cache-control": "no-store",
        "content-type": "text/plain; charset=utf-8",
        "x-content-type-options": "nosniff",
      });
      response.end(challengeToken);
      return;
    }

    if (requestUrl.pathname !== "/mcp") {
      sendJson(response, 404, { error: "not_found" });
      return;
    }

    const mcpServer = createMcpServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    try {
      await mcpServer.connect(transport);
      await transport.handleRequest(request, response);
    } catch (error) {
      console.error("MCP request failed", error instanceof Error ? error.name : "unknown_error");
      if (!response.headersSent) sendJson(response, 500, { error: "mcp_request_failed" });
    } finally {
      transport.close().catch(() => {});
      mcpServer.close().catch(() => {});
    }
  };
}

export function createMcpHttpServer(options) {
  const server = createServer(createMcpRequestHandler(options));
  server.requestTimeout = REQUEST_TIMEOUT_MS;
  server.headersTimeout = HEADERS_TIMEOUT_MS;
  server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT_MS;
  return server;
}
