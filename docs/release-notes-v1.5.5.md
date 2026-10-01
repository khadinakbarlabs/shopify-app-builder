# Shopify App Builder 1.5.5

Includes the App Bridge authentication, MCP credential-handling, and optional
binary-reference fixes from [1.5.4](release-notes-v1.5.4.md).

Claude's live directory validation cleared four of the five reported holds in
1.5.4. Its remaining finding incorrectly treated a tool metadata ignore rule as
a credential read. This release excludes private dotfiles and tool directories
by default and explicitly allows the portable plugin, npm, and CI metadata.
Private local configuration remains ignored.

The source still supports Claude Code, Codex, Cursor, OpenCode, Gemini CLI, and
other compatible agent harnesses. The optional MCP service retains its three
read-only tools. See the [MCP migration guide](../mcp-server/README.md) if a
deployment previously used the removed verification endpoint.
