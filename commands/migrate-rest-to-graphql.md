---
description: "Migrate an existing Shopify REST integration incrementally."
argument-hint: "operation or repository"
---

# migrate-rest-to-graphql

Skills: admin-rest, admin-graphql

Read the named skills from this plugin before following the workflow. Use only the relevant ones; commands guide work rather than grant permissions.

1. Inventory current calls and the output contract.
2. Verify equivalent operations in the current stable GraphQL schema.
3. Write fixture-based parity tests, migrate one operation and handle pagination/cost/errors.
4. Retain rollback and verify the relevant dev-store workflow without an automatic production cutover.

## Beginner-friendly delivery

Explain unfamiliar terms once, recommend one next action and state the expected result before executing. Preserve unrelated work. Never read credential caches or print secrets. Paid runs, store writes, scope/access expansion, charges, deployment and submission require explicit task-specific authorization.

## Completion evidence

Report parity and any unsupported semantics, not just compilation.
Show actual results, the remaining blocker and the next step; do not print anticipated success checkmarks. If the host cannot register commands, invoke the listed skills in ordinary language instead.
