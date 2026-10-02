# Command Code guide

Portable skills and reference workflows. Do not assume a standardized native command marketplace or external skills-installer agent identifier.

## Install

Use the dependency-free checkout installer with install --agent command-code --dry-run first. .commandcode/skills is this package's convention, not a verified universal discovery guarantee; if your build differs, copy the full skills collection to its documented path.
Use a verified checkout/release. npm and marketplace versions may lag GitHub; this guide does not assert publication or approval.

## Best use cases

- Small command-oriented Shopify tasks.
- Previewing safe CLI actions before execution.
- Guided migrations and scoped implementation.
- Preparing an app checklist for another harness.

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
Use shopify-cli. Show the command, impact and expected result before executing it.
```

```text
Use app-release-readiness. Explain blockers and safe next steps; do not deploy.
```

## Verify

Check the host's documented skills path and invoke using-shopify-app-builder explicitly. If unavailable, provide the selected SKILL.md to the host as reference rather than claiming installation worked.
If upgrading from v1.x, remove the specific saved MCP connection and retired copied shopify-mcp folder after backing up customizations. A source update does not prove a host disconnected its old entry.
