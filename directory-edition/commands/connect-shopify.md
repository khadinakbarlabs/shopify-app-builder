---
description: "Guide Shopify Dev/Partner dashboard setup and optional Apify CLI access without MCP."
argument-hint: "Shopify or optional Apify"
---

# connect-shopify

Skills: shopify-connections

Read the named skills from this plugin before following the workflow. Use only the relevant ones; commands guide work rather than grant permissions.

1. Identify the requested organization/service and read the connection skill.
2. Inspect non-secret versions/help and explain the official sign-in/selection flow.
3. Let the user complete account sign-in and permission approval; do not inspect cached credentials.
4. Verify the intended app/dev-store or read-only Actor metadata; leave paid runs and production access unstarted.

## Beginner-friendly delivery

Explain unfamiliar terms once, recommend one next action and state the expected result before executing. Preserve unrelated work. Never read credential caches or print secrets. Paid runs, store writes, scope/access expansion, charges, deployment and submission require explicit task-specific authorization.

## Completion evidence

Separate signed in, linked, installed and tested states.
Show actual results, the remaining blocker and the next step; do not print anticipated success checkmarks. If the host cannot register commands, invoke the listed skills in ordinary language instead.
