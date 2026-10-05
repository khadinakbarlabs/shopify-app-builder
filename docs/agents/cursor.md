# Cursor guide

36 portable skills; the native manifest additionally declares commands and roles where the current client supports them. Directory approval is separate.

## Install

Use Cursor's supported repository/plugin installation flow where available. Portable fallback: run this checkout's scripts/install-agent-skills.mjs install --agent cursor from the app project, with --dry-run first. Confirm your client discovers .agents/skills or use its documented location.
Use a verified checkout/release. npm and marketplace versions may lag GitHub; this guide does not assert publication or approval.

## Best use cases

- Interactive embedded-page iteration and current Polaris UI.
- Beginner first-feature implementation with visible diffs.
- Code-level GraphQL/auth/webhook debugging.
- Keyboard/mobile onboarding reviews before submission.

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
Use polaris-ui and ux-empty-error-states. Build one clear page and test loading, empty and failure states.
```

```text
Use using-shopify-app-builder. I'm new; explain what each change does before making it.
```

## Verify

For local native testing, copy the reviewed package (not an external symlink) into `~/.cursor/plugins/local/shopify-app-builder`, including its manifests/components. Restart or run Developer: Reload Window, then check Customize for the expected version/components. Local imports can be restricted by team policy; a marketplace install of the same name takes precedence. See [Cursor's current local testing instructions](https://cursor.com/docs/plugins#test-plugins-locally).

Preserve customized global skill copies. Move only byte-verified unmodified legacy copies into a recoverable backup outside active skill paths when consolidating, including the retired shopify-mcp skill. A copied folder is not proof that the current window loaded it or that a separately saved MCP connection was disconnected.

Confirm skill discovery in the actual project and ask for the router's first milestone. Inspect command/role registration rather than assuming Claude parity.
If upgrading from v1.x, remove the specific saved MCP connection and retired copied shopify-mcp folder after backing up customizations. A source update does not prove a host disconnected its old entry.
