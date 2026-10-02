# v2.0.0 — beginner-first local skills

Breaking change: removes the packaged MCP service/configs, server dependencies and deployment/API source. Historical deployments, saved connections and existing locked marketplace drafts are not automatically removed or converted.

- 35 focused skills: short goal-first workflows plus optional version-sensitive technical references.
- Replaces shopify-mcp with official Shopify Dev/Partner/CLI connection guidance.
- Adds app-market-research with the public khadinakbar/shopify-app-store-scraper Actor, optional official Apify CLI, explicit input/budget approval and manual fallback.
- Adds app-framework and app-release-readiness for tenant isolation, migrations/jobs/tests, hosting boundaries, privacy lifecycle and launch evidence.
- 13 guided commands and 8 specialist-agent roles, including coach, market researcher and security reviewer.
- Updates new-app defaults to current official scaffold/React Router/App Home guidance without forcing existing-app migrations.
- Removes credential-cache debugging, blanket live-billing workarounds and fake deployment-success templates.
- Retains publisher identity, policy/support links, MIT license and branding.
- Offline research helper validates one public target and bounded sample sizes without network or credentials.
- Regression checks cover no bundled MCP surfaces, install/reference containment and command/agent routes.

Before upgrading, read the README's v1.x migration steps. Review local customizations, remove only the retired MCP connection/skill, reload your host and verify the new entrypoint. Source readiness does not prove npm publication, marketplace approval or live app QA.
