# Shopify App Builder 1.5.9

The native `.mcp.json` now declares `type: http`, which Claude requires for a remote HTTP server. The portable `mcp.json` continues to use `type: streamable-http` under the Agent Plugins schema. Both configurations point to the same public, credential-free endpoint.

This release fixes guidance search relevance discovered while testing the OpenAI review prompts. Search uses distinct normalized words, gives more weight to subject identifiers and descriptions, and reduces the influence of terms shared across the corpus. Billing, authentication, and accessibility prompts now rank their focused documents first.

The public privacy policy now explains tool-input processing, hosting and support recipients, retention, and user controls. The OpenAI manifest retains one remote MCP server and five positive and three negative review cases, with explicit safe fallback expectations for the negative cases.

The hosted server continues to offer only `search`, `fetch`, and `create_shopify_app_plan`, without merchant credentials or store access. A GitHub release does not indicate OpenAI approval. Directory submission still requires a successful portal upload and scans, the exact domain challenge from the portal, a real accessible video walkthrough, and review submission.
