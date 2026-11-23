# From a merchant goal to a working increment

Use this for a broad build or an unclear first milestone, not every narrow repair.

## Example: low-stock alerts

Merchant goal: see which of this shop's products need attention, set a threshold, and understand whether alerts are active. Preserve the existing framework. Prefer the smallest useful page and server behavior before background jobs or paid plans.

Acceptance for a local first increment:

1. A signed-in merchant sees synthetic products below the chosen threshold; products above it are excluded. State which inventory quantity/location rule is used instead of inventing a global total.
2. Server code obtains the shop/session from the framework's authenticated request, never a caller-supplied shop ID. Queries and stored preferences are scoped to that shop. A two-shop fixture proves shop A cannot read or change shop B's data; unauthenticated requests are rejected.
3. Threshold input is validated server-side. The interface has clear loading, empty, success and failure states; a failed save does not show success.
4. Existing auth and approved scopes are preserved. Identify needed access from the chosen API operation; a new scope needs approval and a separately verified reauthorization flow. No credentials in prompts, fixtures or logs.
5. Write/run an affected behavioral regression and the project's relevant check. Record paths, outcomes and what the fixture covers. An embedded-admin/dev-store walkthrough is a separate gate, not inferred from unit tests.

Do not add billing, email delivery, an Actor, a new framework or deployment just to finish this increment. If notifications are requested, clarify recipient/channel and approval boundaries; test duplicate events, retries and delivery failures locally before live sends.

## Implementation loop

- Inspect only the relevant routes, model/storage access and tests. Reuse existing components and patterns.
- Summarize one acceptance milestone and any real blocker. Proceed with independent local implementation.
- Add a failing test where practical, make the bounded change, run it, and repair within scope.
- Distinguish local synthetic behavior, authorized test-store behavior, production behavior and provider review. Keep unexecuted checks visible.
- End with the working increment, its evidence, a remaining blocker if any, and one next action. Optional project context records this outcome; it does not replace it.

For other features, substitute the merchant action and acceptance conditions while retaining tenant isolation, authentication, least necessary access and truthful error states. A theme-only change needs a different test surface; do not impose an embedded-page architecture on it.
