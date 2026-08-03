# Agent compatibility

Shopify App Builder follows the same layered distribution pattern used by established coding-agent plugins: a canonical root package, native manifests for plugin-capable harnesses, and portable Agent Skills for the long tail of agents.

| Agent or harness | Native package surface | Portable project directory | Portable global directory | Components |
| --- | --- | --- | --- | --- |
| Claude Code | `.claude-plugin/plugin.json` and marketplace | `.claude/skills/` | `~/.claude/skills/` | Skills, commands, specialist agents |
| Codex | `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json` | `.agents/skills/` | `~/.codex/skills/` | Skills and Codex plugin metadata |
| Cursor | `.cursor-plugin/plugin.json` | `.agents/skills/` | `~/.cursor/skills/` | Skills; manifest also declares commands and agents for compatible plugin installs |
| Gemini CLI | `gemini-extension.json` and `GEMINI.md` | `.gemini/skills/` | `~/.gemini/skills/` | Extension context and shared skills |
| OpenCode | `.opencode/plugins/shopify-app-builder.js` | `.opencode/skills/` | `~/.config/opencode/skills/` | Native skill-path registration or copied skills |
| Command Code | Agent Skills installer | `.commandcode/skills/` | `~/.commandcode/skills/` | Skills |
| Other compatible agents | Agent Skills installer | Harness-specific or `.agents/skills/` | Harness-specific or `~/.agents/skills/` | Skills |

## Capability tiers

Native plugin support means the repository includes the harness's manifest and package metadata. Public marketplace availability is separate and may require review by the marketplace operator.

Portable skill support means the harness can read one directory per skill with a `SKILL.md` file and matching YAML `name`. Automatic triggering varies by harness; explicitly invoke `using-shopify-app-builder` when needed.

Claude-specific command and agent definitions are not represented as native Codex, OpenCode, Command Code, or generic Agent Skills components. Those harnesses receive the same domain knowledge through the 32 canonical skills without pretending that harness-specific orchestration primitives are interchangeable.

## Installation strategy

- Prefer the native plugin command for Claude Code and Codex.
- Use the Gemini extension for Gemini CLI and the git-backed package for OpenCode.
- Use `npx skills add khadinakbarlabs/shopify-app-builder` for the broadest current agent coverage.
- Use `npx shopify-app-builder install` when a dependency-free, copy-only fallback is preferred.

See [`docs/agents/`](agents/) for harness-specific use cases, guidelines, example prompts, and verification steps.
