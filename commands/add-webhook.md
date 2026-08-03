---
description: "Add webhook subscriptions for Shopify events (orders, products, inventory) with signature verification and handler routing"
argument-hint: "webhook-topic, handler-path"
---

# Add Webhook Subscription

You are adding event-driven integrations to a Shopify app. Configure webhooks with proper signature verification and handler patterns.

## Topic Selection and Registration

1. **Define webhook topic**
   - Select from supported topics: ORDERS_PAID, PRODUCTS_CREATE, INVENTORY_LEVELS_UPDATE, CUSTOMER_CREATED, FULFILLMENT_EVENTS_CREATE
   - Add to shopify.app.toml under webhooks section with `topic: [TOPIC_NAME]`
   - Confirm compatibility with the latest supported stable API version
   - Reference skill: webhook topics (02_apis.md)

2. **Configure webhook endpoint**
   - Create handler at `/routes/webhooks/[webhook-topic].jsx`
   - Endpoint receives POST requests from Shopify infrastructure
   - Ensure endpoint returns 200 OK within 5 seconds (async processing recommended)
   - Reference skill: webhook architecture (01_cli_scaffolding.md)

## Handler Implementation

3. **Implement signature verification**
   - Extract X-Shopify-Hmac-SHA256 header from request
   - Compute HMAC-SHA256 using raw request body + SHOPIFY_API_SECRET
   - Compare computed vs provided HMAC (constant-time comparison)
   - Reject if signatures don't match (security critical)
   - Reference skill: webhook security (02_apis.md)

4. **Process webhook payload**
   - Parse JSON body from webhook request
   - Extract relevant fields from event object (e.g., orderId, productId)
   - Route to business logic handlers based on webhook topic
   - Log processed event with timestamp and status
   - Reference skill: event processing patterns (01_cli_scaffolding.md)

5. **Handle async operations**
   - Queue long-running tasks (API calls, data syncs) to job processor
   - Return 200 immediately; process details asynchronously
   - Implement retry logic for failed webhook processing (exponential backoff)
   - Store webhook state in database for idempotency

## Testing and Deployment

6. **Test webhook delivery**
   - Use Shopify admin "Test event" button for registered topics
   - Verify handler receives payload and returns 200
   - Confirm log entries show successful processing
   - Check database for expected side effects

## Output Sample

Display completion with:
```
✓ Webhook registered: [WEBHOOK_TOPIC]
✓ Handler created at [handler-path]
✓ Signature verification enabled
✓ Test event processed successfully
✓ Ready for integration (next: validate-idea to track metrics)
```
