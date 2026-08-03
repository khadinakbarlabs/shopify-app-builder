# Shopify App Builder: 31 Agent Skills for Claude Code, Codex, Cursor, and OpenCode

[![npm](https://img.shields.io/npm/v/shopify-app-builder)](https://www.npmjs.com/package/shopify-app-builder)
[![license](https://img.shields.io/badge/license-MIT-0b6e4f)](LICENSE)
[![Shopify](https://img.shields.io/badge/Shopify-app%20development-004c3f)](https://shopify.dev/docs/apps)

Shopify App Builder is a comprehensive open-source toolkit for AI coding agents that build, debug, audit, launch, and grow Shopify apps. It packages 31 focused Agent Skills, 9 Claude Code commands, 5 Claude Code specialist agents, and deterministic validation scripts.

It works with Claude Code, OpenAI Codex, Cursor, OpenCode, Command Code, and other tools that support the portable `SKILL.md` Agent Skills format.

> This community project is not affiliated with, endorsed by, or sponsored by Shopify. Shopify and related marks belong to Shopify Inc.

## Install

### Any supported coding agent

The open Agent Skills installer supports Claude Code, Codex, Cursor, OpenCode, Command Code, and many other harnesses:

```bash
npx skills add khadinakbarlabs/shopify-app-builder --list
npx skills add khadinakbarlabs/shopify-app-builder --skill '*' --agent codex --copy --yes
```

Replace `codex` with `claude-code`, `cursor`, `opencode`, or `command-code`. Use `--agent '*'` only when you intentionally want every detected agent configured.

### npm

```bash
npx shopify-app-builder install --agent codex --global
npx shopify-app-builder install --agent cursor --global
npx shopify-app-builder install --all --dry-run
```

The npm installer copies only bundled skill directories. It has no runtime dependencies, no network calls, no telemetry, and no install or postinstall hook. Existing skills are skipped unless `--force` is explicitly supplied.

### Claude Code plugin marketplace

```text
/plugin marketplace add khadinakbarlabs/shopify-app-builder
/plugin install shopify-app-builder@shopify-app-builder
```

Claude Code automatically discovers the plugin's skills, commands, and specialist agents.

### Clone or download

```bash
git clone https://github.com/khadinakbarlabs/shopify-app-builder.git
cd shopify-app-builder
npm test
npm run validate
```

## What is included

### Shopify engineering

- Admin GraphQL and legacy REST migration
- Shopify CLI, app configuration, and extensions
- App Bridge, Polaris, and embedded-app patterns
- OAuth, token exchange, managed install, session storage, and HMAC verification
- Billing, webhooks, Functions, Storefront API, Hydrogen, Liquid, metafields, metaobjects, B2B, and Markets
- Development troubleshooting and schema-ID validation

### Product quality

- Accessibility and WCAG-oriented reviews
- Performance budgets and Built for Shopify readiness
- Onboarding, empty/loading/error states, and merchant-pain prevention
- Polaris anti-patterns and modern embedded-app UX

### Launch and growth

- App idea validation and niche research
- Naming, pricing, listing optimization, and App Store SEO
- Shopify App Store advertising with explicit spend approval gates

Browse the complete catalog in [`skills/`](skills/).

## Example prompts

- “Build a Shopify app that lets merchants A/B test product titles.”
- “Audit this embedded app for Built for Shopify blockers.”
- “Debug this GraphQL 200 response with throttle errors.”
- “Add and verify an `orders/paid` webhook.”
- “Review this App Store listing for keyword relevance and conversion.”

## Safety and credential handling

- The package contains no credentials and does not request Shopify credentials during installation.
- Credential examples use placeholders and environment variables.
- The release check rejects private keys, common live-token formats, personal filesystem paths, and mismatched skill identifiers.
- Cache troubleshooting uses a recoverable backup script instead of `rm -rf`.
- Deployment, paid advertising, publication, and other consequential actions still require the user's explicit instruction in the active agent session.

See [SECURITY.md](SECURITY.md), [PRIVACY.md](PRIVACY.md), and [the release audit](docs/release-audit.md).

## Compatibility

The portable skills use standard YAML frontmatter with a lowercase hyphenated `name` matching the skill directory. Harness-specific commands and specialist agents remain under `commands/` and `agents/` for Claude Code, while every supported harness can load the `skills/` collection.

See [the compatibility matrix](docs/compatibility.md) for exact installation locations and limitations.

## Accuracy and versioned APIs

Shopify APIs, CLI behavior, App Bridge, Polaris, review criteria, and advertising surfaces change over time. Skills identify their reference versions where practical, but agents must verify time-sensitive claims against current official Shopify documentation before shipping production code or spending money.

## Contributing

Bug fixes, source corrections, new tests, and focused Shopify skills are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and follow the security policy before opening a pull request.

## License

MIT. See [LICENSE](LICENSE).
