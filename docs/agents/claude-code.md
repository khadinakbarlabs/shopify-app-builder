# Claude Code guide

Claude Code receives the complete plugin: 32 skills, 9 slash commands, and 5 specialist agents.

## Install

```text
/plugin marketplace add khadinakbarlabs/shopify-app-builder
/plugin install shopify-app-builder@shopify-app-builder
```

Restart Claude Code after installing or updating.

## Best use cases

- End-to-end app architecture with the `shopify-app-architect` specialist agent.
- Focused GraphQL, debugging, listing, or pre-submission reviews through specialist agents.
- Repeatable actions through `/init-shopify-app`, `/graphql`, `/add-webhook`, `/audit-scopes`, and the other bundled commands.
- Automatic routing from natural-language Shopify requests into focused skills.

## Operating guidelines

- Start broad Shopify work with `using-shopify-app-builder`, then load only the focused skills it identifies.
- Use a specialist agent for a bounded review or artifact; keep consequential deployment and publication decisions in the main user conversation.
- Treat slash commands as guided workflows, not permission to deploy, submit, spend, or expose credentials.
- Verify current Shopify behavior in official documentation before changing production code.

## Example prompts

```text
Use shopify-app-architect to design the smallest production architecture for this app idea.
/audit-scopes shopify.app.toml
Use shopify-app-ux-reviewer for a pre-submission audit of this repository.
```

## Verify

```bash
claude plugin list
claude plugin details shopify-app-builder@shopify-app-builder
```

In a new session, ask: `Which Shopify App Builder skill should handle an OAuth redirect loop?` The answer should route to `app-auth` and usually `dev-troubleshooting`.
