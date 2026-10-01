# Shopify App Builder 1.5.2

This security and marketplace-compatibility release makes the shared skills
corpus safer for Claude Code, Codex, Cursor, and other compatible agent
harnesses.

## What changed

- Skills now model credentials as values supplied by an application operator to
  the target app's server-side secret store. They do not direct an agent to read
  machine-local environment values, dotfiles, keychains, browser storage, or
  existing host configuration.
- Hydrogen and authentication examples no longer include credential-shaped
  placeholder values.
- The Shopify MCP guidance no longer contains a download-and-run bootstrap or
  a credential-bearing local configuration example. It directs users to the
  official provider setup flow instead.
- Release validation tests now reject local runtime secret reads in every
  published `SKILL.md` file.
- The read-only MCP HTTP server now applies bounded request, header, and
  keep-alive timeouts to reduce slow-client resource exhaustion risk.

## Compatibility

The portable Agent Plugins manifest and native Claude Code, Codex, Cursor,
Gemini CLI, OpenCode, Command Code, and other Agent Skills-compatible surfaces
remain aligned at version 1.5.2. The optional MCP service is still read-only and
does not connect to Shopify or accept Shopify credentials.

## Submission note

For an existing Claude marketplace submission, continue the existing submission
after this version is pushed to the repository. If the portal reports that its
connected GitHub account cannot push, reconnect an account with write access to
`khadinakbarlabs/shopify-app-builder`; this is an account authorization gate,
not a source-package validation issue.
