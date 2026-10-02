# Review notes for the local-skills edition

- No bundled MCP server or MCP configuration. Optional Shopify/Apify connection guidance uses official CLIs and user-selected dashboards.
- No publisher credentials, token headers or runtime credential discovery. Paid Apify calls require input/cost review and authorization.
- assets/icon.png and assets/logo.png are static artwork, not executable files. No helper runs them.
- Root plugin.json is a portable Agent Plugins manifest; native Claude metadata remains in .claude-plugin/plugin.json.
- Native agents, commands and skills are bounded instructions; consequential actions require the user's authorization and the host's actual tools.
- Publisher attribution and homepage/policy/support links are retained from the approved metadata correction.
- Directory snapshot refresh and uploaded-icon approval are separate external gates. Inspect current scan/serving state rather than asserting warnings cleared.

## Interpreting the v2 directory findings

The current Claude manifest reference lists `icon`, `documentationUrl`, `supportUrl`, `privacyPolicyUrl` and `termsOfServiceUrl` as directory-only fields. Claude Code 2.1.281 and later accept them; older validators can report them as unknown. Removing them would remove the directory information, not fix a runtime defect. Reference: https://code.claude.com/docs/en/plugins-reference#directory-listing-fields.

The portable root manifest is intentional for other harnesses. Claude ignores it and loads `.claude-plugin/plugin.json`; this is an informational finding, not a second executable entrypoint.

Static-artwork findings can name the two manifests and `tests/release-validator.test.mjs`. The test reads PNG signature/dimensions as data; it does not execute artwork. No manifest declares artwork as a command, hook, MCP server or executable. Keep the branding and validation coverage and provide this distinction to the directory reviewer instead of obfuscating references to suppress the scan.
