---
type: regex
pattern: 'shopify app init|npm install -g|project\.mjs init'
flags: i
match: not_contains
target: last_message
---

Reject obvious detours. Not proof of a completed merchant feature.
