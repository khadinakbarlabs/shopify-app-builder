# Review notes for the local-skills edition

- No bundled MCP server or MCP configuration. Optional Shopify/Apify connection guidance uses official CLIs and user-selected dashboards.
- No publisher credentials, token headers or runtime credential discovery. Paid Apify calls require input/cost review and authorization.
- The package ships no bundled artwork. Listing artwork is stored by the directory from the original submission.
- There is no root plugin.json; native Claude metadata lives only in .claude-plugin/plugin.json.
- Native agents, commands and skills are bounded instructions; consequential actions require the user's authorization and the host's actual tools.
- Publisher attribution and homepage/policy/support links are retained from the approved metadata correction.
- Directory snapshot refresh and uploaded-icon approval are separate external gates. Inspect current scan/serving state rather than asserting warnings cleared.

## Interpreting the v2 directory findings

Since 2.1.3, .claude-plugin/plugin.json contains only keys Claude Code reads (name, version, description, author, homepage, repository, license, keywords, skills, commands). Listing-only fields (documentation, support, privacy and terms links, and the listing icon) were removed because the directory keeps the values saved at submission time and newer versions do not update them. The release validator rejects any other top-level key.

The former portable root manifest was removed in 2.1.3, and the package no longer ships artwork files, so no text file names an image path.
