# Cursor guide

Cursor can consume the native `.cursor-plugin/plugin.json` package surface or install the shared Agent Skills collection directly.

## Install

Until the plugin is accepted into Cursor's public marketplace, use the portable installation path:

```bash
npx skills add khadinakbarlabs/shopify-app-builder --skill '*' --agent cursor --copy --yes
```

The repository already includes the Cursor manifest needed for marketplace submission and compatible direct-plugin tooling.

## Best use cases

- In-editor implementation of Polaris, App Bridge, Remix, and Shopify API flows.
- Reviewing selected files or diffs for scopes, HMAC handling, GraphQL errors, and UX anti-patterns.
- Generating small extensions or webhook handlers while keeping the active code context visible.
- Applying focused Shopify guidance during Composer or Agent workflows.

## Operating guidelines

- Reference a skill by name in the prompt when the automatic trigger is ambiguous.
- Include the relevant configuration, route, extension, or schema files in context; do not ask the agent to infer them.
- Request a focused diff and verification command for each change.
- Do not paste live secrets into chat or accept a deployment/publication action without explicit approval.
- Re-check unstable Shopify facts against official documentation.

## Example prompts

```text
Use polaris-ui and ux-polaris-antipatterns to review the selected route.
Use app-auth to fix this token-exchange handler without widening scopes.
Use ux-empty-error-states to implement loading, empty, and partial-failure states here.
```

## Verify

Start a new Cursor Agent chat and ask it to use `using-shopify-app-builder`. Confirm it can read the installed skill and route a webhook request to `webhooks` plus `app-auth`.
