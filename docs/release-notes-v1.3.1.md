# Shopify App Builder 1.3.1

This patch fixes the dependency-free npm installer when invoked through the binary symlink created by npm and `npx`.

- Resolves the executable path before deciding whether to run the CLI
- Adds a regression test that invokes the real installer through an npm-style symlink
- Retains all 31 portable Agent Skills and the security controls from 1.3.0

Use `npx shopify-app-builder@latest --help` or install skills directly with `npx skills add khadinakbarlabs/shopify-app-builder`.
