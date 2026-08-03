---
description: "Audit and minimize API scopes for security, verify scope usage, and generate scope justification for App Store submission"
argument-hint: "current-scopes, target-resource"
---

# Audit and Minimize API Scopes

You are reviewing and optimizing Shopify API scopes to follow least-privilege principle and prepare for App Store certification.

## Scope Inventory and Assessment

1. **List current scopes**
   - Extract scopes from shopify.app.toml SCOPES array
   - Common scopes: read_products, write_orders, read_customers, read_inventory, manage_apps
   - Document each scope's purpose in app (e.g., read_products → product sync feature)
   - Reference skill: scope reference (02_apis.md)

2. **Analyze scope usage**
   - Search codebase for GraphQL mutations using each scope
   - Identify read vs write scope requirements per feature
   - Check if any scopes unused or can be removed
   - Example: if no customer mutations, remove write_customers scope
   - Reference skill: API access patterns (02_apis.md)

3. **Map scopes to features**
   - Create inventory: scope → feature functionality
   - Identify scopes only needed for admin dashboards (can be feature-gated)
   - Mark scopes needed for webhooks vs direct API calls
   - Document which scopes trigger App Store review flags
   - Reference skill: permission design (04_functions_auth_billing_mcp.md)

## Optimization and Verification

4. **Remove unnecessary scopes**
   - Test app functionality with minimal scope set
   - Remove read scopes if information retrieved from webhooks instead
   - Replace write scopes with read-only if mutations not needed
   - Example: use read_orders + ORDERS_PAID webhook instead of write_orders
   - Reference skill: scope minimization (02_apis.md)

5. **Verify scope permissions**
   - Confirm each scope matches actual API calls in codebase
   - Check GraphQL queries/mutations require all declared scopes
   - Test app reinstall with new scope set (triggers re-authorization)
   - Verify no "access denied" errors in production logs
   - Reference skill: error handling (02_apis.md)

6. **Document scope justification**
   - Create SCOPE_JUSTIFICATION.md with one-line purpose per scope
   - Example: "read_products: Display product inventory levels in app dashboard"
   - Include in App Store submission materials for Built for Shopify certification
   - Reference skill: App Store submission (05_appstore_strategy.md)

## Output Sample

Display completion with:
```
✓ Current scopes audited: [count] total
✓ Unused scopes removed: [count]
✓ Optimized scope set: [scope1, scope2, ...]
✓ Scope justification documented
✓ Ready for App Store submission (next: optimize-listing for marketplace visibility)
```
