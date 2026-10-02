# Version-sensitive technical reference

These examples are retained from v1.x for existing projects. Use the parent SKILL.md workflow first. Read only the section needed; verify API fields, SDK imports, templates, pricing and review requirements against current official documentation before copying code. Examples are not an install script or permission to run mutations. If this reference conflicts with the parent skill or current official documentation, follow the parent skill and official documentation.


# Shopify App Authentication

Shopify provides different authentication flows for embedded and non-embedded apps. Use Shopify's maintained app package and its authenticated API clients; never implement a token exchange or callback by copying a sketch. Request only the scopes an app actually needs.

## Authentication Flows Overview

### 1. Token Exchange (Recommended for 2024+)

**Use Case:** Embedded apps launched from Shopify Admin.
**Flow:** App Bridge obtains a session token; the server validates it and exchanges it for the required online or offline Admin API access token through Shopify's maintained app library.
**Security:** Keep the app secret and Admin API tokens server-side. Session tokens and Admin API access tokens are distinct.

**Token Exchange Diagram:**
```
1. Merchant grants the app's configured scopes during installation.
2. The embedded app obtains an App Bridge session token.
3. The server authenticates the request and uses Shopify's library for token exchange.
4. An authenticated Admin API client makes the scoped request.
```

**Remix Implementation (Token Exchange):**

```typescript
// shopify.app.ts (App Configuration)
import { shopifyApp } from '@shopify/shopify-app-remix/server';
import { restResources } from '@shopify/shopify-api/rest/admin/2026-07';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import { prisma } from '~/db.server';
import { getServerOnlyAppConfig } from '~/lib/config.server';

const appConfig = getServerOnlyAppConfig();

const shopify = shopifyApp({
  apiKey: appConfig.publicAppKey,
  apiSecret: appConfig.privateAppSecret,
  scopes: appConfig.scopes, // Configure only the scopes the app actually needs.
  appUrl: appConfig.appUrl,
  auth: {
    path: '/auth',
    callbackPath: '/auth/callback',
  },
  webhooks: {
    path: '/webhooks',
  },
  isEmbeddedApp: true, // Polaris admin dashboard
  sessionStorage: new PrismaSessionStorage(prisma),
  restResources, // Includes REST API helpers
});

export default shopify;
```

**Configuration contract:**

`getServerOnlyAppConfig()` is application code, not a plugin feature. Have the
application operator supply a public app key, private app secret, application
URL, and minimum required scopes through the target app's server-side secret
store. Do not inspect the user's environment, dotfiles, keychain, browser data,
or another credential source. Never put supplied values in generated source,
chat, logs, fixtures, or version control.

**Auth Routes (routes/auth.$.tsx - Catch-all route):**
```typescript
import { redirect } from '@shopify/remix-oxygen';
import { authenticate } from '~/shopify.server';

export const loader = async ({ request }) => {
  const { authenticate } = await import('~/shopify.server');
  return authenticate.admin(request); // Token Exchange happens here
};
```

**Callback Handling (routes/auth.callback.tsx):**
```typescript
import { json } from '@shopify/remix-oxygen';
import { authenticate } from '~/shopify.server';

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  // Session contains:
  // - session.accessToken (valid for API calls)
  // - session.shop (merchant's shop domain)
  // - session.scope (granted scopes)
  // - session.state (optional custom data)

  return redirect('/app'); // Redirect to dashboard after auth
};
```

**Using the authenticated Admin API client (routes/app.products.tsx):**
```typescript
import { json } from '@shopify/remix-oxygen';
import { authenticate } from '~/shopify.server';

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query GetProducts {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `);

  const { data, errors } = await response.json();
  if (errors?.length) throw new Response('Products unavailable', { status: 502 });
  return json({ products: data?.products?.edges ?? [] });
};
```

**Token Refresh (Automatic):**
Token Exchange tokens auto-refresh via Shopify's session middleware. No manual refresh needed:
```typescript
// Tokens are refreshed transparently on each request
const response = await admin.graphql(query); // Handles refresh internally
```

### 2. Managed Installation

**Use Case:** Shopify-managed installation and scope updates for an app. This concerns Admin API app installation, not Hydrogen customer authentication.
**Security:** Use the selected Shopify app package's authenticated Admin API client. Do not assume every token is permanent or construct a merchant-supplied URL to send credentials to.

**Managed Installation Setup:**

Use the current Dev Dashboard/CLI configuration flow. Inspect the selected framework's managed-installation settings, declared scopes and server-only session adapter. Do not follow an old Partner Dashboard screenshot or inspect CLI credential caches to configure this.

### 3. OAuth 2.0 Authorization Code Grant (Legacy, Still Supported)

**Use Case:** Public apps with traditional OAuth flow
**Flow:** Merchant clicks "Install" → App redirects to Shopify OAuth → Merchant authorizes → App receives code → App exchanges code for token
**Token Lifetime:** Depends on the current access-token type and configuration. Verify expiry, refresh and revocation in the selected framework; do not assume permanence.
**Security:** Use the maintained Shopify library and current flow requirements instead of applying a generic OAuth/PKCE rule to every Shopify authentication flow.

**OAuth Flow:** The merchant authorizes in Shopify Admin. The app library validates the callback and one-time state, exchanges the authorization code server-side, and persists the resulting session in a server-only store. Redirect URIs and scopes must match the app configuration.

Do not implement the authorization URL, HMAC comparison, state storage, or code exchange from an illustrative snippet. Use Shopify's maintained app/auth library for the chosen framework. If an application must implement this flow itself, its security review must verify a canonical `*.myshopify.com` shop hostname (not a substring match), one-time state, the exact callback HMAC algorithm and constant-time comparison, a fixed redirect URI, and server-only secret handling before sending any credential to Shopify. See [Shopify authentication and authorization](https://shopify.dev/docs/apps/build/authentication-authorization).

## Session Storage Adapters

Access tokens must be stored persistently. Shopify provides adapters for common storage backends:

### Prisma (Recommended for Remix)

**Schema (prisma/schema.prisma):**
```prisma
model Session {
  id        String    @id
  shop      String
  state     String
  isOnline  Boolean   @default(false)
  accessToken String
  refreshToken String?
  scope     String
  expiresAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([shop, state])
  @@index([shop])
}
```

**Setup (shopify.app.ts):**
```typescript
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import { prisma } from '~/db.server';

const shopify = shopifyApp({
  // ...
  sessionStorage: new PrismaSessionStorage(prisma),
});
```

### Redis

```typescript
import { RedisSessionStorage } from '@shopify/shopify-app-session-storage-redis';
import redis from 'redis';

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

const sessionStorage = new RedisSessionStorage({
  client: redisClient,
  prefix: 'shopify_session:',
});

const shopify = shopifyApp({
  // ...
  sessionStorage,
});
```

### In-Memory (Development Only)

```typescript
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage';

const sessionStorage = new MemorySessionStorage();

const shopify = shopifyApp({
  // ...
  sessionStorage, // CAUTION: Sessions lost on app restart; development only
});
```

### DynamoDB

```typescript
import { DynamoDBSessionStorage } from '@shopify/shopify-app-session-storage-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

const sessionStorage = new DynamoDBSessionStorage({
  client: dynamoDBClient,
  tableName: 'shopify-sessions',
});

const shopify = shopifyApp({
  // ...
  sessionStorage,
});
```

## Online vs. Offline Tokens

**Online Token:**
- Scope: Current user's permissions (typically admin user)
- Expiration: 24 hours
- Use Case: Browser-based actions (Polaris admin dashboard)
- Limitations: Cannot run background jobs; limited when user logs out

**Offline Token:**
- Scope: App's granted scopes
- Expiration: None; permanent until revoked
- Use Case: Background jobs, webhooks, scheduled tasks
- Limitations: None; use by default for app operations

**Requesting Offline Token in Token Exchange:**
```typescript
// shopify.app.ts
const shopify = shopifyApp({
  // ...
  auth: {
    path: '/auth',
    callbackPath: '/auth/callback',
  },
});

// Remix automatically requests offline token by default
// No action needed; use session.accessToken for API calls
```

**Using Offline Token for Webhooks:**
```typescript
// webhooks/products-update.ts
export const webhooks = {
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/webhooks/app-uninstalled',
  },
  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/webhooks/products-update',
  },
};

export default defineWebhooksConfig(
  async (request, { admin, session }) => {
    const { body, query } = await graphql.query(request, {
      query: GET_PRODUCT,
      variables: { id: 'gid://shopify/Product/123' },
    });

    // session.accessToken is offline token; valid here
    console.log(`Webhook processed with token for shop: ${session.shop}`);
  },
  webhooksConfig
);
```

## App Proxy Authentication

**Use Case:** Storefront (public-facing) requests to app backend
**Authentication:** HMAC signature validation (like webhooks)
**Flow:** Storefront → Liquid proxy request → App backend (validates HMAC) → Response

**Setting Up App Proxy (shopify.app.toml):**
```toml
[[extensions]]
type = "app_proxy"
name = "Storefront API"
url = "/api/proxy"
subpath = "loyalty"  # Requests to /apps/loyalty/* are routed here
```

**App Proxy Handler (Remix routes/api/proxy.ts):**
```typescript
import { json } from '@shopify/remix-oxygen';
import crypto from 'crypto';

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const hmac = url.searchParams.get('hmac') || '';
  const timestamp = url.searchParams.get('_t') || '';
  const shop = url.searchParams.get('shop') || '';

  // Build message to validate HMAC
  const params = new URLSearchParams();
  Array.from(url.searchParams.entries()).forEach(([key, value]) => {
    if (key !== 'hmac') params.append(key, value);
  });

  const message = params.toString();
  const hash = crypto
    .createHmac('sha256', getServerOnlyAppConfig().privateAppSecret)
    .update(message, 'utf8')
    .digest('base64');

  if (hash !== hmac) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate timestamp (within 24 hours)
  const requestTime = parseInt(timestamp, 10);
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - requestTime) > 86400) {
    return json({ error: 'Request expired' }, { status: 401 });
  }

  // Valid app proxy request; return customer's loyalty points
  const customerId = url.searchParams.get('customer_id') || '';
  const points = await getLoyaltyPoints(customerId);

  return json({ points });
};

async function getLoyaltyPoints(customerId: string) {
  // Fetch from database
  return 1500; // Example
}
```

**Storefront Liquid Snippet:**
```liquid
<div id="loyalty-widget">
  <p>Your loyalty points: <span id="points">Loading...</span></p>
</div>

<script>
fetch('/apps/loyalty?customer_id={{ customer.id }}')
  .then(r => r.json())
  .then(data => {
    document.getElementById('points').textContent = data.points;
  });
</script>
```

## Webhook Signature Verification

**How It Works:** Shopify sends HMAC-SHA256 signature in `X-Shopify-Hmac-SHA256` header

**Verify Signature (Manual):**
```typescript
import crypto from 'crypto';

export const verifyWebhookSignature = (
  request: Request,
  secret: string
): boolean => {
  const hmacHeader = request.headers.get('X-Shopify-Hmac-SHA256') || '';
  const body = request.body; // Must be raw bytes, not JSON

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(hmacHeader)
  );
};
```

**Verify Signature (Remix Shopify Package):**
```typescript
import { authenticate } from '~/shopify.server';

export const action = async ({ request }) => {
  const { webhook } = await authenticate.webhook(request);

  // Signature already validated by middleware
  console.log(`Webhook received for shop: ${webhook.shop}`);
  console.log(`Topic: ${webhook.topic}`);
  console.log(`Body:`, webhook.payload);

  return json({ status: 'ok' });
};
```

**Register Webhook (shopify.app.ts):**
```typescript
const shopify = shopifyApp({
  // ...
  webhooks: {
    path: '/webhooks',
    validateHmac: true, // Automatic signature verification
  },
});

// Define webhooks in routes/webhooks.ts
export const webhooks = {
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/webhooks/app-uninstalled',
  },
  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/webhooks/orders-create',
  },
};
```

## Customer Account API Authentication

**Use Case:** Access customer account data (orders, addresses, metafields)
**Authentication:** Customer-specific access tokens (from Shopify Hydrogen or customer flow)
**Note:** Different from admin API; limited to customer data only

**Use Hydrogen's authenticated Customer Account client:**
```typescript
// In a Hydrogen route loader after the customer login/authorization callback:
const {data, errors} = await context.customerAccount.query(`
  query CustomerProfile {
    customer {
      firstName
      lastName
    }
  }
`);
if (errors?.length) throw new Response('Customer profile unavailable', {status: 502});
  // A route loader must also commit context.session to persist any auth refresh.
  return data.customer;
```

`context.customerAccount` manages the customer credential and Customer Account API endpoint. Never place a customer access token inside a GraphQL string or send it to a manually assembled Storefront API URL. See [Customer Account API with Hydrogen](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/hydrogen).

## Public vs. Custom vs. Custom Distribution Apps

**Public App (Shopify App Store):**
- Listed in Shopify App Store
- OAuth 2.0 or Token Exchange
- Scopes reviewed by Shopify
- Available to all merchants
- Example: "Email Marketing Pro"

**Custom App (Internal Use):**
- Private; not listed in App Store
- No scopes; request all access
- Created by/for single merchant
- Only accessible to merchant account
- Example: Custom inventory sync for specific store

**Custom Distribution App:**
- Limited distribution; only shared with specific merchants via link
- Behaves like public app (listed in custom store) but not publicly visible
- OAuth 2.0 required
- Scopes still reviewed

**Configuration (shopify.app.toml):**
```toml
# Public App
scopes = "write_products,read_products,write_orders"
distribution = "public"

# Custom App (all scopes by default)
distribution = "private"

# Custom Distribution
distribution = "custom"
allowedDomains = ["company-partner.myshopify.com"]
```

## Top 10 Authentication Bugs & Fixes

| Bug | Symptom | Fix |
|-----|---------|-----|
| **Missing HMAC validation** | Webhook spoofing; malicious requests processed | Always validate HMAC signature in webhook handlers; use `authenticate.webhook(request)` |
| **Storing access token in session cookie** | Token exposed in browser; XSS vulnerability | Store token in database (Prisma); never send to client; use httpOnly cookies for session ID only |
| **Expired token not refreshed** | "Unauthorized" errors after 24h (online tokens) | Token Exchange auto-refreshes; OAuth tokens are permanent; Managed Installation tokens never expire |
| **Incorrect HMAC secret** | "Invalid signature" errors on valid requests | Use correct `SHOPIFY_API_SECRET`; verify in Partner Dashboard > App Settings |
| **State parameter not validated** | CSRF attacks; attacker redirects merchant | Store state in session; validate in callback; use `crypto.randomBytes(16).toString('hex')` for state generation |
| **App proxy timestamp not checked** | Old requests replayed; business logic executed twice | Validate timestamp within 24h; use `Math.abs(currentTime - timestamp) < 86400` |
| **Scope creep (requesting too many scopes)** | App rejected by Shopify; merchant distrust | Request only scopes needed; remove unused scopes from SCOPES array |
| **Token stored in environment variable for multi-tenant** | Security breach; one merchant's token accessed by another | Use database storage (Prisma/Redis); one token per shop; index by shop domain |
| **Webhook signature verified but not in constant-time** | Timing attacks; signature can be guessed | Use `crypto.timingSafeEqual()` for comparison; avoid simple `===` |
| **Customer access token hardcoded** | Exposed in source code; customer data accessed | Never hardcode tokens; use a server-only configuration boundary or customer auth flow |

## Full Working Examples

### Example 1: Remix Token Exchange App (Complete)

**Directory Structure:**
```
my-app/
├── app/
│   ├── routes/
│   │   ├── auth.$.tsx (Auth handler)
│   │   ├── auth.callback.tsx (Callback)
│   │   └── app.products.tsx (Protected route)
│   ├── shopify.server.ts (Config)
│   └── db.server.ts (Prisma client)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── app/lib/config.server.ts (server-only configuration boundary)
└── shopify.app.toml
```

**shopify.app.toml:**
```toml
scopes = "write_products,read_products,write_orders,read_orders"
```

**app/shopify.server.ts:**
```typescript
import { shopifyApp } from '@shopify/shopify-app-remix/server';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import { prisma } from '~/db.server';
import { getServerOnlyAppConfig } from '~/lib/config.server';

const appConfig = getServerOnlyAppConfig();

export const shopify = shopifyApp({
  apiKey: appConfig.publicAppKey,
  apiSecret: appConfig.privateAppSecret,
  scopes: appConfig.scopes,
  appUrl: appConfig.appUrl,
  auth: {
    path: '/auth',
    callbackPath: '/auth/callback',
  },
  webhooks: {
    path: '/webhooks',
  },
  isEmbeddedApp: true,
  sessionStorage: new PrismaSessionStorage(prisma),
});

export const authenticate = shopify.authenticate;
```

**app/routes/auth.$.tsx:**
```typescript
import { redirect } from '@shopify/remix-oxygen';
import { authenticate } from '~/shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return redirect('/app');
};
```

**app/routes/auth.callback.tsx:**
```typescript
import { json } from '@shopify/remix-oxygen';
import { authenticate } from '~/shopify.server';

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return redirect(`/app?shop=${session.shop}`);
};
```

**app/routes/app.products.tsx:**
```typescript
import { json } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { authenticate } from '~/shopify.server';

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query GetProducts {
      products(first: 10) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `);

  const products = response.data?.products?.edges || [];

  return json({ products });
};

export default function Products() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p.node.id}>{p.node.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 2: Webhook Signature Verification

**routes/webhooks.ts:**
```typescript
import { define } from '@shopify/shopify-app-remix/server';
import { DeliveryMethod } from '@shopify/shopify-api';

export const webhooks = define({
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/webhooks/app-uninstalled',
  },
  PRODUCTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/webhooks/products-create',
  },
  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/webhooks/products-update',
  },
});

export async function handleWebhook(
  topic,
  shop,
  body,
  webhookId
) {
  switch (topic) {
    case 'app/uninstalled':
      await deleteShopData(shop);
      break;
    case 'products/create':
      await syncProduct(shop, body);
      break;
    case 'products/update':
      await updateProduct(shop, body);
      break;
  }
}

async function deleteShopData(shop: string) {
  // Clean up shop data on uninstall
  console.log(`App uninstalled for shop: ${shop}`);
}

async function syncProduct(shop: string, body: any) {
  const product = JSON.parse(body).product;
  console.log(`Product created in ${shop}: ${product.title}`);
}

async function updateProduct(shop: string, body: any) {
  const product = JSON.parse(body).product;
  console.log(`Product updated in ${shop}: ${product.title}`);
}
```

**routes/webhooks/app-uninstalled.tsx:**
```typescript
import { json } from '@shopify/remix-oxygen';
import { authenticate } from '~/shopify.server';
import { deleteShopData } from '~/models/shop.server';

export const action = async ({ request }) => {
  const { webhook } = await authenticate.webhook(request);

  // HMAC signature already validated
  await deleteShopData(webhook.shop);

  return json({ status: 'processed' });
};
```

### Example 3: App Proxy with Customer Loyalty

**routes/api/proxy.tsx:**
```typescript
import { json } from '@shopify/remix-oxygen';
import crypto from 'crypto';

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const hmac = url.searchParams.get('hmac') || '';
  const timestamp = url.searchParams.get('_t') || '';

  // Build message for HMAC validation
  const params = new URLSearchParams();
  Array.from(url.searchParams.entries()).forEach(([key, value]) => {
    if (key !== 'hmac') params.append(key, value);
  });

  const message = params.toString();
  const hash = crypto
    .createHmac('sha256', getServerOnlyAppConfig().privateAppSecret)
    .update(message, 'utf8')
    .digest('base64');

  // Validate signature
  if (hash !== hmac) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate timestamp
  const requestTime = parseInt(timestamp, 10);
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - requestTime) > 86400) {
    return json({ error: 'Request expired' }, { status: 401 });
  }

  // Valid request; return loyalty data
  const customerId = url.searchParams.get('customer_id') || '';
  const loyaltyPoints = await getLoyaltyPoints(customerId);

  return json({ loyaltyPoints, success: true });
};

async function getLoyaltyPoints(customerId: string): Promise<number> {
  // Fetch from database
  return 1500;
}
```

## API Version & Scope Reference

**Current when this release was audited:** `2026-07`. Verify Shopify's latest stable version before deployment.

**Essential Scopes:**
- `write_products`, `read_products` — Manage product catalog
- `write_orders`, `read_orders` — Access order data
- `write_customers`, `read_customers` — Manage customer data
- `write_fulfillments`, `read_fulfillments` — Manage fulfillments
- `write_inventory`, `read_inventory` — Manage inventory levels
- `write_discounts`, `read_discounts` — Create/manage discounts
- `write_draft_orders`, `read_draft_orders` — Draft order management
- `write_checkout`, `read_checkout` — Checkout customization
- `write_metafields`, `read_metafields` — Manage custom data

**Scope Review:** Scopes are reviewed by Shopify during app approval. Request only necessary scopes.

## Resources

- **Shopify OAuth Docs:** https://shopify.dev/docs/apps/auth
- **Session Storage:** https://shopify.dev/docs/apps/auth-session-storage
- **Webhook Verification:** https://shopify.dev/docs/apps/webhooks/configuration/verify-webhook-authenticity
- **Token Exchange:** https://shopify.dev/docs/apps/auth/get-access-tokens/token-exchange
