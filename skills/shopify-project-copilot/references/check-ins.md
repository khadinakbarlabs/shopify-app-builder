# Optional check-in plans

A skill package does not have a persistent process. Nothing here creates an enabled schedule. Use the current host's supported automation interface when available; consult installed help/current official documentation. Repository checks can instead use a user-approved runner such as GitHub Actions. A schedule's existence does not establish that a run succeeded. Don't require cloud signup just for manual reports.

```text
node <installed-skill>/scripts/project.mjs schedule --routine quality --cadence weekly --timezone Asia/Karachi
```

Supported proposals: quality, feedback, api; weekly or monthly. These contain a timezone, read-only scope, one-run/15-minute bound, no paid research and an actionable-only notification policy. They intentionally don't guess a clock time or emit portable cron configuration: time, daylight-saving behavior, missed runs and pause controls depend on the chosen runner.

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
