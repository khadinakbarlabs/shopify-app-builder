---
description: "Validate Shopify app idea against market demand, category saturation, App Store discovery patterns, and monetization viability"
argument-hint: "app-category, target-merchant-type"
---

# Validate App Idea

You are assessing Shopify app concept against market conditions, discovery patterns, and monetization models before committing to development.

## Market Validation

1. **Assess category saturation**
   - Map app category against saturation matrix (undersaturated vs oversaturated)
   - Undersaturated categories: shipping analytics, advanced inventory, supplier management, accounting integrations
   - Oversaturated categories: discount apps, basic analytics, page builders
   - Identify category positioning and competitive differentiation
   - Reference skill: category analysis (05_appstore_strategy.md)

2. **Evaluate merchant target**
   - Define merchant persona: SMB (1-50 employees), Mid-market (50-500), Enterprise (500+)
   - Identify pain points specific to target segment
   - Research if similar problems solved by existing apps
   - Confirm addressable market size (how many Shopify stores match criteria)
   - Reference skill: market opportunity sizing (05_appstore_strategy.md)

3. **Research discovery patterns**
   - Study top 20 apps in target category (search volume, install velocity)
   - Analyze app listing SEO: keywords, description length, icon clarity
   - Check if app requires "Built for Shopify" badge for discoverability
   - Identify messaging pillars (efficiency, revenue impact, ease-of-use)
   - Reference skill: App Store discovery (05_appstore_strategy.md)

## Monetization and Feasibility

4. **Select monetization model**
   - Freemium: free tier + premium paid features (highest discovery)
   - Tiered pricing: $99/mo, $299/mo, $999/mo tiers (most common)
   - Usage-based: charge per transaction/order processed
   - One-time charges for setup/migration
   - Model Shopify's current revenue-share tier, 2.9% processing fee, taxes, refunds, and regional fees separately
   - Reference skill: pricing models (05_appstore_strategy.md)

5. **Project financial viability**
   - Estimate install velocity: undersaturated category ≈ 5-20/month new installs
   - Model revenue: 100 installs × $50/mo average = $5,000/mo at steady state
   - Account for 30% churn; maintain pricing test assumptions
   - Identify breakeven install count based on development + infrastructure costs
   - Reference skill: monetization strategy (05_appstore_strategy.md)

6. **Confirm technical feasibility**
   - Verify APIs support core functionality (GraphQL mutations available)
   - Check Shopify Functions availability for dynamic pricing/cart logic
   - Confirm theme accessibility for storefront features (if needed)
   - Estimate development time: MVP ≈ 4-8 weeks for experienced developers
   - Reference skill: technical architecture (01_cli_scaffolding.md, 04_functions_auth_billing_mcp.md)

## Output Sample

Display completion with:
```
✓ Category: [app-category] ([saturation-level])
✓ Target merchants: [target-merchant-type]
✓ Positioning: [key-differentiator]
✓ Monetization model: [model] at [pricing-tier]
✓ Projected baseline revenue: [estimate]
✓ Technical feasibility: Confirmed
✓ Ready for development (next: init-shopify-app to begin scaffolding)
```
