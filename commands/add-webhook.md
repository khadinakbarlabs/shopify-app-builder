---
description: "Add a reliable authenticated Shopify event handler and test failure cases."
argument-hint: "topic and existing project"
---

# add-webhook

Skills: webhooks, app-auth

Read the named skills from this plugin before following the workflow. Use only the relevant ones; commands guide work rather than grant permissions.

1. Verify current topic/config and framework before creating files.
2. Use supported authentication, raw-body verification where custom code is needed, and durable enqueue before acknowledgement.
3. Add shop isolation, deduplication, retry/recovery and real privacy cleanup where applicable.
4. Test forged/altered body, duplicate event and failed queue; verify actual dev-store delivery if authorized.

## Beginner-friendly delivery

Explain unfamiliar terms once, recommend one next action and state the expected result before executing. Preserve unrelated work. Never read credential caches or print secrets. Paid runs, store writes, scope/access expansion, charges, deployment and submission require explicit task-specific authorization.

## Completion evidence

Separate handler tests, configuration registration and observed real event delivery.
Show actual results, the remaining blocker and the next step; do not print anticipated success checkmarks. If the host cannot register commands, invoke the listed skills in ordinary language instead.
