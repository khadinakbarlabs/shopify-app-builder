---
type: regex
pattern: 'npm (?:init|install -g)|shopify app init'
flags: i
match: not_contains
target: last_message
---

Reject obvious detours. Not proof of a completed merchant feature.
