# v2.1.1 source update

Prepared for the GitHub source update on 2026-10-06. npm publication and directory approval remain separate; this document does not establish either.

- Focused build/fix/audit/improve/import/review/release/resume routing, with context inspection before dependent questions. Shopify mentions in shopping or platform comparisons do not trigger app scaffolding.
- A first merchant-feature acceptance guide covering authenticated shop isolation, a two-shop regression, validation and loading/empty/error states. Planning/context reports are not substitutes for requested implementation.
- Contained read-only `doctor` and `handoff` operations; stable JSON receipts, safe error classes, report partial recovery and preserved legacy output keys. No runtime installs, account discovery, external requests or scheduler activation.
- Existing schema-1 records, all public entry IDs, 36 skills/17 commands/8 specialist definitions and permission boundaries retained. No stored-state migration needed.
- Test-first recovery regressions, copy-only helper-resource checks and eight prepared native Claude routing/recovery cases. Native model evaluations require approved usage/cost; regex checks are limited, not semantic proof.
- Claude Code 2.1.289 passed explicit-agent manifest validation but its component inventory reported zero agents. Switching to the documented default `agents/` scan exposes all eight without changing agent IDs or files; validation alone was not sufficient proof.

Helper consumers should parse `outputs`, `ok`, `state`, `error.code` and `continuation` instead of matching stderr text. Non-help failures now emit safe JSON on stdout with exit 1. See the execution contract for partial report and missing-runtime boundaries.
