# OpenCode guide

35 skills. The adapter registers the canonical skills directory once; it neither authenticates nor opens a network connection.

## Install

Use the documented OpenCode plugin method for .opencode/plugins/shopify-app-builder.js, or run this checkout's scripts/install-agent-skills.mjs install --agent opencode from the app project. Project copy uses .opencode/skills; global fallback uses .config/opencode/skills.
Use a verified checkout/release. npm and marketplace versions may lag GitHub; this guide does not assert publication or approval.

## Best use cases

- Terminal-led scaffold/build/test loops.
- Incremental REST-to-GraphQL migration.
- Optional CLI research with approved spending.
- Debugging with focused skills and redacted output.

## Operating guidelines

- Begin broad tasks with using-shopify-app-builder. Explain unfamiliar terms, recommend one small milestone, and track Done / Next / Blocked / Not tested.
- Inspect existing projects and preserve the framework, local customizations and unrelated changes.
- Use shopify-connections for official Dev/Partner/CLI setup. No bundled MCP or auto-configured connector is needed.
- Apify research is optional. Login is not paid-run authorization; inspect schema/pricing and approve input plus enforceable budget first. Use manual sources/exports if unavailable.
- Never read credential caches, print tokens or collect customer data for research. Operator-managed server secrets stay outside prompts/public files.
- Ask before store writes, access expansion, spending, charges, deployment and submission. Respect this host's permissions and delegation rules.
- Use current official Shopify docs; retained technical references may target older projects. Test before reporting success and distinguish local checks from live proof.

## Example prompts

```text
Use using-shopify-app-builder to guide the first app setup and verify a test-store page.
```

```text
Use app-market-research. Prepare a small sample but do not run a paid Actor without my approved budget.
```

## Verify

Confirm the skills path and invoke the router in a fresh session. Inspect one copied reference and a read-only workflow; native Claude roles are not automatically supported.
If upgrading from v1.x, remove the specific saved MCP connection and retired copied shopify-mcp folder after backing up customizations. A source update does not prove a host disconnected its old entry.
