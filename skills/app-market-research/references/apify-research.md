# Optional Apify CLI research

Verified public Actor identity: [khadinakbar/shopify-app-store-scraper](https://apify.com/khadinakbar/shopify-app-store-scraper). It supports public app search, category, app details and reviews. Re-check its live input and pricing before running; this plugin is not an Apify subscription and no publisher credentials are included.

## Read-only preparation

Use installed help if a flag differs. The operator signs in using Apify's official flow, outside chat. Do not call token-display commands or inspect auth files.

```bash
apify --version
apify actors info khadinakbar/shopify-app-store-scraper --input
apify actors info khadinakbar/shopify-app-store-scraper --readme
```

Create a new, non-secret research-input.json in the user's chosen project/output folder (do not overwrite one silently):

```json
{
  "queries": ["inventory alerts"],
  "mode": "auto",
  "maxApps": 5,
  "maxReviews": 10,
  "scrapeReviews": false,
  "enrichDetails": false
}
```

This first pass returns listing cards. maxApps applies per query/category; the sample deliberately uses one query. maxReviews is only active for review collection. For review research use one confirmed public app/reviews URL in startUrls instead of queries, with a small maxReviews. Do not enable detail enrichment or review expansion without explaining extra requests/charges and receiving approval.

The plugin repository also offers scripts/prepare-app-research.mjs as an optional offline input generator. Copied-skills installs may not include it; the JSON above is sufficient.

## Spending gate

Show the Actor, exact input, current price model, proposed monetary maximum and approval before execution. Row/time limits reduce scope but do not guarantee a monetary cap. If this CLI version cannot enforce the approved hard budget, use Apify Console/API's documented run budget control with user authorization, or stop with a manual export path. Never invent a --max-total-charge flag on apify call.

After approval and budget controls are verified:

```bash
apify call khadinakbar/shopify-app-store-scraper --input-file research-input.json --json
```

Inspect the returned run using its actual ID, then retrieve only the relevant dataset sample:

```bash
apify runs info RUN_ID --json
apify datasets get-items DATASET_ID --format json --limit 20
```

RUN_ID and DATASET_ID are values from this approved run, not values to guess. Verify final status, input, record count, valid source URLs, observed charges and OUTPUT/RUN_SUMMARY when the Actor exposes them. If the CLI hides charge detail, inspect the run in Console rather than declaring the run under budget.

Never use apify run (local Actor development) when intending this published cloud Actor. Never rely on an inherited local default INPUT. Stop failed/empty/blocked runs and ask before retries or increased scope.

## Report shape

Use a compact competitor comparison: public source and date, observed pricing, target merchant, strengths, review themes, limits and sample count. Finish with evidence-backed MVP scope and explicitly unproven assumptions. Minimize copied review text and personal identifiers; do not turn public reviews into a contact list.

Sources: [Actor input](https://apify.com/khadinakbar/shopify-app-store-scraper/input-schema), [Actor pricing](https://apify.com/khadinakbar/shopify-app-store-scraper/pricing), [official CLI reference](https://docs.apify.com/cli/docs/reference).
