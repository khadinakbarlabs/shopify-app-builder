# Privacy — local skills edition

Effective date: October 5, 2026. Applies to Shopify App Builder v2.1.0; historical v2.0 releases had no project-record helper.

## What this package does

This release bundles Markdown skills, command/agent instructions, static branding and local helpers. It has no bundled MCP server, hosted API, account system, database of conversations or runtime tracking. The copy installer does not authenticate, inspect credentials or make service requests. The optional research-input helper prepares public, non-secret JSON locally; it does not launch an Actor.

Your coding-agent provider and enabled tools process prompts/files under their own policies. A skill instructing an agent is not a new permission grant. Installing from a registry or GitHub involves the ordinary processing by that service and your package client.

## Optional local project context and reporting

When you choose the project copilot, its offline helper stores a small project profile, source-backed facts, decisions, milestone evidence, short session handoffs and redacted feedback in `.shopify-app-builder/` inside the app folder you select. It generates Markdown and script-free HTML reports locally. An inner ignore file discourages accidental Git publication; it is not encryption or a guarantee that already-tracked files are private. No information is sent to the publisher by this helper, and no external fonts, scripts or assets are fetched by its reports.

You control the records. Keep them minimal and exclude source dumps, transcripts, credentials, private URLs, contact information, merchant/customer records and raw logs. Validation rejects common credential/contact patterns but cannot detect every sensitive value. Your host/provider may process files you let it read under its own policies. Review before opening or sharing a report through that host.

Records remain in that selected folder until you edit, back up or remove them. The helper does not prune history or upload analytics. Deleting the exact local folder removes these local records/reports, not your app or provider-side conversation history. Public feedback is sent only when you separately choose and authorize a reviewed, redacted issue/report. Local session/milestone counts are not publisher tracking or unique-user analytics.

Check-in output is a proposal only. If you separately enable a supported host/runner schedule, that provider processes its configured prompts/inputs under its own policies and may charge for execution. Pause/delete it through that provider; uninstalling this plugin does not automatically stop a previously enabled routine. No scheduler is installed or enabled by this package.

## Separately enabled services

If you choose to use Shopify CLI/Dev Dashboard/Partner Dashboard, Shopify processes the sign-in and authorized app/store operations under its policies. The user selects the account/organization and grants the required permissions. The package includes no publisher Shopify credentials.

If you choose Apify research, the official CLI/Console handles authentication. Apify and the selected Actor process the explicit public research input and produce stored run results under their policies. Runs can incur charges. Inputs should contain only public niche queries or app/review URLs—not passwords, tokens or customer records. The workflow requires input/spending review before execution and minimizes unnecessary reviewer identifiers in summaries.

The package does not collect or forward credential values itself. Agents should never read CLI auth caches, print secrets or copy sensitive data into a prompt, public issue or research input.

## Support and controls

GitHub and maintainers receive information you choose to include in issues. Public issues may be retained publicly; do not include private information. Use [private security reporting](SECURITY.md) for vulnerabilities and [GitHub support](https://github.com/khadinakbarlabs/shopify-app-builder/issues) for non-sensitive questions. GitHub's own policies govern its processing.

You can uninstall copied/native skills and disconnect separately enabled tools in your host. Removing this package does not delete Shopify apps, Apify runs or records stored by those providers; manage them through the provider's controls.

## Historical remote edition

Version 1.x included an optional hosted guidance MCP service. This release removes its source/configuration from the package, but does not itself undeploy a previously hosted endpoint or disconnect a saved client connection. Do not assume a historical service has stopped operating merely because v2 is installed.

For that edition, see [the v1.5.11 privacy disclosure](https://github.com/khadinakbarlabs/shopify-app-builder/blob/v1.5.11/PRIVACY.md) and the relevant host/provider policies. Historical remote operation is separate from this local package.

## References

[Shopify privacy](https://www.shopify.com/legal/privacy), [Apify privacy](https://docs.apify.com/legal/privacy-policy), [GitHub privacy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

This is a description of the package, not a replacement privacy policy for the app you build. Your app operator must disclose its actual collection, retention, recipients and deletion practices.
