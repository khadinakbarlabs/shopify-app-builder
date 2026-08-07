# Shopify App Builder 1.4.2

## Portable Agent Plugins standard

This release makes the repository directly consumable as an [Agent Plugins](https://agent-plugins.org/) 1.0 portable package. The root `plugin.json` identifies the package, its version, metadata, and the canonical schema. The existing immediate-child `skills/*/SKILL.md` layout remains the portable component surface.

## What did not change

- The 32 Shopify skills remain the single source of portable domain guidance.
- Native adapters for Claude Code, Codex, Cursor, Gemini CLI, and OpenCode remain available for their respective installation flows.
- The package remains dependency-free at install time, has no telemetry, and contains no MCP configuration or credential material.

## Validation

`npm run validate` now checks the Agent Plugins root manifest for the canonical schema, closed top-level field set, valid package name, valid metadata types, and version parity. `npm test` includes regression coverage that confirms the portable manifest is included in the npm package declaration.
