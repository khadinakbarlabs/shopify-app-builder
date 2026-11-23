---
description: "Prepare and execute an explicitly authorized Shopify app release with rollback."
argument-hint: "environment and release target"
---

# deploy-app

Skills: app-release-readiness, shopify-cli, webhooks

Read the named skills from this plugin before following the workflow. Use only the relevant ones; commands guide work rather than grant permissions.

1. Run readiness checks; identify app-server hosting, database, Shopify app config/extensions and store QA as separate targets.
2. Show costs, migration/backup plan, exact target, rollback and untested gates; obtain deployment-specific approval.
3. Use the project's verified release process and installed CLI help; app deploy does not host the backend.
4. Verify actual health, relevant config/version, authorized install, webhooks and core feature after release.

## Beginner-friendly delivery

Explain unfamiliar terms once, recommend one next action and state the expected result before executing. Preserve unrelated work. Never read credential caches or print secrets. Paid runs, store writes, scope/access expansion, charges, deployment and submission require explicit task-specific authorization.

## Completion evidence

Report only observed release evidence; never claim monitoring or App Store acceptance without verification.
Show actual results, the remaining blocker and the next step; do not print anticipated success checkmarks. If the host cannot register commands, invoke the listed skills in ordinary language instead.
