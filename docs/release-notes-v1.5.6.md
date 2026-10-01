# Shopify App Builder 1.5.6

Claude's live directory validation now passes with no policy holds. The source
fixes were verified against commit 7d0f757 in the Claude macOS app.

- Removed manual credential forwarding and unsigned JWT examples from App Bridge guidance.
- Removed automatic credential reads and the verification endpoint from the optional MCP deployment.
- Removed optional image references from executable scripts and Codex settings; artwork remains on GitHub for manual listing uploads.
- Protected local dotfiles while allowing portable plugin and CI metadata.
- Used explicit setting identifiers and synthetic fixture names so directory analysis can distinguish them from user credentials.

The three MCP tools and cross-agent manifests remain available. All 19 plugin
tests, 6 MCP tests, package checks, and secret-pattern checks passed during this
release work. Local checks and directory lint success do not mean marketplace
approval; submission status is reported separately.

Existing hosted MCP deployments that used the old domain-verification helper
must serve that response separately through their hosting platform or reverse
proxy. See the [migration guide](../mcp-server/README.md).
