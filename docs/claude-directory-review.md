# Claude directory review notes for 1.5.9

The reported `MCP_SERVER_INVALID_DROPPED` and `REMOTE_MCP_TYPE_MISSING` failures were caused by a URL-only entry in the native `.mcp.json`. Version 1.5.9 explicitly declares `type: http` for the remote Streamable HTTP server. This matches [Claude's documented configuration](https://code.claude.com/docs/en/mcp#option-1-add-a-remote-http-server). The separate Agent Plugins `mcp.json` retains its schema's `streamable-http` value. Both point to the same public guidance server and contain no headers, credentials, environment interpolation, or shell commands.

The `UNREAD_ASSET_REFERENCED` finding concerns static listing artwork. The only source references to the two PNG files are `composerIcon` and `logo` in the root Agent Plugins manifest's OpenAI presentation extension. No command, hook, executable script, or MCP runtime loads an image as executable code. The native Claude manifest does not reference the artwork. The PNGs are square listing images; they remain packaged because OpenAI's public submission requires a primary icon. This is a policy-review explanation, not a claim that Claude's directory has cleared the hold.

The informational notice that Claude ignores the root Agent Plugins manifest is expected. Claude uses `.claude-plugin/plugin.json`, its native components, and `.mcp.json`; OpenAI's submission metadata is kept in the portable root manifest for the other distribution.

After GitHub updates, revalidate the existing Claude submission and verify that its checked commit includes the transport fix. Do not create a duplicate submission for the same repository path. Review any remaining policy findings before claiming directory approval.
