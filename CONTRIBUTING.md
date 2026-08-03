# Contributing

Thank you for improving Shopify App Builder.

1. Fork the repository and create a focused branch.
2. Keep every `skills/<name>/SKILL.md` name lowercase, hyphenated, and identical to its directory name.
3. Use placeholders for credentials. Never commit `.env` files, access tokens, store domains, merchant data, or personal filesystem paths.
4. Cite official Shopify documentation for time-sensitive API, policy, billing, or review claims.
5. Add or update tests for scripts and validators.
6. Run `npm run release:check` before opening a pull request.

Keep skills focused enough for an agent to select them reliably. Move reusable scripts beside the skill or into `scripts/`, and prefer recoverable operations over deletion.
