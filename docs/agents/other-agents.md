# Other coding agents

Any harness that implements the open Agent Skills directory convention can use the canonical `skills/` collection. This tier includes Windsurf, Cline, Roo Code, Kilo Code, Continue, and other profiles supported by the community `skills` CLI; exact support depends on the installed CLI version.

## Install

List the repository's skills first:

```bash
npx skills add khadinakbarlabs/shopify-app-builder --list
```

Then replace `<agent-profile>` with a profile supported by your current `skills` CLI:

```bash
npx skills add khadinakbarlabs/shopify-app-builder --skill '*' --agent <agent-profile> --copy --yes
```

If a harness reads `.agents/skills/`, the bundled universal fallback is:

```bash
npx shopify-app-builder install --agent universal --global
```

## Best use cases

- Domain-specific Shopify guidance inside an existing coding-agent workflow.
- Portable GraphQL, authentication, billing, webhook, Functions, storefront, UX, and launch reviews.
- Natural-language routing when the harness recognizes skill descriptions.
- Manual skill selection when automatic triggers are unavailable.

## Operating guidelines

- Confirm that the chosen harness actually discovers installed skills; compatibility is not the same as automatic activation.
- Invoke `using-shopify-app-builder` explicitly when the harness lacks trigger-based routing.
- Use only the domain guidance relevant to the task and keep the harness's own permission model intact.
- Verify unstable Shopify facts against official sources and keep credentials out of prompts and generated files.
- Require explicit approval for deployment, publication, billing, or paid advertising.

## Example prompts

```text
Read the using-shopify-app-builder skill and route this Shopify request.
Use webhooks and app-auth to review this handler.
Use app-performance and built-for-shopify-standards for a pre-ship audit.
```

## Verify

Open a new session in the target harness and ask it to identify the installed Shopify App Builder skills. If it cannot, inspect that harness's current Agent Skills directory documentation or use the universal `.agents/skills/` fallback.
