# Native Claude behavioral cases

Eight planning/routing/recovery cases prepared against Claude Code 2.1.289 and its current plugin-evals format. They contain synthetic text only, no remote tools, fixtures requiring customer data or scaffold scripts. They are not merchant-feature execution tests and have not been run by preparing these files.

After explicitly approving model usage/cost and reviewing the trusted plugin, run from the checkout:

```text
claude plugin eval . --case focused-fix --runs 1 --concurrency 1 --ablation with-without --max-cost-usd 2 --no-publish --no-scaffold --trust-plugin --json
```

The threshold is a stop check before each launch, not a hard bill guarantee; an in-flight run can exceed it. Start with one case; approve more separately. No real MCP servers, network-tool grants, paid judges or Write/Bash grants are needed for these cases. Read-only agents still incur model usage. Preserve partial outputs and exclude incomplete/cost-ceiling/auth-failed runs from uplift claims.

Regex graders check limited surface signals/detours only; inspect traces for actual selection, questions and semantic acceptance before reporting effectiveness. Negated advice may mention a prohibited command and fail the simplistic regex; adjudicate transparently, don't silently change a score. Correct words do not prove a completed feature. Read the rubric in each grader and evaluate the same input in both arms.

Record host/model/version, selected capability, completed outcome, first useful result, unnecessary questions, recovery, duration and cost, with denominators. Explicit invocation does not measure natural discoverability. Model and CLI versions must come from the actual run, not inferred defaults. For a real implementation comparison, separately approve writable synthetic app fixtures, shell execution and a behavioral acceptance suite for authenticated two-shop isolation plus loading/empty/error states. Do not mistake these read-only cases for that test.

OpenAI/Codex and Cursor need their own fresh-session component and behavior checks; Claude results do not establish parity.
