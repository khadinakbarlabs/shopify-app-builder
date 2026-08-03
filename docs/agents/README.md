# Coding-agent guides

Shopify App Builder has native plugin manifests where the harness supports them and portable Agent Skills everywhere else.

| Harness | Distribution | Guide |
| --- | --- | --- |
| Claude Code | Native plugin marketplace | [Claude Code](claude-code.md) |
| OpenAI Codex | Native Codex marketplace plus Agent Skills fallback | [Codex](codex.md) |
| Cursor | Cursor plugin manifest plus Agent Skills fallback | [Cursor](cursor.md) |
| OpenCode | Portable Agent Skills | [OpenCode](opencode.md) |
| Command Code | Portable Agent Skills | [Command Code](command-code.md) |
| Gemini CLI | Gemini extension with shared skills | [Gemini CLI](gemini-cli.md) |
| Other coding agents | Portable Agent Skills | [Other agents](other-agents.md) |

All harnesses share the same canonical `skills/` content. Harness adapters describe discovery and invocation; they do not maintain divergent Shopify advice.
