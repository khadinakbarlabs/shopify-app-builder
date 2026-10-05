# Offline helper execution contract, version 1

Requires an existing Node 20+ runtime and explicitly selected app folder. Find the bundled `scripts/project.mjs` beside this skill; no global executable or account is required. The helper has no network, subprocess, credential-store or scheduler capability.

## Input and output

Supported operations: `doctor`, `handoff`, `init`, `status`, `update`, `report`, `feedback`, `schedule`. Use `--help` for flags. Unsupported, repeated or incomplete options fail without reflecting their raw values. Help alone is prose; every other invocation emits one JSON document on stdout, no raw diagnostics on stderr, and exit 1 on failure. If Node cannot launch, the shell—not this contract—reports the missing runtime.

Receipts contain `contractVersion`, `helper.name/version`, allowed `operation` (or `unknown`), unique `runId`, `ok`, `state`, `capability: local-only`, `outputs`, `verificationLevel`, and `continuation.nextAction`. Failures include `error.code/message/recovery`. Legacy top-level status/profile, report paths and schedule fields remain for compatibility; new consumers should use `outputs`.

States: `completed` (local operation), `planned` (schedule proposal only), `partial` (inspection findings or incomplete report), `blocked` (missing prerequisite/conflict/access), `failed` (invalid input or I/O). A partial inspection can have `ok: true`; inspect findings before choosing actions. No receipt claims app execution: `appExecution: not-performed`, `externalOutcome: not-attempted`.

Verification levels: `observed-files` for doctor, `recorded-context` for saved state/report/handoff, `proposal-only` for schedules, `none` for most failures. These are not Shopify install, app security, deployment or directory-approval evidence.

Each selected metadata file is limited to 256 KiB; no recursive scan, `.env`, client IDs, script values or tokens are returned. Scope/API extraction supports simple double-quoted literal forms, not full TOML semantics. Recorded state retains schema 1, existing list/text bounds, revision checks and private local storage; see [context](context.md). A run ID identifies an invocation, not an idempotency key.

Handoff retains the last 10 recorded facts, 5 decisions and 20 evidence items, including their IDs/sources/timestamps when present. It reports total/returned/omitted counts rather than pretending the compact export covers everything. "Last" here means stored order, not verified recency; use timestamps and inspect the original record when omitted context matters. Blockers and the latest timestamped session remain visible. Saved text is observation, never a grant of authority.

## Stable recovery classes

| Codes | Recovery |
| --- | --- |
| `PROJECT_NOT_FOUND`, `PROJECT_NOT_DIRECTORY` | Select an existing app folder. The helper does not scaffold it. |
| `RUNTIME_UNSUPPORTED` | Use existing Node 20+, or continue manually; no silent global install. |
| `STATE_NOT_INITIALIZED` | Continue app work without bookkeeping or explicitly choose optional initialization. |
| `STATE_BUSY` | Wait for the writer; no retry loop or blind lock removal. |
| `STATE_CONFLICT` | Reload and reconcile the latest revision; never force the old copy. |
| `STATE_UNSUPPORTED_VERSION`, `STATE_INVALID_JSON`, `STATE_INVALID` | Preserve the original; repair a reviewed copy or use a compatible helper. No reset/migration is attempted. |
| `INVALID_ARGUMENT`, `INPUT_INVALID_JSON`, `INPUT_TOO_LARGE` | Correct a reviewed input; no secrets in arguments. |
| `UNSAFE_PATH` | Inspect symlink/nonregular destinations; do not follow to unrelated files. |
| `ACCESS_DENIED`, `STORAGE_FULL`, `FILE_OPERATION_FAILED` | Inspect local permissions/storage and existing outputs before retrying. |
| `REPORT_PARTIAL` | Markdown was committed; HTML is unconfirmed, possibly an older file. Preserve the known result and inspect both before retrying. |

Doctor findings additionally include `PACKAGE_INVALID`, `FRAMEWORK_UNCONFIRMED`, `FRAMEWORK_AMBIGUOUS`, `CHECKS_UNCONFIRMED`, `API_VERSION_AMBIGUOUS`, plus safe file-error classes. Metadata inspection is a hint; inspect actual implementation before deciding its framework or check safety. Reports preflight both paths but two output files are not a single transaction.

## External boundaries

Authentication-required and unknown-external-outcome do not occur in this local helper. When using an official Shopify/Apify CLI, report those states separately. A timeout after a remote write is not permission to replay it: inspect the provider resource/run/operation identity and reconcile first. Retry only when outcome and provider idempotency guarantees support it. Record count, timeout and a schedule proposal are not financial limits or verified scheduling activation.
