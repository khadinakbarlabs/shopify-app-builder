# Optional check-in plans

A skill package does not have a persistent process. Nothing here creates an enabled schedule. Use the current host's supported automation interface when available; consult installed help/current official documentation. Repository checks can instead use a user-approved runner such as GitHub Actions. A schedule's existence does not establish that a run succeeded. Don't require cloud signup just for manual reports.

## Writing the proposal

Produce the proposal as plain text with these fields. Routine must be quality, feedback or api; cadence weekly or monthly; timezone an explicit IANA name the user confirmed (for example `Asia/Karachi`).

| Field | Value |
| --- | --- |
| status | proposed (not registered) |
| routine / cadence / timezone | as chosen |
| readOnly | true |
| maxMinutes | 15 |
| maxRunsPerOccurrence | 1 |
| paidRuns | false |
| prompt | see below |

Prompt text: "Use shopify-project-copilot for this project's <routine> review. Reconcile context with the repository." Then the routine sentence: quality, "Inspect existing test results; run checks only when their commands and side effects were specifically approved."; feedback, "Summarize explicitly selected, redacted feedback; do not fetch private inboxes or launch research."; api, "Read current official Shopify API documentation and identify changes relevant to the recorded app." Then: "Do not change source, stores, billing, scopes, deployments or submissions; do not run paid services. Report evidence, blockers and the next action. Stay quiet when unchanged or non-actionable. Stop after 15 minutes; do not retry failed work automatically. Confirm exact time, timezone, runner, access, costs and pause control before enabling."

Proposals intentionally don't guess a clock time or emit portable cron configuration: time, daylight-saving behavior, missed runs and pause controls depend on the chosen runner.

## Before registering through the host

- Confirm project, routine, exact days/time/timezone and selected input sources.
- Preview what will run. Tests can execute arbitrary project code: inspect their commands and obtain specific permission before unattended execution, even when called "checks".
- Confirm runner access/availability, applicable model/runner cost and permitted resource bounds.
- Include the rule to stay quiet when unchanged or non-actionable; notify for a meaningful regression, completion or required user action.
- Limit overlap, duration and retries using runner controls. Prompt text alone is not an enforced cost/time cap; say when a hard cap is unavailable.
- Show how to pause/delete the specific routine, then verify its saved settings and the first actual result. Without authorization/access, leave it proposed and provide a manual path.

## Useful routines

Quality: summarize changed files and existing checks; run only approved commands and report passed/failed/not-tested separately. Don't patch/deploy automatically.

Feedback: summarize selected local, redacted feedback into recurring problems and one experiment. No private inbox discovery, bulk raw-record ingestion, external posting or automatic paid scraping.

API: compare the app's recorded API version/features with current official Shopify documentation. Identify relevant deprecations and tests to run. Don't auto-upgrade dependencies, expand scopes or change store configuration.

Schedulers differ across Claude, Codex, Cursor, OpenCode and other agents. If the host lacks supported scheduling or persistent file access, offer a manual "review my project" prompt and a Markdown handoff; don't claim it will wake later.
