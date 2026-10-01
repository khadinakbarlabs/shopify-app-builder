# Shopify App Builder 1.5.4

This release addresses the source patterns behind the five Claude directory
policy holds reported for 1.5.3. Marketplace validation must be rerun against
this release; local tests alone do not establish directory approval.

## Changes

- App Bridge examples use same-origin browser fetch with App Bridge's built-in
  authentication. They no longer manually retrieve or forward session values.
- Server examples use Shopify's maintained `authenticate.admin(request)` helper.
  Removed Node and Python examples that decoded JWT claims without checking
  signatures, which would have allowed forged requests if copied into an app.
- MCP entrypoints no longer read domain-verification material from the host's
  environment. The server no longer serves the old verification endpoint.
- Codex's optional local icon/logo fields and image paths in the release script
  were removed. Codex uses its default icon. Existing artwork URLs remain
  available on GitHub for manual directory upload, but artwork is excluded from
  npm installation and is not referenced by executable code or plugin settings.
- Added release regression checks for these security boundaries.

## Hosted MCP migration

The MCP tools, `/mcp`, `/health`, and server binding configuration are unchanged.
If a submission portal requires `/.well-known/openai-apps-challenge`, configure
the exact response separately through your hosting platform or reverse proxy
before upgrading an existing deployment. Do not commit verification material
to the public plugin. See the [MCP deployment guide](../mcp-server/README.md).

## Claude submission

Continue the existing submission for `khadinakbarlabs/shopify-app-builder` and
revalidate the latest `main` commit. The portable root manifest is intentionally
retained for other agents; Claude uses `.claude-plugin/plugin.json`.
