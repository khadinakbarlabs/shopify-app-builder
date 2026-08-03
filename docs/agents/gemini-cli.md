# Gemini CLI guide

Gemini CLI loads `GEMINI.md` as extension context and uses the same 32 focused skill files as the other harnesses.

## Install

```bash
gemini extensions install https://github.com/khadinakbarlabs/shopify-app-builder
```

Update later with:

```bash
gemini extensions update shopify-app-builder
```

## Best use cases

- Large-context reviews of Shopify repositories, documentation, and implementation plans.
- Cross-file audits of GraphQL, authentication, webhooks, billing, UX, and App Store readiness.
- Comparing architecture options before implementation.
- Generating scoped implementation instructions for a separate execution agent.

## Operating guidelines

- Let `GEMINI.md` route the request, then have Gemini read only the relevant `SKILL.md` files.
- Separate facts observed in the repository from assumptions and time-sensitive platform claims.
- Verify current Shopify behavior in official documentation before recommending production changes.
- Do not expose credentials or treat analysis as authorization to deploy, submit, change billing, or spend money.
- Ask for concrete file and command evidence in completion reports.

## Example prompts

```text
Use Shopify App Builder to review this architecture and identify missing auth, billing, and webhook boundaries.
Read the relevant Shopify App Builder skills and produce a Built for Shopify gap analysis.
Route this Hydrogen performance problem to the smallest relevant skill set.
```

## Verify

```bash
gemini extensions list
```

Start a new Gemini CLI session and ask which skill covers Shopify OAuth. It should identify `app-auth` and may add `dev-troubleshooting` for an active failure.
