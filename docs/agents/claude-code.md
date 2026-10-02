# Claude Code guide

35 skills, 13 command definitions and 8 specialist-agent definitions. Confirm actual registration in your host; namespaced commands may apply.

## Install

Native plugin: /plugin marketplace add khadinakbarlabs/shopify-app-builder, then /plugin install shopify-app-builder@shopify-app-builder. Update/reload per your installed client. Copy fallback: run this checkout's scripts/install-agent-skills.mjs install --agent claude-code from your app project.
Use a verified checkout/release. npm and marketplace versions may lag GitHub; this guide does not assert publication or approval.

## Best use cases

- Beginner coaching with shopify-app-coach or the router.
- Small architecture/query/debugging reviews through bounded specialist roles.
- Guided start, connect, research and readiness commands.
- End-to-end feature development with explicit verification.

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
Use using-shopify-app-builder. I'm new: help me build one inventory-alert feature on a test store.
```

```text
Use app-market-research with manual sources first; show the input and budget before any Apify run.
```

## Verify

Use the host's plugin/command list and ask for shopify-connections and app-market-research in a fresh session. Test one synthetic beginner task before live account operations.
If upgrading from v1.x, remove the specific saved MCP connection and retired copied shopify-mcp folder after backing up customizations. A source update does not prove a host disconnected its old entry.
