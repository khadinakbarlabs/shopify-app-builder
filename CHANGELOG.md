# Changelog

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
