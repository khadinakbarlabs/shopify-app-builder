# v2.1.0 — a local project partner

36 portable skills, 17 guided commands and 8 specialist roles. Existing Shopify implementation workflows remain intact. No bundled MCP, hosted API, telemetry, cloud account or auto-enabled schedule.

## What users can do

- Resume with short project-local facts, decisions, evidence and handoffs shared across coding harnesses.
- Get a conservative next-action suggestion: diagnose blockers, check stale/assumed facts, continue a milestone or reconcile the latest session.
- Collect optional redacted plugin/app feedback locally, without sending it to maintainers.
- Generate Markdown and responsive HTML reports that distinguish local tests, dev-store evidence, production evidence and review outcomes. Counts describe saved records, not independently verified readiness or user analytics.
- Propose bounded quality, feedback or API review check-ins; a supported host/runner and separate authorization are required to enable one.

## Safety and portability

The dependency-free helper is contained in the copilot skill so copy-only installs retain it. It validates a bounded schema, refuses state/report symlinks, checks revisions, uses a write lock and writes atomically. Report data is escaped and HTML forbids scripts/network resources. Common secret/contact screening is defense in depth, not a complete privacy guarantee. Inner Git ignore and private permissions are not encryption.

Existing project files and notes are not rescaffolded or automatically migrated. Initialization is explicit and refuses to replace a record. Unknown/corrupt schema and conflicts require reconciliation, never a forced reset. Scheduling text does not enforce runner limits by itself.

## Verify after upgrading

Reload the native plugin or update the complete copied skill collection, backing up local customizations. Confirm shopify-project-copilot is discoverable. On a disposable synthetic app folder, initialize, inspect status, update a reviewed copy preserving its revision, add redacted feedback and generate reports. Test stale/conflicting context before relying on it.

Automated tests exercise helper behavior and packaged references. They do not prove every host's model follows the instructions, that a live Shopify app works, or that directories approved this release. See [behavioral scenarios](project-copilot-evaluation.md) for model/host acceptance cases.
