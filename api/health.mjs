export default function handler(_request, response) {
  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "x-content-type-options": "nosniff",
  });
  response.end(JSON.stringify({ status: "ok", service: "shopify-app-builder-mcp" }));
}
