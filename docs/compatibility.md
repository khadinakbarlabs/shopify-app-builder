# Agent compatibility

The `skills/` directory follows the portable Agent Skills layout: one directory per skill, a `SKILL.md` file, and YAML frontmatter with matching `name` and `description` fields.

| Agent or harness | Project directory | Global directory | Supported surface |
| --- | --- | --- | --- |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` | Skills; full plugin also adds commands and agents |
| Codex | `.agents/skills/` | `~/.codex/skills/` | Skills and Codex plugin manifest |
| OpenCode | `.opencode/skills/` | `~/.config/opencode/skills/` | Skills |
| Cursor | `.agents/skills/` | `~/.cursor/skills/` | Skills |
| Command Code | `.commandcode/skills/` | `~/.commandcode/skills/` | Skills |
| Other compatible agents | `.agents/skills/` | `~/.agents/skills/` | Portable skills |

The Claude-specific `commands/` and `agents/` directories are not advertised as portable. Other harnesses receive the equivalent domain knowledge through the 31 skills.

For the broadest compatibility, use the community `skills` CLI against the GitHub repository. The bundled npm installer provides a dependency-free alternative and skips existing skill directories unless `--force` is explicit.
