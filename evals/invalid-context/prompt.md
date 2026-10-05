---
name: invalid-context
tags: [recovery, invalid-state]
runs: 1
max_turns: 10
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

My Shopify app's optional project record now says schemaVersion 999. I just want to continue fixing an error state. What should happen? Don't overwrite the record or claim it was repaired; no files are available.
