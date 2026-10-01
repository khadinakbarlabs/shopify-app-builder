# Shopify App Builder 1.5.8

This release carries forward the remote, read-only MCP connection and OpenAI listing metadata introduced in 1.5.7. The server searches published Shopify engineering guidance, fetches a selected document, and creates phased implementation plans. It does not connect to merchant stores or accept merchant credentials.

Version 1.5.8 fixes the GitHub Actions workflow syntax for the bundled MCP smoke check. The npm skill installer remains dependency-free. OpenAI directory review and publication are separate from this GitHub release.

Hosted deployments upgraded from earlier versions should verify MCP initialization and tool discovery at `/mcp`. Directory domain verification must be configured separately at the hosting layer.
