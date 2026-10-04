# Agent compatibility

v2.1 is a local Agent Plugins 1.0 package with 36 contained Agent Skills, 17 command definitions and 8 specialist-agent definitions. There is no portable/native MCP configuration, hosted API source or app-account binding.

The project copilot's optional offline helper needs Node 20+ and access to the selected app folder. Complete copy-only skill installs retain the helper. Project state is local and ignored by default; it isn't automatically synchronized by the plugin. Scheduling requires a separately supported, explicitly configured runner. In chat-only hosts, use unsaved Markdown handoffs instead. See the copilot skill for conflict checks, privacy controls and report limitations.

## Portable core

Root plugin.json declares standard identity/version and an OpenAI listing extension. Skills are immediate children of skills/ with matching names/descriptions. References remain inside each skill or link to sibling installed skills; the copy installer transfers the complete collection.

A portable skill reader does not automatically understand another harness's subagent or slash-command model. An installed package is not evidence of native command/agent registration or marketplace acceptance.

## Supported surfaces

| Harness | Package surface | Portable fallback | Limits |
| --- | --- | --- | --- |
| Claude Code | .claude-plugin + skills, commands, agents | .claude/skills | Reload/update per client; namespaced commands may apply |
| Codex | .codex-plugin + local marketplace | .agents/skills; global .codex/skills | Skills are native; Claude command/agent files are reference workflows |
| Cursor | .cursor-plugin | .agents/skills; global .cursor/skills | Native richer surfaces vary with client/install method |
| OpenCode | .opencode/plugins path-registration adapter | .opencode/skills; global .config/opencode/skills | Adapter adds a skills path only; no network |
| Gemini CLI | gemini-extension.json + GEMINI.md | .gemini/skills | Use current extension/skill discovery supported by your client |
| Command Code | Copy installer convention | .commandcode/skills | Verify your build's path; not a claim of standardized native plugin support |
| Other agents | Agent Skills collection | .agents/skills or documented path | No universal native compatibility guarantee |

## Connection and execution boundaries

Shopify/Partner and optional Apify access are official user-selected CLI/browser workflows. The plugin has no connector IDs or automatic login. A host without terminal/files can plan and review supplied content but cannot run a local project. No MCP is required or auto-configured.

## Upgrade checks

Remove a saved old MCP connection separately through the host's controls. Back up custom skills before using --force; copied obsolete shopify-mcp folders are not deleted automatically. Verify the fresh router and new skill discovery after update. Old directory metadata snapshots and icon review are separate from serving-version status.

See [agent-specific guides](agents/README.md) and [the README](../README.md) for practical prompts.
