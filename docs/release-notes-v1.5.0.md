# Shopify App Builder 1.5.0

Released 2026-08-10.

## Added

- A real Streamable HTTP MCP server for Shopify App Builder.
- Read-only `search`, `fetch`, and `create_shopify_app_plan` tools with explicit safety annotations.
- A health endpoint and a configurable OpenAI domain-verification challenge endpoint.
- Local Inspector, Docker, production deployment, and multi-agent connection instructions.

## Changed

- ChatGPT directory submissions now use the MCP **With MCP** path. The existing portable skills package remains available only for harnesses that install local skills.

## Security

- The MCP server has no Shopify client, credentials, telemetry, database, authentication flow, write tools, or external side effects.
- Tool inputs are bounded, responses are capped, and the production challenge token is environment-configured rather than committed.
