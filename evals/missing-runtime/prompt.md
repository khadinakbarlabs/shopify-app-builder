---
name: missing-runtime
tags: [recovery, missing-tool]
runs: 1
max_turns: 10
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

I copied shopify-project-copilot into a coding harness, but Node isn't installed and shopify-project isn't on PATH. I need to resume my existing app, not install global tools automatically. What can we still do?
