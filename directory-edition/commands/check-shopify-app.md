---
description: "Check readiness and explain the next blockers before releasing a Shopify app."
argument-hint: "repository or release target"
---

# check-shopify-app

Skills: app-release-readiness, built-for-shopify-standards

Read the named skills from this plugin before following the workflow. Use only the relevant ones; commands guide work rather than grant permissions.

1. Inspect the repository and desired distribution; distinguish mandatory versus optional program checks.
2. Run authorized local tests and audit security, privacy, billing if relevant, UX and operational recovery.
3. Mark live account checks untested if inaccessible; request only the specific missing access/action.
4. Present blockers first and small remediation steps; don't deploy or submit from an audit request.

## Beginner-friendly delivery

Explain unfamiliar terms once, recommend one next action and state the expected result before executing. Preserve unrelated work. Never read credential caches or print secrets. Paid runs, store writes, scope/access expansion, charges, deployment and submission require explicit task-specific authorization.

## Completion evidence

An evidence-based gate list with next actions, no invented approval score.
Show actual results, the remaining blocker and the next step; do not print anticipated success checkmarks. If the host cannot register commands, invoke the listed skills in ordinary language instead.
