# OpenCode guide

OpenCode can load the toolkit as a native, dependency-free package that registers the canonical Agent Skills directory. Portable copying remains available as a fallback.

## Install

Add the package to `opencode.json`:

```json
{
  "plugin": [
    "shopify-app-builder@git+https://github.com/khadinakbarlabs/shopify-app-builder.git"
  ]
}
```

Restart OpenCode after changing the configuration.

Portable fallback:

```bash
npx skills add khadinakbarlabs/shopify-app-builder --skill '*' --agent opencode --copy --yes
```

Copy-only npm fallback:

```bash
npx shopify-app-builder install --agent opencode --global
```

## Best use cases

- Terminal-led Shopify CLI, extension, function, and deployment diagnostics.
- Focused repository implementation using named skills.
- GraphQL, webhook, authentication, and billing reviews that benefit from shell evidence.
- App listing and validation work where the output is a repository artifact.

## Operating guidelines

- Ask OpenCode to load `using-shopify-app-builder` before broad work, then name the selected focused skills.
- Treat the skill text as domain guidance and the repository/runtime output as the evidence source.
- Require exact commands and observed output for fixes; never assume a deployment succeeded.
- Keep credentials out of prompts, logs, commits, and generated fixtures.
- Require explicit approval before deployment, submission, billing changes, or paid spend.

## Example prompts

```text
Load using-shopify-app-builder and diagnose why shopify app dev fails in this repo.
Use shopify-functions to review this discount function against runtime limits.
Use merchant-pain-prevention before we ship this uninstall flow.
```

## Verify

Start a new OpenCode session in a test repository and ask it to read `using-shopify-app-builder`. Confirm a GraphQL throttling question routes to `admin-graphql` and `dev-troubleshooting`.
