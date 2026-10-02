# Gemini CLI guide

35 skills and extension context, not automatic Claude-style subagent/command registration.

## Install

Use the installed Gemini version's supported extension flow for this repository, or the checkout installer with install --agent gemini-cli. Preserve the GEMINI.md context and complete skill directories; verify the host's current discovery behavior.
Use a verified checkout/release. npm and marketplace versions may lag GitHub; this guide does not assert publication or approval.

## Best use cases

- Repository-based setup and implementation plans.
- Focused API and extension tasks.
- Beginner-guided development-store workflow.
- Tests and readiness checks with shell evidence.

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
Use using-shopify-app-builder and give me one setup milestone at a time.
```

```text
Use shopify-functions. Verify target eligibility and test a synthetic input before any release.
```

## Verify

Confirm extension/context and skills discovery through the installed client's help/listing. Ask the router to identify the relevant auth or research skill.
If upgrading from v1.x, remove the specific saved MCP connection and retired copied shopify-mcp folder after backing up customizations. A source update does not prove a host disconnected its old entry.
