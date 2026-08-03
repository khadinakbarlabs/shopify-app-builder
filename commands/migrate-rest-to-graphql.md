---
description: "Migrate legacy Shopify REST Admin API calls to the latest stable GraphQL Admin API with cost-aware queries and mutations"
argument-hint: "resource-type, migration-scope"
---

# Migrate REST to GraphQL

You are converting Shopify REST API calls to GraphQL for improved performance, better cost efficiency, and future API compatibility.

## Migration Assessment

1. **Inventory REST endpoints**
   - Search codebase for /admin/api/[year]/[resource].json endpoints
   - Document each REST call: method (GET/POST/PUT), resource type, usage frequency
   - Identify which endpoints have GraphQL query equivalents
   - Map REST response fields to GraphQL query fields (field names may differ)
   - Reference skill: API versioning and migration (02_apis.md)

2. **Assess cost-benefit**
   - Calculate REST endpoint cost (count-based billing, higher for batch operations)
   - Estimate GraphQL query cost for equivalent operation (field-level granularity)
   - Example: REST GET /products.json (100 fields) = 10 API calls/s; GraphQL query (10 fields) = 75 points
   - Identify high-impact migrations (batch endpoints, pagination-heavy queries)
   - Reference skill: GraphQL cost optimization (02_apis.md)

3. **Plan migration priority**
   - Prioritize REST endpoints with highest call volume
   - Start with read operations (GET) before mutations
   - Group related endpoints for batch migration (product endpoints together)
   - Plan rollback strategy for each migration phase
   - Reference skill: migration planning (02_apis.md)

## Implementation

4. **Convert REST to GraphQL queries**
   - Rewrite the REST products request as a GraphQL query using the latest supported stable API version
   - Add pagination with first: 25, after: "[cursor]" to REST limit parameters
   - Map REST filters (status=active) to GraphQL query filters
   - Include only needed fields (don't request full object if only id, title needed)
   - Reference skill: GraphQL query construction (02_apis.md)

5. **Implement GraphQL client**
   - Replace REST fetch calls with GraphQL client (@shopify/graphql-request or Apollo)
   - Update authentication header: X-Shopify-Access-Token (same as REST)
   - Convert response parsing: REST array becomes GraphQL data.resources.edges
   - Implement error handling for GraphQL errors (different structure than REST)
   - Reference skill: GraphQL client implementation (02_apis.md)

6. **Test and validate migration**
   - Compare REST and GraphQL results for first 10 items (data parity)
   - Monitor API cost in Shopify admin dashboard during transition
   - Confirm GraphQL queries complete within production SLA (response time <2s)
   - Test pagination with cursor-based navigation (vs REST offset)
   - Verify webhook data still matches expected format (webhooks return REST structure)

## Rollback and Production Deployment

7. **Deploy with feature flags**
   - Implement feature flag to toggle between REST and GraphQL per resource
   - Run A/B test: 10% GraphQL traffic, 90% REST for 1 week
   - Monitor error rates and response times
   - Roll out to 100% once stable (no regressions)
   - Reference skill: deployment patterns (01_cli_scaffolding.md)

## Output Sample

Display completion with:
```
✓ REST endpoints inventoried: [count] total
✓ GraphQL queries created: [count]
✓ Estimated cost reduction: [percentage]%
✓ Implementation complete for [resource-type]
✓ Testing validated: No data loss
✓ Feature flag deployed (GraphQL: [percentage]% traffic)
✓ Next: graphql command for additional resource migrations
```
