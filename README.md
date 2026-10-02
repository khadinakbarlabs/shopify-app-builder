# Shopify App Builder — build your first Shopify app, one clear step at a time

[![license](https://img.shields.io/badge/license-MIT-0b6e4f)](LICENSE)
[![Agent Plugins](https://img.shields.io/badge/Agent%20Plugins-1.0%20portable-5b21b6)](https://agent-plugins.org/)
[![skills](https://img.shields.io/badge/skills-35-004c3f)](skills/)
[![release checks](https://github.com/khadinakbarlabs/shopify-app-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/khadinakbarlabs/shopify-app-builder/actions/workflows/ci.yml)

A beginner-friendly, open-source Shopify app development plugin for Claude Code, Codex, Cursor, OpenCode, Gemini CLI and other Agent Skills-compatible coding harnesses.

You bring the merchant problem and choose your coding agent. The plugin helps that agent explain unfamiliar terms, recommend a sensible path, implement small testable changes and show evidence before calling something done.

**v2.0.0 is skills-first: no bundled MCP server, remote endpoint, required connector subscription or hidden credentials.** It contains 35 focused skills, 13 guided command definitions and 8 specialist-agent definitions. Native command/agent support depends on the harness; all clients can use the same portable skill workflows.

> Independent community project. Not affiliated with, endorsed by or sponsored by Shopify. No guarantee of security, profitability, trademark clearance, App Store acceptance or Built for Shopify designation.

## Start here

After installing, try:

```text
Use using-shopify-app-builder. I'm new to Shopify apps.
I want to help merchants spot products running low on stock.
Recommend the smallest useful app, explain each step, and verify it on a test store.
Don't run paid services or deploy anything without asking me.
```

Have a project already?

```text
Use using-shopify-app-builder on this repository.
First inspect what is already here, preserve my changes,
and help me get one end-to-end feature working.
```

Only planning? No Shopify or Apify connection is required. Testing an actual app needs a Shopify organization/app/development store. Market research through Apify is optional and may cost money.

## What “beginner-friendly” means here

- One useful milestone at a time, with the reason, required setup, expected result and one recovery step.
- Recommended defaults with tradeoffs, not a giant list of technologies to choose from.
- Definitions of terms such as embedded app, scope, webhook, entitlement and Actor.
- Existing projects are inspected and preserved, not automatically rescaffolded or migrated.
- Clear Done / Next / Blocked / Not tested summaries.
- No success checkmarks for work that was merely suggested.
- No tokens or passwords in prompts, public configs or screenshots.
- Manual research and offline fixtures when optional accounts/tools are unavailable.

The skill entrypoints are deliberately short. Detailed v1.x examples are retained under each relevant skill's references/ directory for compatible existing projects. They are explicitly version-sensitive; current official Shopify documentation and the focused entrypoint take precedence.

## Contents

- [Install in your coding agent](#install-in-your-coding-agent)
- [Connect only what you need](#connect-only-what-you-need)
- [Your app-building roadmap](#your-app-building-roadmap)
- [Optional App Store research with Apify](#optional-app-store-research-with-apify)
- [Skill catalog](#skill-catalog)
- [Commands and specialist agents](#commands-and-specialist-agents)
- [Practical project recipes](#practical-project-recipes)
- [Quality and release gates](#quality-and-release-gates)
- [Upgrade from v1.x](#upgrade-from-v1x)
- [Troubleshooting](#troubleshooting)
- [Safety, privacy and limitations](#safety-privacy-and-limitations)
- [Contribute and verify](#contribute-and-verify)
- [FAQ](#faq)

## Install in your coding agent

### Claude Code

Use Claude Code's plugin installer:

```text
/plugin marketplace add khadinakbarlabs/shopify-app-builder
/plugin install shopify-app-builder@shopify-app-builder
```

Reload/update according to your installed client and start a fresh session. Use the router skill or guided command. Plugin commands may be namespaced, for example /shopify-app-builder:start-shopify-app; consult the host's command list.

Claude desktop/web directory availability and review are separate from the source repository. A GitHub release is not proof that a directory has approved that version.

### Codex

Where your installed Codex version supports plugin marketplaces:

```bash
codex plugin marketplace add khadinakbarlabs/shopify-app-builder
codex plugin add shopify-app-builder@shopify-app-builder
```

If those commands are unavailable, use the portable copy path below. The Codex manifest exposes skills; Claude-style command and agent definitions remain useful reference workflows, not automatically registered Codex subagents.

### Cursor

Use the repository through Cursor's supported plugin installation flow, or copy the skills for the project. The native manifest declares skills, command definitions and specialist roles; availability depends on your Cursor version and installation route. A marketplace submission is not equivalent to approval.

### Portable copy path — no package-registry wait

Clone the verified release or repository into a directory you choose:

```bash
git clone https://github.com/khadinakbarlabs/shopify-app-builder.git
```

From **the app project where you want the skills installed**, run the installer from that checkout:

```bash
node /path/to/shopify-app-builder/scripts/install-agent-skills.mjs install --agent codex --dry-run
node /path/to/shopify-app-builder/scripts/install-agent-skills.mjs install --agent codex
```

Replace /path/to with your actual checkout; it is not a command to run unchanged. Choose claude-code, codex, cursor, opencode, gemini-cli, command-code or universal. Add --global only when you intend to install across projects.

The installer is dependency-free and copies skills with their references. It does not authenticate, call Shopify/Apify, run a paid Actor or configure an MCP server. Existing skill folders are skipped unless --force is explicitly chosen. Inspect the dry-run before installing; see the upgrade notes before --force.

The npm copy installer is also available as:

```bash
npx shopify-app-builder install --agent codex --dry-run
```

Check the actual npm version first: source/GitHub and npm releases can differ. Use a verified version pin after that version is published. This README is not proof of an npm release.

### Host-specific paths and limitations

| Harness | Project skills path used by this installer | Extra guidance |
| --- | --- | --- |
| Claude Code | .claude/skills | [Claude guide](docs/agents/claude-code.md) |
| Codex | .agents/skills | [Codex guide](docs/agents/codex.md) |
| Cursor | .agents/skills | [Cursor guide](docs/agents/cursor.md) |
| OpenCode | .opencode/skills | [OpenCode guide](docs/agents/opencode.md) |
| Gemini CLI | .gemini/skills | [Gemini guide](docs/agents/gemini-cli.md) |
| Command Code | .commandcode/skills | [Command Code guide](docs/agents/command-code.md); conventional path, verify your build |
| Other Agent Skills clients | .agents/skills (universal fallback) | [Other agents](docs/agents/other-agents.md); use the host's documented location |

These paths do not prove every harness scans every directory. If discovery differs, copy the complete skills collection to the documented location or point the host at it. Do not flatten folders or omit references.

OpenCode additionally has a small native adapter that registers the canonical skills path; it does not open a network connection. Gemini has GEMINI.md extension context. No claim of universal native agent/command parity is made.

## Connect only what you need

Use shopify-connections or the connect-shopify guided command.

| Need | Supported path | What it does not imply |
| --- | --- | --- |
| Plan/review code | Local skills | No account needed |
| Create and test apps | Official Shopify CLI and Dev Dashboard | Not production store access |
| Partner business/distribution | Official Partner Dashboard | Not the old app-creation flow |
| App-market research | Optional official Apify CLI or Console export | Not free unlimited runs |
| Production release | Your approved hosting/Shopify release workflow | Not authorized just by installing skills |

Shopify app creation/configuration has moved from the Partner Dashboard to the Dev Dashboard. The current CLI scaffold uses the official app template; current embedded app guidance uses React Router and App Home/Polaris web components. Existing compatible apps are not forced to migrate.

The user signs in through official browser/CLI flows. If an organization lacks app developer access, its owner/administrator supplies the appropriate role. This plugin does not request passwords, harvest sessions or invent a Shopify/Partner connector ID.

For applications that genuinely need credentials, the operator configures the approved server-side secret store. Agents should not inspect host credential caches or echo values to “confirm” setup.

Sources: [scaffold an app](https://shopify.dev/docs/apps/build/scaffold-app), [Dev Dashboard migration](https://shopify.dev/docs/apps/build/dev-dashboard/migrate-from-partners), [App Home](https://shopify.dev/docs/api/app-home).

## Your app-building roadmap

| Milestone | Useful output | Evidence before moving on |
| --- | --- | --- |
| Understand the problem | Merchant/task brief and small MVP | Sources or interviews, assumptions clearly marked |
| Set up | Correct org, app, dev store and local preview | A working first embedded page |
| Deliver first value | One complete feature | An authorized dev-store journey plus saved-state checks |
| Make it reliable | Auth, isolation, error states, jobs and billing where needed | Negative tests, duplicate handling, recovery |
| Prepare release | Hosting/migrations, support, policies and review assets | Gate-by-gate observed evidence |
| Launch and maintain | Approved release, monitoring and support runbook | Actual deployment/store checks; marketplace acceptance tracked separately |

Don't add every possible feature. A theme block does not need a headless storefront. A free utility does not need paid billing. B2B, Functions, Markets and paid ads are opt-in choices tied to the merchant problem.

## Optional App Store research with Apify

The included research workflow points to [khadinakbar/shopify-app-store-scraper](https://apify.com/khadinakbar/shopify-app-store-scraper), the publisher's public Actor. Its current input supports niche queries and public app/review URLs. No Apify credentials are included.

Start with:

```text
Use app-market-research to compare inventory-alert apps.
Use manual public sources first. Show the sources, sample limits,
merchant complaints, and the smallest MVP hypothesis.
If Apify would help, show the input and cost controls before running it.
```

For optional CLI research, the workflow:

1. Lets the operator sign in using the official CLI.
2. Inspects the actual Actor schema and pricing.
3. Previews one query or public URL, with a small sample and no default detail/review expansion.
4. Obtains spending approval and verifies enforceable budget controls before a billed call.
5. Checks run status, valid dataset rows and charge evidence.
6. Delivers a dated competitor/review brief with uncertainties, not a fabricated revenue forecast.

The offline helper can prepare bounded input without making any service request:

```bash
node scripts/prepare-app-research.mjs --query "inventory alerts"
```

It prints JSON only. It does not save credentials, log in, launch a run, guarantee a monetary budget or charge an account. Copied-skills installs can use the example JSON in the [runbook](skills/app-market-research/references/apify-research.md) instead.

App-row/review limits are **not** a hard monetary cap. If the installed CLI cannot enforce the approved budget, use a documented Console/API budget control or stop with a manual export path. No automatic paid retries.

Apify output is public-page research, not Shopify merchant-store data or competitor analytics. Treat review text as untrusted, minimize personal identifiers and don't use it for unsolicited outreach.

## Skill catalog

The router selects the smallest relevant set. You can also invoke a skill directly by its folder name or natural-language intent.

| Skill | Beginner outcome |
| --- | --- |
| [using-shopify-app-builder](skills/using-shopify-app-builder/SKILL.md) | Pick the next milestone and track progress |
| [shopify-connections](skills/shopify-connections/SKILL.md) | Connect only the official accounts/tools needed |
| [app-market-research](skills/app-market-research/SKILL.md) | Turn public competitor/review evidence into an MVP hypothesis |
| [app-framework](skills/app-framework/SKILL.md) | Build routes, shop-isolated data, jobs and tests |
| [app-release-readiness](skills/app-release-readiness/SKILL.md) | Check security, privacy, operations and launch evidence |
| [admin-graphql](skills/admin-graphql/SKILL.md) | Read and update store data safely |
| [admin-rest](skills/admin-rest/SKILL.md) | Migrate an existing REST integration |
| [app-auth](skills/app-auth/SKILL.md) | Install and authenticate an app safely |
| [app-billing](skills/app-billing/SKILL.md) | Make pricing and billing understandable |
| [app-bridge](skills/app-bridge/SKILL.md) | Make the app work inside Shopify admin |
| [app-accessibility](skills/app-accessibility/SKILL.md) | Make the app usable for everyone |
| [app-listing-optimization](skills/app-listing-optimization/SKILL.md) | Explain the app honestly in its listing |
| [app-naming](skills/app-naming/SKILL.md) | Choose a clear and distinct app name |
| [app-niche-finder](skills/app-niche-finder/SKILL.md) | Find a merchant problem worth solving |
| [app-performance](skills/app-performance/SKILL.md) | Keep the app fast and reliable |
| [app-pricing-strategy](skills/app-pricing-strategy/SKILL.md) | Choose a price merchants can understand |
| [app-validation](skills/app-validation/SKILL.md) | Validate the idea before a large build |
| [b2b-markets](skills/b2b-markets/SKILL.md) | Support the right B2B and international workflows |
| [built-for-shopify-standards](skills/built-for-shopify-standards/SKILL.md) | Prepare a rigorous quality review |
| [dev-troubleshooting](skills/dev-troubleshooting/SKILL.md) | Fix one problem without making a mess |
| [hydrogen-storefront](skills/hydrogen-storefront/SKILL.md) | Build a headless storefront intentionally |
| [liquid-themes](skills/liquid-themes/SKILL.md) | Add theme features without breaking a store |
| [merchant-pain-prevention](skills/merchant-pain-prevention/SKILL.md) | Protect merchant data and trust |
| [metafields-metaobjects](skills/metafields-metaobjects/SKILL.md) | Store custom data with a clear schema |
| [polaris-ui](skills/polaris-ui/SKILL.md) | Build a familiar Shopify interface |
| [shopify-app-store-ads](skills/shopify-app-store-ads/SKILL.md) | Plan ads after proving the product |
| [shopify-cli](skills/shopify-cli/SKILL.md) | Set up the app step by step |
| [shopify-functions](skills/shopify-functions/SKILL.md) | Customize commerce logic with Functions |
| [storefront-api](skills/storefront-api/SKILL.md) | Build public shopping experiences safely |
| [top-app-ux-patterns](skills/top-app-ux-patterns/SKILL.md) | Learn useful patterns without cloning apps |
| [ux-empty-error-states](skills/ux-empty-error-states/SKILL.md) | Help merchants recover when things go wrong |
| [ux-modern-app-feel](skills/ux-modern-app-feel/SKILL.md) | Make the app feel calm and responsive |
| [ux-onboarding](skills/ux-onboarding/SKILL.md) | Guide a merchant to their first useful result |
| [ux-polaris-antipatterns](skills/ux-polaris-antipatterns/SKILL.md) | Fix confusing UI with focused changes |
| [webhooks](skills/webhooks/SKILL.md) | Handle Shopify events reliably |

## Commands and specialist agents

Commands are guided instructions, not automatic approval to run their actions. Native availability depends on the host. If no command is registered, invoke its listed skills instead.

| Guided command | Purpose |
| --- | --- |
| start-shopify-app | Start a beginner-friendly Shopify app project from idea or an existing repository. |
| connect-shopify | Guide Shopify Dev/Partner dashboard setup and optional Apify CLI access without MCP. |
| research-shopify-app | Research a Shopify app niche with public sources or the optional Apify CLI Actor. |
| check-shopify-app | Check readiness and explain the next blockers before releasing a Shopify app. |
| init-shopify-app | Scaffold and run the first Shopify app page with guided safe setup. |
| graphql | Build or debug a scoped Shopify GraphQL operation with safe errors and pagination. |
| add-webhook | Add a reliable authenticated Shopify event handler and test failure cases. |
| audit-scopes | Audit Shopify scopes and protected-data access without expanding permissions. |
| generate-extension | Choose and build a supported Shopify extension with a dev-store test path. |
| migrate-rest-to-graphql | Migrate an existing Shopify REST integration incrementally. |
| optimize-listing | Draft an accurate Shopify App Store listing from verified product evidence. |
| validate-idea | Test a Shopify app idea using narrow evidence and a small experiment. |
| deploy-app | Prepare and execute an explicitly authorized Shopify app release with rollback. |

Specialist-agent definitions are available in agents/. Use a role only when native delegation is supported and authorized; otherwise the main agent can follow the same instructions.

| Role | Best use |
| --- | --- |
| shopify-app-coach | Use for beginner Shopify app planning, setup guidance and progress tracking; adapt to experience and avoid tool overload. |
| shopify-app-architect | Use for a new Shopify app or a significant feature architecture; choose the smallest maintainable design. |
| graphql-query-writer | Use for Shopify GraphQL queries, mutations, pagination and cost/error handling in an existing project. |
| shopify-debugger | Use to diagnose Shopify setup, API, auth, UI, billing, webhook or extension failures with redacted evidence. |
| shopify-app-ux-reviewer | Use for Shopify merchant UX, onboarding, accessibility and complete-state review of real screens. |
| app-listing-copywriter | Use for honest Shopify App Store listing drafts, screenshots, support and legal links. |
| shopify-market-researcher | Use for Shopify App Store competitor and review research via public pages or an explicitly approved Apify CLI sample. |
| shopify-security-reviewer | Use for Shopify app auth, scope, tenant-isolation, billing and privacy security review before release. |

## Practical project recipes

### First embedded app

```text
Use shopify-app-coach if your host supports that role;
otherwise use using-shopify-app-builder.
Help me build an inventory-alert MVP.
First confirm my project, official setup and test-store access.
Implement one useful feature, test its auth/error paths, and show what works.
```

Path: connections → CLI → framework → auth → Admin GraphQL → Polaris/onboarding → readiness.

### Subscription utility

```text
Use app-pricing-strategy and app-billing.
Recommend a simple plan with clear limits.
Implement the supported test-mode flow and server-side entitlements.
Verify approval, decline, cancellation and trial expiry without a real charge.
```

### Theme app block

```text
Use liquid-themes.
Create a reversible app block and test it in my authorized development theme.
Preserve my theme edits and don't publish the live theme.
```

### Fix an authentication loop

```text
Use dev-troubleshooting and app-auth.
Diagnose this redacted error, then fix it with a regression test.
Don't read token caches, dump session records or reset my project.
```

### Prepare a review candidate

```text
Use app-release-readiness.
Give me blockers and untested gates first.
Check privacy cleanup, isolation, install/reinstall, billing if applicable,
keyboard/mobile UX, hosting recovery and truthful listing evidence.
Do not deploy or submit from this audit request.
```

### Research a niche without spending

```text
Use app-market-research and app-validation with manual public sources.
What evidence supports a small MVP, what is still uncertain,
and which merchant interview should I do next?
```

## Quality and release gates

This package covers the app-building lifecycle, but each app needs its own evidence:

- Authentication/authorization and minimal justified scopes.
- Tenant isolation: one shop cannot read another shop's data.
- Validated input, safe database access and framework-appropriate XSS/CSRF protections.
- Webhook signatures, durable processing, duplicate/out-of-order handling and cleanup.
- Appropriate data retention, applicable compliance requests and protected-data approval.
- Transparent supported test-mode billing and server-side entitlements, if paid.
- Loading/empty/error/partial-success states with safe retries and accessible feedback.
- Keyboard/mobile checks, measured performance and primary-feature regression tests.
- Approved hosting, HTTPS, secret-store configuration, database backup/migration/recovery and rollback.
- Accurate listing, screenshots, support, privacy and terms.
- Actual dev-store/production verification where authorized; App Store acceptance tracked separately.

Generated code, local tests and a deployment log are different signals. None automatically awards a security certificate or marketplace approval.

## Upgrade from v1.x

v2.0.0 removes the packaged MCP server and the Shopify MCP skill. It removes portable/native MCP configs, hosted API/deployment source and obsolete MCP-specific submission/demo metadata. The replacement connection workflow uses official CLI/dashboard sessions.

1. Back up local custom skill edits and inspect the new package/version.
2. Update the native plugin using your host's supported updater, or dry-run the new copy installer.
3. A copy installer skips existing skill folders; --force overlays them only after you review your local changes. It does not automatically delete retired folders.
4. If you previously copied shopify-mcp, remove that **specific retired skill folder** after backing it up; do not delete the whole skills directory.
5. Remove/disconnect the old shopify-app-builder MCP entry using your host's supported controls. Updating the source does not prove every host has removed a saved connection.
6. Reload the host and verify it sees shopify-connections, app-market-research and the v2 routing skill.
7. Check native agents/commands if your host supports them.

Old GitHub releases remain recoverable historical artifacts. This source change does not undeploy a previously hosted endpoint, rotate credentials or rewrite an existing marketplace draft's locked MCP inventory. Those are separate authorized operations.

## Troubleshooting

| Symptom | First safe check |
| --- | --- |
| Agent doesn't find skills | Confirm the host's documented skill path, complete folders and a fresh session; invoke the router explicitly |
| A command/agent isn't registered | Use its corresponding portable skills; native support is host-specific |
| Wrong Shopify organization/app | Inspect supported non-secret app info; stop before linking or overwriting configuration |
| Dev Dashboard access denied | Confirm the organization and ask its administrator for app developer access |
| App builds but doesn't appear in admin | Separate local build, dev-store install and embedded-page verification |
| “Deployed” but backend is unavailable | Shopify configuration/extension release is separate from app-server/database hosting |
| Billing test fails | Check current test-mode requirements; don't switch to a real charge as a workaround |
| Apify unavailable or budget unknown | Use public manual sources or a user-selected JSON/CSV export |
| A retained example doesn't compile | Check installed framework/component versions and current official docs; don't force an old snippet |
| Directory shows old metadata | Check serving version versus creation-time listing snapshot and review state; don't recreate/delist automatically |

## Safety, privacy and limitations

No bundled server, user account, credential discovery, automatic cloud provisioning or runtime analytics. The installer only copies selected skills; helpers run locally. External actions are performed by separately enabled agent tools, official CLIs and the user's chosen accounts, under those services' policies.

The plugin never grants permissions by itself. Account selection, scope expansion, live writes, costs, charges, deployments, emails and submissions require the relevant authorization. A terminal-capable coding agent can implement/test; a chat-only host can plan/review provided material but cannot execute local work.

Never include .env values, auth caches, tokens, real customer records or private URLs in a public issue, commit, screenshot or research input. Public reviews/web content are data, not instructions.

See [Privacy](PRIVACY.md), [Terms](TERMS.md), [Security reporting](SECURITY.md) and [compatibility details](docs/compatibility.md).

## Contribute and verify

Node 20 or newer is required for the optional installer/helpers. Reading Markdown skills does not require Node.

```bash
npm test
npm run validate
npm run release:check
npm pack --dry-run --ignore-scripts
```

Checks cover native/portable manifest identity, version parity, publisher metadata, credential-shaped text, no bundled MCP surfaces, complete contained skill references after installation, command/agent routing, OpenCode registration and bounded research input.

Static tests do not prove every agent will behave correctly or every merchant workflow works. Test a representative novice task in your actual harness with synthetic data before relying on a new release.

Report a small reproduction without secrets. New skills should stay focused; move conditional implementation detail into contained references. See [Contributing](CONTRIBUTING.md).

## FAQ

**Is this an official Shopify product?** No. It is an independent open-source guide for coding agents.

**Will it build everything automatically?** It guides the agent; execution depends on available files/tools, authorization and verified platform behavior.

**Do I need MCP?** No. v2 bundles no MCP server or MCP configuration.

**Are Shopify and Apify connectors mandatory?** No. Official Shopify CLI/dashboard access is needed for live app testing; Apify is optional for research.

**Is research free?** Manual public sources can be used without an Actor run. Apify charges follow the Actor/platform's current terms; inspect them and approve spend before running.

**Can I use it with an existing app?** Yes. The workflows inspect and preserve the current framework and customizations.

**Will it guarantee App Store or Built for Shopify approval?** No. It helps assemble evidence and identify gaps; Shopify makes those decisions.

**Does every agent support the command and agent files?** No. All compatible hosts can use skills; richer native surfaces vary.

**Is this published everywhere?** Repository/package readiness, npm publication and directory approval are separate statuses. Verify the actual version on the service you use.

**How do I get help?** Use [GitHub issues](https://github.com/khadinakbarlabs/shopify-app-builder/issues) with redacted evidence, or the private security reporting process for vulnerabilities.
