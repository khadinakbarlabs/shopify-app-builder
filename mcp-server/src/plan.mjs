const DOMAIN_SKILLS = [
  [/(auth|oauth|token|session|install|hmac)/i, ["app-auth"]],
  [/(graphql|product|order|customer|inventory|metafield|metaobject)/i, ["admin-graphql", "metafields-metaobjects"]],
  [/(billing|subscription|usage charge|pricing|trial)/i, ["app-billing", "app-pricing-strategy"]],
  [/(webhook|event|fulfillment)/i, ["webhooks"]],
  [/(checkout|function|discount)/i, ["shopify-functions", "checkout-customer-pos-extensions"]],
  [/(storefront|headless|hydrogen|theme|liquid)/i, ["storefront-api", "hydrogen-storefront"]],
  [/(accessib|wcag|screen reader|keyboard)/i, ["app-accessibility"]],
  [/(performance|slow|latency|core web vital)/i, ["app-performance"]],
  [/(listing|app store|seo|launch|review)/i, ["app-listing-optimization", "built-for-shopify-standards"]],
];

const BASELINE_SKILLS = ["app-validation", "shopify-cli", "app-auth", "admin-graphql", "polaris-ui"];
const RELEASE_SKILLS = ["app-accessibility", "app-performance", "built-for-shopify-standards"];

function present(catalog, ids) {
  const known = new Set(catalog.map((entry) => entry.id));
  return ids.filter((id) => known.has(id));
}

export function createBuildPlan(catalog, goal, constraints = "") {
  const context = `${goal}\n${constraints}`;
  const matched = DOMAIN_SKILLS.flatMap(([pattern, ids]) => (pattern.test(context) ? ids : []));
  const skillIds = [...new Set([...BASELINE_SKILLS, ...matched, ...RELEASE_SKILLS])];
  const skills = present(catalog, skillIds).map((id) => {
    const entry = catalog.find((item) => item.id === id);
    return { id, title: entry.title, url: entry.sourceUrl };
  });

  return {
    goal,
    constraints: constraints || null,
    scope: [
      "Confirm the merchant problem, target users, success metric, and minimum Shopify access scopes before implementation.",
      "Keep secrets server-side and do not use this planning output as authorization to deploy, publish, bill merchants, or change a Shopify store.",
    ],
    phases: [
      {
        name: "Validate and design",
        actions: [
          "Define the smallest merchant workflow that solves the stated goal.",
          "Choose embedded-app, extension, storefront, or Function architecture and document the data boundaries.",
        ],
      },
      {
        name: "Build the foundation",
        actions: [
          "Create the app with the Shopify CLI, configure secure authentication, and use Admin GraphQL for new business logic.",
          "Implement the merchant workflow with Polaris and App Bridge patterns, including loading, empty, error, and permission states.",
        ],
      },
      {
        name: "Verify and release",
        actions: [
          "Test the happy path, authorization failures, invalid input, webhook retries, and rate-limit behavior relevant to the feature.",
          "Audit accessibility, performance, data minimization, and Built for Shopify readiness before any release decision.",
        ],
      },
    ],
    recommendedGuidance: skills,
  };
}
