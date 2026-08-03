---
description: "Deploy Shopify app to production with CLI release, verify deployment, and configure post-deployment webhooks and metrics"
argument-hint: "environment, version-tag"
---

# Deploy App to Production

You are releasing a Shopify app to production environment with proper versioning, health checks, and rollback capability.

## Pre-Deployment Validation

1. **Verify build and dependencies**
   - Run `npm run build` (or `yarn build`) to compile Remix production build
   - Ensure no TypeScript compilation errors
   - Verify all environment variables set for production (SHOPIFY_API_KEY, SHOPIFY_API_SECRET)
   - Confirm database migrations applied to production schema
   - Reference skill: CLI deployment (01_cli_scaffolding.md)

2. **Security and compliance check**
   - Verify OAuth Token Exchange flow uses PKCE
   - Confirm webhook signature verification enabled on all handlers
   - Check API scopes follow principle of least privilege
   - Ensure no hardcoded credentials in codebase
   - Reference skill: authentication security (04_functions_auth_billing_mcp.md)

3. **Test critical workflows**
   - Verify app installation flow completes without errors
   - Test OAuth redirect and token exchange
   - Confirm webhooks trigger and process events
   - Validate billing API integration if applicable
   - Reference skill: testing patterns (01_cli_scaffolding.md)

## Deployment Execution

4. **Release to production**
   - Execute `shopify app release --version [version-tag]`
   - Confirm deployment pipeline (GitHub Actions or CI/CD system) succeeds
   - Verify app assets uploaded to CDN
   - Monitor deployment logs for errors
   - Reference skill: CLI release workflow (01_cli_scaffolding.md)

5. **Verify production deployment**
   - Confirm app loads in production Shopify admin
   - Test OAuth flow with production credentials
   - Verify webhook tunnel points to production endpoint
   - Check production logs for errors or warnings
   - Monitor API rate limit usage from admin dashboard

6. **Post-deployment configuration**
   - Enable production webhook topics if different from development
   - Configure monitoring and alerting for error rates
   - Set up logging aggregation (CloudWatch, Datadog, etc.)
   - Create runbook for common production issues
   - Reference skill: deployment configuration (01_cli_scaffolding.md)

## Output Sample

Display completion with:
```
✓ Production build compiled successfully
✓ Version [version-tag] released to production
✓ App deployed and verified at https://admin.shopify.com/apps/[app-id]
✓ Webhooks active in production
✓ Monitoring enabled for error tracking
✓ Ready for app submission (next: optimize-listing for App Store)
```
