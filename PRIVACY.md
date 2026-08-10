# Privacy

Shopify App Builder has two distributions: a local skills package and an optional read-only MCP server. Neither distribution has user accounts, analytics, telemetry, advertising identifiers, or a data-retention system.

The MCP server reads only the checked-in guidance corpus to answer `search`, `fetch`, and planning requests. It does not connect to Shopify stores, request Shopify credentials, or make changes to external systems. A deployment host may collect its own standard operational logs; deployers must configure those logs to avoid recording tool inputs, credentials, or unnecessary personal data.

The installer copies bundled Markdown skills and scripts to a directory selected by the user. It does not read Shopify credentials, browser data, source files, or environment variables. It does not make network requests.

When an AI coding agent uses a skill, that agent and any tools the user enables may process repository content or connect to third-party services. Those actions are governed by the user's agent configuration and the applicable service policies, not by this package. Users should review proposed commands, keep credentials in secret stores or environment variables, and limit tool permissions to the task.

Security reports should use the private reporting process in [SECURITY.md](SECURITY.md).
