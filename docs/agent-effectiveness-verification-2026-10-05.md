# Agent-effectiveness verification — 2026-10-05

Scope: focused local improvements to the canonical Shopify App Builder checkout, not a new public directory submission. Candidate version 2.1.1; baseline source version 2.1.0. No behavioral uplift or "10x" claim is established.

## Baseline findings and repairs

1. Codex had enabled personal 2.1.0 and Claude-Cowork 1.2.0 editions simultaneously. Personal is updated to 2.1.1; the identified stale edition is disabled, its cache preserved. Imported global skill aliases, including customized copies, are not overwritten; they may still overlap and require an owner-reviewed merge. The single byte-verified retired imported shopify-mcp alias was moved into a separate recoverable backup; other aliases remain intact.
2. The default Claude Code installation had no Shopify plugin. The reviewed local marketplace is now installed and enabled at user scope. A valid explicit agent-file array passed validation but inventory reported zero agents. The documented default `agents/` scan exposes all eight without changing IDs.
3. Cursor had old copied skills, including retired MCP guidance. Thirty-one whole folders matched known old editions byte-for-byte and were moved into a recoverable backup outside active discovery. Customized `app-naming` remains untouched. The candidate is copied into Cursor's documented local plugin folder; source-copy proof is not loaded-version proof.
4. Broad routing and planning could detour a focused fix into research/setup, and project bookkeeping could stand in for app delivery. Routes now distinguish build/fix/audit/improve/import/review/release/resume and inspect context before dependent questions. The first-feature guide defines authenticated shop isolation, a two-shop regression and useful loading/empty/error behavior.
5. Missing folders and CLI failures were generic prose errors. Non-help operations now emit stable JSON receipts with bounded safe recovery, no raw input/path diagnostics, and honest local-only verification. `doctor` runs no commands; `handoff` preserves sourced facts, decisions/blockers/evidence and explicitly reports omitted coverage. Corrupt/unknown-schema records remain unchanged.
6. Reports could discover a bad second destination after writing the first. Both paths are preflighted; runtime HTML-write failure reports known Markdown completion and unconfirmed HTML. This is not a two-file transaction. A recovery-class test does not simulate every disk failure.

## Executed checks and evidence levels

| Check | Result | What it establishes |
| --- | --- | --- |
| Baseline Node suite | Passed, 42/42 | Existing covered behavior, not agent completion |
| Candidate Node suite | Passed, 55/55 | Regression/contract/resource/routing guard checks; textual guidance guards are not semantic evaluation |
| Release validator | Passed | Working-tree manifests, routes, resources and forbidden-pattern scan |
| Claude manifest/marketplace strict validation | Passed, no warnings | Current CLI accepts the metadata; empty `contents` is not execution proof |
| Changed skill frontmatter validator | Passed, 2/2 | Router and copilot metadata syntax |
| npm artifact extraction and contained helper smoke | Passed | Portable helper/resources survive packaging; artifact scan is separate from public release |
| Source/manual security review | Passed within changed scope | Input bounds, errors, stored-data distrust, no credential discovery/network/subprocess, HTML escaping and permission boundaries reviewed; no certification or independent penetration test |
| Shopify or Apify live operations | Not run | No live install, shop writes, paid collection or billing execution authorized here |
| With/without native behavioral comparison | Not run, 0/8 prepared cases | Awaiting explicit model-usage/cost approval; no completed feature/uplift denominator exists |
| New GitHub/npm/directory publication | Not run | This local candidate does not change public serving/review versions |

Node 22.23.1; Codex CLI 0.146.0; Claude Code 2.1.289. Cursor help identifies 3.23.12. No model was run for behavioral evaluation, so model is Not applicable to these deterministic checks.

## Local host state

- **Codex:** native personal candidate 2.1.1 enabled; stale Claude-Cowork 1.2.0 disabled. The cached package contains 36 skill folders, helper modules, 17 command files and 8 role files. Codex manifest exposes skills, not native Claude command/subagent parity. A fresh session is needed to verify actual selection; the current session's originally supplied catalog is not automatically refreshed.
- **Claude Code:** installed user-scoped candidate 2.1.1 enabled, with `readFromFolder` pointing to the reviewed checkout. `plugin details` reports 53 skill/command entries (36 + 17), 8 agents, 0 hooks, 0 MCP and 0 LSP servers. The inactive versioned cache can lag local development edits; use the verified local folder (or `--plugin-dir`) rather than inferring current content from that cache. Inventory discovery passed; no subagent dispatch/model behavior was tested. Cloud directory metadata and any already-running desktop conversation are separate.
- **Cursor:** native local candidate copied with its contained helper. Live UI verification could not obtain a stable plugin search/reload control, so version/component exposure remains Blocked until a safe reload/Customize readback. Do not terminate unrelated sessions. Local import policy and same-name marketplace precedence can also prevent activation. Customized/other-harness aliases are preserved, not silently merged.

## Native cases and measurement

Eight synthetic read-only cases cover explicit resume, indirect first value, focused fix, shopping near miss, platform-choice ambiguity, invalid state, missing runtime and unknown remote outcome. Each has bounded runs/turns/time and deterministic signal/detour graders. Graders are intentionally limited: negated advice can yield a regex false positive; traces need semantic adjudication. They do not test real merchant-feature code or prove shop isolation.

When specifically authorized, begin with one same-input with/without Claude case, one run per arm, local reports only, no real servers/write/shell grants, and a $2 launch-stop threshold. An in-flight run can exceed that threshold. Record actual model, selection, accepted outcome, first useful result, unnecessary questions, recovery, time/cost and denominator. A real feature-completion benchmark additionally needs separately approved writable synthetic app fixtures and behavioral two-shop tests. See `evals/README.md`.

Unexpected environment side effect: Shopify's own version inspection auto-upgraded the existing global CLI from 4.7.0 to 4.8.0. This was disclosed; no further global tool changes or rollback were performed. The new doctor intentionally avoids vendor CLI execution.

Next step: reload Cursor and verify Customize shows the local 2.1.1 candidate, then approve a bounded native comparison before making any effectiveness claim or public release.
