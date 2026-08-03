---
description: "Build version-safe Shopify Admin GraphQL queries and mutations, optimize query cost, and implement error handling"
argument-hint: "operation-type, resource-type"
---

# Admin GraphQL Operations

You are constructing Admin GraphQL queries and mutations with cost optimization. Confirm the latest stable API version before generating the endpoint.

## Query Planning

1. **Select operation type and resources**
   - Query operations: products, orders, customers, inventory, fulfillments
   - Mutation operations: updateProduct, createOrder, updateInventory, addFulfillment
   - Confirm the latest stable API version and the store plan's cost restore rate (standard: 100 points/second)
   - Reference skill: GraphQL operations (02_apis.md)

2. **Design query structure**
   - Request only necessary fields (don't use fragments initially for clarity)
   - Use pagination with first:25, after: "[cursor]" for large result sets
   - Add filters for specific resource lookups (e.g., query: "status:active")
   - Minimize nested relationships to reduce query cost
   - Reference skill: query optimization (02_apis.md)

3. **Calculate query cost**
   - Use query complexity algorithm: each field has cost value
   - Simple fields (id, title) = 1 point; connections (products) = depends on requested count
   - Example: products(first:25) with 5 fields per product ≈ 75 points
   - Keep queries under 800 points for safety margin
   - Reference skill: cost calculation (02_apis.md)

## Implementation

4. **Build GraphQL request**
   - Use GraphQL client library (Apollo Client or @shopify/graphql-request)
   - Construct operation string with query/mutation definition
   - Add variables object for dynamic parameters (e.g., productId, input data)
   - Include error handling for rate limit responses (HTTP 429)

5. **Execute and handle responses**
   - Send POST request to `https://[store-domain]/admin/api/2026-07/graphql.json`, after confirming `2026-07` is still supported
   - Include X-Shopify-Access-Token header with session token
   - Parse response.data for successful operations
   - Log response.extensions.cost for monitoring (track cumulative daily cost)
   - Reference skill: API versioning (02_apis.md)

6. **Implement error handling**
   - Catch GraphQL errors in the response `errors` array
   - Handle `THROTTLED` errors using `extensions.cost.throttleStatus` and bounded backoff
   - Log mutation failures with full error context
   - Do not fall back to legacy REST for new public apps; retry safely or fail with an actionable error
   - Reference skill: error patterns (02_apis.md)

## Output Sample

Display completion with:
```
✓ Operation type: [operation-type]
✓ Resource: [resource-type]
✓ Query cost: [points] points (within budget)
✓ Request executed successfully
✓ Results retrieved: [count] items
✓ Next: deploy-app to push to production
```
