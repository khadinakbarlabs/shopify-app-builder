# Shopify App Builder 1.5.3

This release addresses the Claude directory lint findings that exposed unsafe
examples in the shared skills corpus. No personal credential was identified in
the shipped source; the findings concerned instructions that could cause an
installer's credentials to leave their machine when copied into an app.

## Security guidance corrected

- Removed a hand-written OAuth callback that trusted any hostname containing
  `.myshopify.com` before posting an app secret to it. Implementations should
  use Shopify's maintained authentication library.
- Replaced a GraphQL string that interpolated a customer token with Hydrogen's
  request-scoped `context.customerAccount.query()` client.
- Replaced a legacy customer password/token example with Hydrogen's login and
  Customer Account API workflow.
- Removed a CLI example that placed a private Storefront token in a deploy
  command, and removed unnecessary credential-adjacent remote URL snippets.
- Added a test preventing these unsafe patterns from returning.

## Directory review

The Codex manifest still references two PNG brand assets. They are image files,
not executable entrypoints, and remain in the package for native branding.
The Claude directory may retain an image/font policy hold until a reviewer
inspects them. The OpenAI Apps challenge token is a server-operator-controlled
domain-verification value for the optional read-only MCP deployment, not a
Shopify user credential.

Use the existing Claude submission for this repository. If the portal says its
connected GitHub account cannot push to the repository, reconnect an account
with write access; source changes cannot grant that permission.
