# Review notes for the local-skills edition

- No bundled MCP server or MCP configuration. Optional Shopify/Apify connection guidance uses official CLIs and user-selected dashboards.
- No publisher credentials, token headers or runtime credential discovery. Paid Apify calls require input/cost review and authorization.
- assets/icon.png and assets/logo.png are static artwork, not executable files. No helper runs them.
- Root plugin.json is a portable Agent Plugins manifest; native Claude metadata remains in .claude-plugin/plugin.json.
- Native agents, commands and skills are bounded instructions; consequential actions require the user's authorization and the host's actual tools.
- Publisher attribution and homepage/policy/support links are retained from the approved metadata correction.
- Directory snapshot refresh and uploaded-icon approval are separate external gates. Inspect current scan/serving state rather than asserting warnings cleared.
