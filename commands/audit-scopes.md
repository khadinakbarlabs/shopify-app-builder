---
description: "Audit Shopify scopes and protected-data access without expanding permissions."
argument-hint: "app config or repository"
---

# audit-scopes

Skills: app-auth, admin-graphql, merchant-pain-prevention

Read the named skills from this plugin before following the workflow. Use only the relevant ones; commands guide work rather than grant permissions.

1. Read non-secret declared config and map each operation to a documented scope.
2. Explain unnecessary scopes, protected-data approvals and what will break if a scope is removed.
3. Draft a minimal change with tests; do not reauthorize a store or expand access without approval.
4. Compare declared versus observed granted permissions using supported redacted status, not token dumps.

## Beginner-friendly delivery

Explain unfamiliar terms once, recommend one next action and state the expected result before executing. Preserve unrelated work. Never read credential caches or print secrets. Paid runs, store writes, scope/access expansion, charges, deployment and submission require explicit task-specific authorization.

## Completion evidence

A per-scope rationale and exact unverified permissions.
Show actual results, the remaining blocker and the next step; do not print anticipated success checkmarks. If the host cannot register commands, invoke the listed skills in ordinary language instead.
