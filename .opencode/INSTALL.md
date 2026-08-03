# Install in OpenCode

Add the native package to the `plugin` array in the global or project `opencode.json`:

```json
{
  "plugin": [
    "shopify-app-builder@git+https://github.com/khadinakbarlabs/shopify-app-builder.git"
  ]
}
```

Restart OpenCode. The plugin registers the canonical `skills/` directory without copying or linking files.

Portable fallback:

```bash
npx skills add khadinakbarlabs/shopify-app-builder --skill '*' --agent opencode --copy --yes
```

Dependency-free npm fallback:

```bash
npx shopify-app-builder install --agent opencode --global
```

Ask OpenCode to use `using-shopify-app-builder` for the first Shopify task so it can route to the focused skill set. See `docs/agents/opencode.md` for use cases and operating guidelines.
