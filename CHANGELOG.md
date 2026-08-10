# Changelog

## 1.5.1 - 2026-08-10

- Fixed the Vercel production bundle so the deployed MCP server resolves its isolated runtime dependencies while the public installer package remains dependency-free.

## 1.5.0 - 2026-08-10

- Added a real read-only Streamable HTTP MCP server for MCP-capable coding agents and the ChatGPT directory's **With MCP** submission path.
- Added bounded Shopify guidance search, retrieval, and deterministic build planning tools with explicit safety metadata.
- Added deployment and domain-verification guidance without embedding credentials or a public endpoint.

## 1.4.2 - 2026-08-07

- Added the canonical Agent Plugins 1.0 portable `plugin.json` manifest at the package root.
- Kept the shared `skills/` tree as the portable component surface while preserving native Claude Code, Codex, Cursor, Gemini CLI, and OpenCode adapters.
- Added release validation and regression coverage for the closed Agent Plugins manifest schema and npm package inclusion.

## 1.4.1 - 2026-08-03

- Normalized the npm executable path so published metadata matches the source manifest without registry correction warnings.

## 1.4.0 - 2026-08-03

- Standardized the repository as a native multi-harness plugin with Claude Code, Codex, Cursor, and Gemini CLI manifests.
- Added a repository-local Codex marketplace and direct Codex installation path.
- Added `using-shopify-app-builder`, a routing and safety skill that selects focused Shopify skills before work begins.
- Added separate use-case, operating-guideline, example, and verification guides for Claude Code, Codex, Cursor, OpenCode, Command Code, Gemini CLI, and other Agent Skills-compatible harnesses.
- Added a dependency-free OpenCode package adapter and Gemini CLI support to the copy-only npm installer.
- Expanded the release gate to verify every package surface and detect additional provider credential formats.

## 1.3.1 - 2026-08-03

- Fixed npm and `npx` execution through the package-manager-created binary symlink.
- Added a regression test that executes the installer through an npm-style symlink.

## 1.3.0 - 2026-08-03

- Removed personal publisher identity and local filesystem paths from public artifacts.
- Normalized all skill identifiers for portable Agent Skills discovery.
- Added Codex public-package metadata, square brand assets, and Claude marketplace metadata.
- Added npm packaging and a dependency-free installer for Claude Code, Codex, Cursor, OpenCode, Command Code, and universal Agent Skills directories.
- Replaced destructive cache cleanup instructions with a recoverable backup helper.
- Added privacy, terms, security, contribution, compatibility, and release-audit documentation.
- Added release tests, secret scanning, package-content validation, and CI checks.
- Corrected stale REST/GraphQL limits, API-version guidance, revenue-share rules, and unsupported Built for Shopify performance claims against current official documentation.

## 1.2.0

- Added 31 Shopify development, UX, quality, launch, and acquisition skills.
- Added 9 commands and 5 specialist Claude Code agents.
