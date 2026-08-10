# ChatGPT App submission checklist

This repository is ready to produce a **draft** MCP-backed submission only after the server is deployed and inspected. It is not a skills-only submission.

## Local evidence required first

- Run `npm test && npm run validate` from the repository root.
- Run `npm ci && npm test` from `mcp-server`.
- Start the server and use MCP Inspector against `http://localhost:3000/mcp`.
- Confirm all three tools initialize, validate invalid inputs, return only the documented guidance corpus, and have `readOnlyHint: true`, `openWorldHint: false`, and `destructiveHint: false`.

## Production evidence required before upload

- Deploy `mcp-server` and the checked-in `skills/` corpus to a stable HTTPS endpoint ending in `/mcp`.
- Confirm `GET /health` and Streamable HTTP MCP initialization on that exact production endpoint.
- Add the portal’s exact domain-verification token to the deployment host as `OPENAI_APPS_CHALLENGE_TOKEN`, then verify that `/.well-known/openai-apps-challenge` returns only that token.
- Use **With MCP** in the portal, enter the production MCP URL, run **Scan Tools**, and confirm the server discovers exactly `search`, `fetch`, and `create_shopify_app_plan`.
- Complete the verified developer identity, policy attestations, five positive cases, three negative cases, release notes, and required listing URLs.

## Do not claim approval or publication yet

Do not claim that the product is approved, published, or live until the production tool scan succeeds and OpenAI accepts the review submission. Do not put a localhost URL, temporary tunnel, Shopify credential, account session, or domain-verification token in the submission JSON.
