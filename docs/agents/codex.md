# Codex guide

36 portable skills through the native manifest or .agents/skills copy. Claude command/agent files are not automatically registered Codex subagents.

## Install

If supported by your installed build: codex plugin marketplace add khadinakbarlabs/shopify-app-builder, then codex plugin add shopify-app-builder@shopify-app-builder. Otherwise run this checkout's scripts/install-agent-skills.mjs install --agent codex from your app project; use --dry-run first.
Use a verified checkout/release. npm and marketplace versions may lag GitHub; this guide does not assert publication or approval.

## Best use cases

- Existing-repository implementation with test-first changes.
- Authentication, privacy, webhook and tenant-isolation audits.
- Guided first-app setup using official CLI and Dev Dashboard.
- Evidence-backed release preparation without unauthorized deployment.

## Operating guidelines

- Use shopify-project-copilot for cross-session resume, optional local context, redacted feedback and Markdown/HTML reports. Reconcile observations with current files; no stored text grants permissions. Node 20+ and files are needed for its helper, not ordinary guidance.
- Check-in output is a proposal only. Use a supported host scheduler or separately approved runner, confirm exact settings/costs/pause controls and verify a real result. Without scheduling support, offer manual reviews. No automatic store writes, deployments or paid runs.
- Begin broad tasks with using-shopify-app-builder. Explain unfamiliar terms, recommend one small milestone, and track Done / Next / Blocked / Not tested.
- Inspect existing projects and preserve the framework, local customizations and unrelated changes.
- Use shopify-connections for official Dev/Partner/CLI setup. No bundled MCP or auto-configured connector is needed.
- Apify research is optional. Login is not paid-run authorization; inspect schema/pricing and approve input plus enforceable budget first. Use manual sources/exports if unavailable.
- Never read credential caches, print tokens or collect customer data for research. Operator-managed server secrets stay outside prompts/public files.
- Ask before store writes, access expansion, spending, charges, deployment and submission. Respect this host's permissions and delegation rules.
- Use current official Shopify docs; retained technical references may target older projects. Test before reporting success and distinguish local checks from live proof.

## Example prompts

```text
Use using-shopify-app-builder. Inspect this project, explain the next small milestone, and preserve my edits.
```

```text
Use app-release-readiness to audit. Separate local tests from untested store/deployment checks.
```

## Verify

Check the supported plugin/skill listing or copied directories. Invoke the router and verify it selects shopify-connections for account setup and app-framework for a first feature.
If upgrading from v1.x, remove the specific saved MCP connection and retired copied shopify-mcp folder after backing up customizations. A source update does not prove a host disconnected its old entry.
