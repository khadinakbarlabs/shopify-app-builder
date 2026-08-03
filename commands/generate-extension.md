---
description: "Create Shopify app extension (Functions, Theme App Extension, or Admin UI) with proper scaffolding and configuration"
argument-hint: "extension-type, feature-name"
---

# Generate Shopify Extension

You are creating a Shopify app extension to extend storefront or admin functionality using Shopify Functions, Theme App Extensions, or Admin UI components.

## Extension Type Selection

1. **Choose extension architecture**
   - Cart Transformer (Shopify Functions): Modify cart before checkout
   - Discount Customization (Shopify Functions): Dynamic discount logic (WASM-based, Rust/JavaScript)
   - Payment Customization (Shopify Functions): Control payment method visibility
   - Theme App Extension: Inject liquid sections/blocks into Online Store 2.0 themes
   - Admin UI Extension: Custom app pages using App Bridge 4.x and Polaris
   - Reference skill: extension types (04_functions_auth_billing_mcp.md)

2. **Scaffold extension template**
   - Run `shopify app extension create --type [extension-type] --name [feature-name]`
   - Select language (JavaScript recommended for Functions; JSX for Admin UI)
   - Confirm directory structure created in /extensions/[feature-name]
   - Install dependencies for extension workspace

## Function Development (if applicable)

3. **Build Shopify Function logic**
   - Create input.graphql with query for cart/discount/payment data
   - Implement function.ts with pure function logic (no side effects)
   - Keep execution within 5ms time window (critical constraint)
   - Use Rust for performance-critical discount/payment logic
   - Reference skill: Functions architecture (04_functions_auth_billing_mcp.md)

4. **Define function configuration**
   - Set shopify.extension.toml with API version and capability
   - Map graphQL query to inputs for function execution
   - Define function output format (cart updates, discounts, or payment methods)
   - Test function with example payloads before deployment
   - Reference skill: function configuration (04_functions_auth_billing_mcp.md)

## Frontend Extension (if applicable)

5. **Build Admin or Theme UI**
   - Use App Bridge 4.x for Admin UI extensions (web components, session tokens)
   - Use Polaris React 18+ components for admin page styling
   - Import resource picker API for product/collection selection
   - Implement real-time updates with Admin API subscriptions
   - For Theme App Extensions, dedupe all schema `settings[].id` values and `blocks[].type` values before returning code. Resolve this plugin's installation root, then run `node <plugin-root>/scripts/validate-shopify-schema-ids.mjs extensions/[feature-name]` if a Liquid schema or app block is generated.
   - Reference skill: App Bridge and Polaris (03_frontend.md)

6. **Configure extension deployment**
   - Add extension reference to shopify.app.toml
   - Test extension locally with `shopify app dev`
   - Verify extension loads in development admin/storefront
   - Create extension-specific README with setup instructions

## Output Sample

Display completion with:
```
✓ Extension type: [extension-type]
✓ Feature: [feature-name]
✓ Scaffolding created at /extensions/[feature-name]
✓ Configuration validated
✓ Ready for development (next: graphql for data queries or audit-scopes for permissions)
```
