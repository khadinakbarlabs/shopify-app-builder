# Agent compatibility

Shopify App Builder follows the Agent Plugins 1.0 package model: a root portable manifest, an immediate-child Agent Skills collection, and native adapters kept separate from the portable contract. This makes the same checkout understandable to standards-capable clients without flattening meaningful differences in installation and richer client behavior.

## Agent Plugins 1.0 portable core

| Standard requirement | This package | Verification |
| --- | --- | --- |
| One root portable manifest | [`plugin.json`](../plugin.json) declares the canonical `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json` identifier. | `npm run validate` checks schema identifier, closed top-level fields, name constraints, metadata types, and version parity. |
| Portable identity | `shopify-app-builder` is lowercase, hyphenated, 19 characters, and matches the npm package name. | Release validation compares `plugin.json` with `package.json`. |
| Fixed skills location | All 32 skills live at `skills/<skill-name>/SKILL.md`. | Release validation checks every immediate skill directory and its frontmatter name. |
| Package containment | The release validator rejects symlinks anywhere in public source. | `npm run validate` walks the package before publication. |
| Optional MCP | Root [`mcp.json`](../mcp.json) declares one public Streamable HTTP server without credentials or custom headers. | A compatible client can connect to three read-only guidance tools; installation creates no local MCP process. |
| Client extensions | `extensions.com.openai` provides OpenAI listing and review metadata. | Native adapters remain separate distribution artifacts and are documented below. |

Agent Plugins deliberately leaves distribution, permissions, installation, and user experience to each client. A successful manifest check means a client can identify the portable skills; it does not imply that every client supports every native adapter or automatically triggers every skill.

## Native and portable installation surfaces

| Agent or harness | Native package surface | Portable project directory | Portable global directory | Components |
| --- | --- | --- | --- | --- |
| Agent Plugins-compatible client | Root `plugin.json`, `mcp.json`, and `skills/` | Client-defined | Client-defined | 32 Agent Skills and one remote guidance MCP server |
| Claude Code | `.claude-plugin/plugin.json` and marketplace | `.claude/skills/` | `~/.claude/skills/` | Skills, commands, specialist agents |
| Codex | `.codex-plugin/plugin.json`, `.mcp.json`, and `.agents/plugins/marketplace.json` | `.agents/skills/` | `~/.codex/skills/` | Skills and the remote guidance MCP server |
| Cursor | `.cursor-plugin/plugin.json` | `.agents/skills/` | `~/.cursor/skills/` | Skills; manifest also declares commands and agents for compatible plugin installs |
| Gemini CLI | `gemini-extension.json` and `GEMINI.md` | `.gemini/skills/` | `~/.gemini/skills/` | Extension context and shared skills |
| OpenCode | `.opencode/plugins/shopify-app-builder.js` | `.opencode/skills/` | `~/.config/opencode/skills/` | Native skill-path registration or copied skills |
| Command Code | Agent Skills installer | `.commandcode/skills/` | `~/.commandcode/skills/` | Skills |
| Other compatible agents | Agent Skills installer | Harness-specific or `.agents/skills/` | Harness-specific or `~/.agents/skills/` | Skills |

## Capability tiers

Agent Plugins support means a client can load the root `plugin.json` and discover the immediate skill children. The current standard’s compatible-client directory identifies Cursor, VS Code, GitHub Copilot, ChatGPT & Codex, and Kiro as clients with Agent Skills support, but feature availability and installation commands remain client-specific.

Native plugin support means the repository includes the harness's manifest and package metadata. Public marketplace availability is separate and may require review by the marketplace operator.

Portable skill support means the harness can read one directory per skill with a `SKILL.md` file and matching YAML `name`. Automatic triggering varies by harness; explicitly invoke `using-shopify-app-builder` when needed.

Claude-specific command and agent definitions are not represented as native Codex, OpenCode, Command Code, or generic Agent Skills components. Those harnesses receive the same domain knowledge through the 32 canonical skills without pretending that harness-specific orchestration primitives are interchangeable. The root `plugin.json` contains only Agent Plugins fields; OpenAI-specific listing data is isolated under its standard extension namespace.

## Installation strategy

- For an Agent Plugins-compatible client, install or open the repository directory through that client’s documented package flow so it can read root `plugin.json` and `skills/`.
- Prefer the native plugin command for Claude Code and Codex when it offers richer harness-specific functionality.
- Use the Gemini extension for Gemini CLI and the git-backed package for OpenCode.
- Use `npx skills add khadinakbarlabs/shopify-app-builder` for the broadest current agent coverage.
- Use `npx shopify-app-builder install` when a dependency-free, copy-only fallback is preferred.

See [`docs/agents/`](agents/) for harness-specific use cases, guidelines, example prompts, and verification steps.
