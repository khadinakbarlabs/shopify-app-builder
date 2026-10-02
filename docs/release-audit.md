# Release audit

For v2.0.0, run npm run release:check and inspect the actual archive. Tests check manifests, version parity, public attribution, credential-shaped text, absence of bundled MCP configuration/runtime, complete portable skill references after copy installation, valid command/agent routes and bounded offline research input.

Additionally run the current target-host validator, secret scanning and representative installer/helper CLI tests. Inspect package file names and confirm no .env, auth files, dependencies, hosting bindings or MCP artifacts are included.

Technical examples retained from v1.x are explicitly version-sensitive. Verify relevant APIs and SDKs against current official documentation before implementation. Static wording tests are not behavioral proof that every coding agent will follow a workflow correctly.

GitHub commit/release, npm distribution, native-host installation, directory review, and a real Shopify app's live QA are separate evidence surfaces. Never treat one as proof of another.

Historical v1 audit evidence remains in Git history/release notes. A v2 source change does not undeploy its historical remote endpoint or rewrite a locked OpenAI MCP draft.
