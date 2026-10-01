# OpenAI plugin submission checklist

Follow the [current submission guide](https://developers.openai.com/plugins/deploy/submission) and [plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines). This package contains skills and exactly one remote, read-only MCP server. The root `plugin.json` supplies OpenAI listing and review metadata through `extensions.com.openai`; the public submission ZIP must include `mcp.json`, the skills, and referenced assets, without app references, lifecycle hooks, or private credentials.

OpenAI cannot currently add an MCP server to an existing skills-only plugin. For such an older listing, submit a new package that includes the MCP configuration from its first upload; do not assume updating the older skills-only draft will attach it.

## Local evidence required first

- Run `npm test && npm run validate` from the repository root.
- Run `npm ci && npm test` from `mcp-server`.
- Start the server and use MCP Inspector against `http://localhost:3000/mcp`.
- Confirm all three tools initialize, validate invalid inputs, return only the documented guidance corpus, and have `readOnlyHint: true`, `openWorldHint: false`, and `destructiveHint: false`.

## Production evidence required before upload

- Deploy `mcp-server` and the checked-in `skills/` corpus to a stable HTTPS endpoint ending in `/mcp`.
- Confirm `GET /health` and Streamable HTTP MCP initialization on that exact production endpoint.
- If requested by the portal, configure a separate static hosting or reverse-proxy response at `/.well-known/openai-apps-challenge` on the MCP origin. Verify that it returns exactly the portal-provided value. The plugin runtime does not read or serve that value; keep deployment-specific verification material out of the public repository.
- Select the intended organization and project. The submitting account must be an organization Owner or have Apps Management Write, and its publisher identity must be verified.
- Open **Plugins → Upload new or existing plugin**, select the verified developer identity, and upload the complete OpenAI ZIP. Review **Metadata & Skills** checks and resolve required findings.
- Open **MCPs**, select the declared server, and choose **Connect**. Check its HTTPS URL and authentication mode. This server uses public guidance and requires no reviewer account or credentials.
- Host only the exact challenge token at the portal's HTTPS challenge URL. Do not use a fabricated token, JSON response, or token list, and do not overwrite another plugin's verification response.
- Complete the connection and tool scan, and confirm exactly `search`, `fetch`, and `create_shopify_app_plan` are discovered.
- Check **Review information → Review details**. The package supplies exactly five positive cases and three negative cases plus release notes. Run the cases in the connected client; check their behavior on desktop and mobile before claiming either client passed.
- The package supplies a [narrated MCP walkthrough](https://github.com/khadinakbarlabs/shopify-app-builder/releases/download/v1.5.9/shopify-app-builder-v1.5.9-mcp-walkthrough.mp4). It shows snapshots of a diagnostic client running real production requests, with five positive tool checks and three unsupported-operation probes. The [live evidence](https://github.com/khadinakbarlabs/shopify-app-builder/releases/download/v1.5.9/live-evidence.json) contains the responses. It does not establish ChatGPT desktop/mobile behavior or evaluate client-generated refusal wording; complete those client checks separately and provide an additional client recording if reviewers request one.
- Check the four public listing URLs, imported publisher identity, and safe tool annotations. No account credentials belong in the ZIP. If a later authenticated version requires reviewer access, enter dedicated sample-account credentials only in the secure dashboard form.
- Once required scans and materials are complete, select **Submit for review** and complete the portal's attestations. Track the review status. After approval, select **Publish plugin**; approval and publication are distinct steps.

## Portal failure observed during preparation

On October 1, 2026, the intended publisher was verified and the signed-in account had the Owner role, but the built-in browser's plugin-list request returned HTTP 500, `server_error`, with an internal-server-error message. The UI showed **Unable to refresh plugins** and disabled Upload. This happened before any ZIP was uploaded, so it is not evidence of a package validation failure. Portal access must recover before upload, domain verification, and review can proceed.

## Do not claim approval or publication yet

Do not claim that the product is approved, published, or live until the production tool scan succeeds and OpenAI accepts the review submission. Do not put a localhost URL, temporary tunnel, Shopify credential, account session, or domain-verification token in the submission JSON.
