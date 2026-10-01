---
description: "Initialize a new Shopify app using Shopify CLI 3.x with Remix template, configure authentication, and set up local development environment"
argument-hint: "app-name, store-domain"
---

# Initialize Shopify App

You are scaffolding a new Shopify application. Follow these steps to create and configure the app.

## Setup Phase

1. **Create project with Shopify CLI**
   - Use `shopify app create [app-name]` with Node.js 20.19+
   - Select Remix template for web framework
   - Confirm package manager (npm/yarn/pnpm) based on store requirements
   - Reference skill: CLI scaffolding (01_cli_scaffolding.md)

2. **Configure server-only application settings**
   - Ask the application operator to add the public app key and private app secret through the target app's approved secret store
   - Add only the scopes the app needs (for example, read products and write orders)
   - Record the store domain and public app URL in the application's deployment configuration
   - Never inspect local credential files, shell variables, keychains, or browser storage; never write supplied values into source control
   - Reference skill: authentication patterns (04_functions_auth_billing_mcp.md)

3. **Initialize local development**
   - Run `shopify app dev` to start Remix server on localhost:3000
   - Confirm Vite HMR enabled for hot module replacement
   - Verify webhook tunnel created automatically
   - Install dependencies: npm install or yarn install

## Integration Phase

4. **Setup Token Exchange flow**
   - Create `/routes/auth/callback.jsx` with OAuth token handler
   - Implement session storage in SQLite or external DB
   - Add PKCE-compliant exchange endpoint
   - Reference skill: authentication flows (04_functions_auth_billing_mcp.md)

5. **Configure webhook subscriptions**
   - Define webhook topics in shopify.app.toml (PRODUCTS_CREATE, ORDERS_PAID)
   - Create webhook handlers in `/routes/webhooks/` directory
   - Implement webhook signature verification with HMAC-SHA256
   - Reference skill: webhook configuration (02_apis.md)

6. **Test local development**
   - Verify app loads in Shopify admin at /admin/apps/[app-id]
   - Confirm OAuth redirect works without errors
   - Test webhook delivery with test events from admin

## Output Sample

Display completion with:
```
✓ App initialized: [app-name]
✓ Environment configured for [store-domain]
✓ Development server running on http://localhost:3000
✓ Webhook tunnel active
✓ Ready for Feature Development (use generate-extension for next step)
```
