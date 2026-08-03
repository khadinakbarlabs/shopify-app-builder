# Codex guide

Codex receives the 32 portable skills through the native Codex plugin manifest. Claude-specific slash commands and specialist-agent definitions are not presented as native Codex components.

## Install

```bash
codex plugin marketplace add khadinakbarlabs/shopify-app-builder
codex plugin add shopify-app-builder@shopify-app-builder
```

Portable fallback:

```bash
npx skills add khadinakbarlabs/shopify-app-builder --skill '*' --agent codex --copy --yes
```

## Best use cases

- Repository-wide Shopify implementation and refactoring with file-level verification.
- Security-sensitive authentication, webhook, billing, and scope audits.
- Debugging GraphQL, CLI, extension, and embedded-app failures from terminal evidence.
- Pre-release checks where builds, tests, source inspection, and live-surface verification must be kept distinct.

## Operating guidelines

- Name `using-shopify-app-builder` on the first broad Shopify request, or name a focused skill directly.
- Ask Codex to inspect the repository before selecting framework- or version-specific advice.
- Preserve unrelated dirty-worktree changes and require focused tests for edits.
- Keep deployment, Partner Dashboard, App Store submission, billing, and advertising actions behind explicit authorization.
- Use official Shopify documentation for time-sensitive API and platform claims.

## Example prompts

```text
Use using-shopify-app-builder to route this request, then fix our webhook HMAC verification and test it.
Use built-for-shopify-standards to audit this app; report blockers before changing files.
Use admin-graphql to replace this REST product sync with a cost-aware GraphQL flow.
```

## Verify

```bash
codex plugin list
```

Confirm `shopify-app-builder` is installed, start a new task, and ask Codex to identify the relevant skills for an OAuth loop.
