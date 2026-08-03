# Command Code guide

Command Code receives the portable `SKILL.md` collection through its project or global skills directory.

## Install

```bash
npx skills add khadinakbarlabs/shopify-app-builder --skill '*' --agent command-code --copy --yes
```

Dependency-free npm fallback:

```bash
npx shopify-app-builder install --agent command-code --global
```

## Best use cases

- Command-oriented Shopify scaffolding, migration, webhook, and audit tasks.
- Focused code generation using one or two named domain skills.
- Repeatable checks for Shopify configuration, API use, performance, and accessibility.
- Producing implementation plans before handing work to another coding harness.

## Operating guidelines

- Begin broad requests with `using-shopify-app-builder`; invoke focused skills by their directory name.
- Supply the repository path and desired outcome explicitly.
- Ask for a preview before any broad write and for verification after each change.
- Never provide credentials on the command line or authorize publication/spend implicitly.
- Confirm current Shopify versions and policies using official sources.

## Example prompts

```text
Use app-auth and webhooks to audit this webhook handler.
Use app-listing-optimization to draft a compliant listing from these verified product facts.
Use built-for-shopify-standards to produce a blocker-first readiness plan.
```

## Verify

Start a clean Command Code session and request `using-shopify-app-builder`. Confirm it identifies `shopify-cli` for scaffolding and `built-for-shopify-standards` for readiness review.
