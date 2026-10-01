# Changelog

## 1.5.8 - 2026-10-01

- Fix GitHub Actions YAML parsing for the bundled MCP smoke check. This carries forward the MCP-backed OpenAI plugin package from 1.5.7.

## 1.5.7 - 2026-10-01

- Fixed the hosted MCP function bundle so production requests can initialize and use all three guidance tools. The npm skill installer remains dependency-free.
- Updated the MCP SDK and runtime dependencies; dependency audits report no known findings for the public package or MCP server at release time.
- Declared the public MCP endpoint for Agent Plugins and Codex clients and added OpenAI listing, test-case, and release metadata to the portable manifest.
- Packaged the existing square brand artwork referenced by the OpenAI listing metadata.
- Kept domain-verification material outside the public repository; a deployment operator must serve any portal-provided verification response separately.

## 1.5.6 - 2026-10-01

- Clarified theme schema setting identifiers and synthetic security-test fixtures so directory analysis does not confuse them with installer credentials. Existing validation behavior and secret-detection coverage are preserved.
- Claude's live directory scan passed with no policy holds after these changes. Includes all fixes and the hosted MCP migration documented in 1.5.4 and 1.5.5.

## 1.5.5 - 2026-10-01

- Excluded private dotfiles and tool metadata by default, with an explicit allowlist for portable plugin, packaging, and CI metadata. This preserves local configuration protection while addressing the final Claude directory false positive on an ignore rule.
- Includes all authentication and packaging fixes from 1.5.4; the hosted MCP domain-verification migration still applies.

## 1.5.4 - 2026-10-01

- Replaced manual App Bridge credential retrieval and forwarding examples with same-origin browser requests authenticated by App Bridge.
- Removed insecure Node and Python examples that accepted JWT claims without verifying their signatures; guidance now uses Shopify's maintained server authentication helper.
- Removed the environment-backed domain-verification endpoint from the optional MCP runtime and Vercel adapter. Deployment operators must serve any required verification response separately; see the MCP migration guide.
- Removed optional binary icon references from the Codex manifest and release script. Artwork remains available for manual directory uploads and is excluded from npm installation.
- Added regression checks for App Bridge credential handling, unverified JWTs, runtime environment reads, and accidental verification-value publication.

## 1.5.3 - 2026-10-01

- Removed unsafe hand-written OAuth example that accepted shop domains by substring and sent an app secret to a constructed URL.
- Replaced customer-token interpolation and legacy password-token flows with Hydrogen's Customer Account client.
- Removed command-line secret examples and unnecessary credential-adjacent remote URL examples from shared skills.
- Kept brand PNG assets as inert images required by the Codex manifest; directory asset warnings still require marketplace review.
- Added authentication-guidance regression coverage and synchronized agent/MCP manifest versions.

## 1.5.2 - 2026-10-01

- Replaced shipped credential-like examples and host environment reads in the shared skills corpus with explicit, server-only application configuration boundaries.
- Removed local-agent configuration and download-and-run guidance from the Shopify MCP skill; operators now complete third-party setup through the provider's current documentation.
- Added a regression test preventing shipped skills from reading local runtime secret sources.
- Synchronized the Claude Code, Codex, Cursor, Gemini CLI, Agent Plugins, npm, and MCP package versions for this release.

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
