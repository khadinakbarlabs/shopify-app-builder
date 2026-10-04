# Changelog

## 2.1.0 — 2026-10-05

- Add a portable local project copilot for source-backed facts, decisions, cross-session handoffs, optional feedback and milestone evidence. Preserve existing projects and flag stale assumptions before using them.
- Add an offline Node helper and `shopify-project` CLI for explicit initialization, validated conflict-safe updates, status, feedback, and local Markdown/responsive script-free HTML reports. No network, telemetry, credential discovery or background service.
- Add four guided commands: resume-shopify-app, report-shopify-app, feedback-shopify-app and plan-shopify-check-ins. Now 36 skills, 17 command definitions and 8 specialist-agent definitions.
- Add bounded quality/feedback/API check-in proposals, with explicit timezone and host/runner authorization rather than automatic schedules. Update harness guidance and local data/privacy controls.
- Add executable behavioral and security regressions for resume, stale context, evidence levels, untrusted feedback, validation, conflicting writers, symlinks and copy-only installation. Host/model evaluations remain distinct from these local tests.

## 2.0.1 — 2026-10-02

- Allow the approved verified business identity in explicit public publisher fields of submission copies. Unknown identity variants, unrelated identity text and credential patterns remain rejected.
- Add regression coverage for the business-name allowance and retained rejection boundaries.
- Explain directory-only Claude fields, the portable manifest notice and static-PNG review references without deleting branding, policy links or test coverage to evade validation.

## 2.0.0 — 2026-10-02

- Breaking: removed bundled MCP configuration, runtime/API source, hosting config and obsolete MCP submission metadata. Existing hosted deployments/connections require separate removal.
- Reworked every skill into a beginner-first, goal-led entrypoint with optional technical references. Now 35 skills, 13 guided commands and 8 specialist-agent roles.
- Added official Shopify CLI/Dev Dashboard/Partner setup and optional Apify CLI app-market research with explicit target/input/budget gates and manual fallback.
- Added app foundation and release-readiness workflows; corrected unsafe credential-cache debugging, misleading deployment proofs and unconditional legacy-template defaults.
- Updated privacy, compatibility, install/upgrade guidance and offline research helper tests. No publisher credentials or automatic paid calls are included.


## 1.5.11 - 2026-10-02

- Corrected public publisher attribution and homepage links across agent manifests and npm metadata.
- Declared Claude directory icon, documentation, support, privacy-policy, and terms links using the documented listing fields.
- Added regression checks for Claude listing completeness and precise public-publisher allowances in the release scanner; credential detection remains active.
- Image-screening and portable-manifest notices remain review information, not claims that artwork is executed as code. The existing optional MCP configuration is unchanged; the separate OpenAI skills-only edition has no remote connection.

## 1.5.10 - 2026-10-02 (OpenAI skills-only submission edition)

- Prepared a separate 32-skill OpenAI upload without an MCP connection. Not a GitHub or npm release; the existing OpenAI MCP draft cannot accept a server-inventory change.

## 1.5.9 - 2026-10-01

- Declared the remote HTTP transport in the native `.mcp.json` configuration so Claude does not drop the server as a malformed stdio entry. Added a regression test while preserving the portable Agent Plugins transport name.
- Fixed guidance search ranking so the subject requested in billing, authentication, and accessibility review prompts outranks repeated generic Shopify text. Added regression tests against the shipped corpus.
- Expanded the published privacy policy with input purposes, hosting and support recipients, retention details, and user controls.
- Clarified safe fallback behavior in the three negative OpenAI review cases and refreshed the submission checklist against the current documentation.

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
