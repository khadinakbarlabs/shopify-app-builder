---
description: "Build or debug a scoped Shopify GraphQL operation with safe errors and pagination."
argument-hint: "operation or existing code"
---

# graphql

Skills: admin-graphql, app-auth

Read the named skills from this plugin before following the workflow. Use only the relevant ones; commands guide work rather than grant permissions.

1. Identify read versus mutation, API version and minimum scopes.
2. Use variables and the supported authenticated server client; start with fixtures/read-only inspection.
3. For writes show affected records and request exact authorization; validate GraphQL errors, userErrors and cost.
4. Test empty, paginated, denied and partial-failure cases.

## Beginner-friendly delivery

Explain unfamiliar terms once, recommend one next action and state the expected result before executing. Preserve unrelated work. Never read credential caches or print secrets. Paid runs, store writes, scope/access expansion, charges, deployment and submission require explicit task-specific authorization.

## Completion evidence

Provide operation, scope rationale and actual test result; HTTP 200 is not sufficient.
Show actual results, the remaining blocker and the next step; do not print anticipated success checkmarks. If the host cannot register commands, invoke the listed skills in ordinary language instead.
