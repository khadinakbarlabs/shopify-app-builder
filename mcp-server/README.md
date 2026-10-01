# Shopify App Builder MCP server

This is the MCP-backed distribution path for Shopify App Builder. It exposes three read-only tools over the repository's Shopify engineering guidance:

- `search` finds a focused guidance document.
- `fetch` retrieves one selected document.
- `create_shopify_app_plan` produces a deterministic phased build plan without writing code, accessing a Shopify store, or requesting credentials.

The service has no database, telemetry, Shopify API client, user authentication, or write tools. It runs against the checked-in `../skills` directory, which must be included in a deployment.

## Local run

```bash
cd mcp-server
npm install
npm start
```

The MCP endpoint is `http://localhost:3000/mcp` and the health endpoint is `http://localhost:3000/health`.

Use MCP Inspector to verify initialization and each tool before connecting a client:

```bash
npx @modelcontextprotocol/inspector
```

Choose **Streamable HTTP** and enter `http://localhost:3000/mcp`.

## Deploy for public review

Build from the repository root so the Docker image can copy the canonical guidance corpus:

```bash
docker build -f mcp-server/Dockerfile -t shopify-app-builder-mcp .
docker run --rm -p 3000:3000 shopify-app-builder-mcp
```

This repository also includes a Vercel adapter. From the repository root, use `vercel --prod`; the build installs the nested server dependencies, bundles them into the function, and exposes `/mcp` and `/health`. The public plugin runtime does not read or serve credentials or domain-verification values. Verify an MCP `initialize` request after deployment; the health endpoint alone does not prove the function bundle contains its dependencies.

Deploy that image to a stable HTTPS origin and submit the resulting `https://your-domain.example/mcp` endpoint with **With MCP** in the OpenAI plugin portal. A localhost server or temporary tunnel is suitable for development only, not directory review.

If the portal asks for a response at `/.well-known/openai-apps-challenge`, configure that exact response as a separate static asset or reverse-proxy route on the deployment's HTTPS origin. The operator supplies the portal value directly to their hosting platform; do not put it in the public plugin repository or an agent's local configuration.

### Migration from 1.5.3 and earlier

The environment-backed verification helper has been removed. Existing deployments that used it must configure the separate verification response before upgrading if their directory still needs that endpoint. The MCP tool protocol and tool names are unchanged. `HOST`, `PORT`, and `SHOPIFY_APP_BUILDER_SKILLS_DIR` remain available for server binding and guidance configuration.

## Client connection

Any MCP client that supports Streamable HTTP can use the deployed `/mcp` URL. For Codex, add the server in the MCP settings UI or configure a `url` entry under `[mcp_servers.shopify-app-builder]`. In Claude Code, Cursor, OpenCode, and other coding agents, add the same endpoint as a remote Streamable HTTP MCP server using that client’s MCP settings.

The service is read-only and does not require OAuth. Do not add a bearer token unless a future deployment change introduces protected data or write actions.
