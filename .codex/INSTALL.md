# Install in Codex

## Native plugin marketplace

```bash
codex plugin marketplace add khadinakbarlabs/shopify-app-builder
codex plugin add shopify-app-builder@shopify-app-builder
```

Restart Codex after installation. The native plugin exposes all bundled Agent Skills and the Codex plugin metadata.

## Portable skills fallback

```bash
npx skills add khadinakbarlabs/shopify-app-builder --skill '*' --agent codex --copy --yes
```

Use the fallback when the installed Codex build does not include plugin marketplace commands. See `docs/agents/codex.md` for use cases and operating guidelines.
