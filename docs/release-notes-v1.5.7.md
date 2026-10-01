# Shopify App Builder 1.5.7

This release adds a remote, read-only MCP connection to the portable and Codex plugin packages. The server can search the published Shopify engineering guidance, fetch a selected document, and make a phased implementation plan. It does not connect to merchant stores or accept credentials.

The Vercel adapter now bundles its MCP runtime dependencies during deployment. A preview deployment was checked with MCP initialization, tool discovery, and a guidance search. The npm skill installer remains dependency-free. OpenAI listing and review metadata are included in the portable manifest; directory review and publication remain separate provider decisions.

Hosted deployments upgraded from earlier releases should verify `/mcp` initialization after deployment. Domain verification, when required by a directory, must be configured separately at the hosting layer.
