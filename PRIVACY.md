# Privacy

Effective date: October 1, 2026.

Shopify App Builder is an open-source project maintained by the publisher identified in its directory listing. It has a local skills package and an optional read-only MCP server. The application has no user accounts, advertising identifiers, analytics, tracking, or database of user requests.

## Information processed and purpose

The hosted MCP server receives the explicit tool arguments your agent sends: a search query, document identifier, optional result limits, or an app goal and optional constraints. These fields can contain personal information if you choose to include it. They are used only to search the published guidance corpus, retrieve a document, or calculate an implementation plan and return the response to your agent. The application does not reconstruct your conversation, inspect your repository, connect to Shopify stores, request merchant credentials, or make store changes.

Do not include passwords, API keys, customer records, payment details, health information, or other sensitive personal data in tool arguments. Use generic or synthetic app requirements instead. The application does not intentionally log request bodies or tool outputs; its error logging reports the error type rather than request contents.

## Recipients and retention

The public MCP endpoint runs on Vercel. Vercel processes network requests and standard operational metadata to provide hosting and security. Its infrastructure may process IP addresses, request paths, timing, status codes, and other request metadata. This is operational hosting, not behavioral profiling by this application. See [Vercel's privacy policy](https://vercel.com/legal/privacy-policy) for its data practices.

The application does not persist tool arguments or outputs. It uses them in memory for the request and does not maintain them as saved user records. Vercel's published runtime-log availability is one hour on Hobby, one day on Pro, or three days on Enterprise; Observability Plus extends availability to 30 days. The public deployment uses Pro. These [runtime-log limits](https://vercel.com/docs/logs/runtime) describe dashboard log availability, not all provider security or legal retention; Vercel's own policy governs that processing. Self-hosted deployments may use different providers and retention settings, which their operators must disclose.

If you open a support issue, GitHub and project maintainers receive the issue text and public account information you submit. Public issues remain available until deleted through GitHub's controls or removed by maintainers. Do not put private information in public issues. GitHub's retention and account controls are governed by [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). Security reports should use the private reporting process in [SECURITY.md](SECURITY.md).

Your coding-agent provider processes its conversations and the responses it receives under its own privacy policy. This application does not sell personal information or forward your tool arguments to Shopify, other APIs, or an external model provider.

## Your controls

You control the arguments sent to the server. You can stop sending requests, disconnect or uninstall the plugin in your agent, use the local skills without the public MCP endpoint, or self-host the server. Since the application has no saved request history or user accounts, it offers no account-level export or deletion interface. For a support issue or a privacy request involving information you supplied to maintainers, use the [project support page](https://github.com/khadinakbarlabs/shopify-app-builder/issues) without disclosing sensitive details publicly; for a security concern, use private reporting.

## Local package and separately enabled tools

The installer copies bundled Markdown skills and scripts to a directory selected by the user. It does not read Shopify credentials, browser data, source files, or environment variables. It does not make network requests.

When an AI coding agent uses a skill, that agent and any tools the user enables may process repository content or connect to third-party services. Those actions are governed by the user's agent configuration and the applicable service policies, not by this package. Users should review proposed commands, keep credentials in secret stores or environment variables, and limit tool permissions to the task.

Changes to these practices will be reflected here with an updated effective date.
