# Claude directory metadata and artwork

The authoritative Claude listing metadata is `.claude-plugin/plugin.json`, not the portable root `plugin.json` or an OpenAI listing extension.

The author and marketplace owner are the publisher-approved public name. The homepage and author URL point to the publisher website. Separate documentation, support, privacy-policy, terms, and icon fields are declared in the Claude manifest.

## Expected directory notices

- **Agent-plugins manifest detected:** the root manifest supports other coding agents. Claude ignores it and reads `.claude-plugin/plugin.json`. Keep both manifests for portability.
- **Directory fields ignored at load time:** fields such as `privacyPolicyUrl` and `icon` are read by Anthropic's directory, not used as executable runtime components. Older Claude Code validators warn about them; the current reference documents support without warnings in v2.1.281 and later. Removing them would remove listing metadata.
- **Image or font file / images passed without a code check:** `assets/icon.png` and `assets/logo.png` are PNG branding assets, not scripts or fonts. Their references are listing image metadata. No bundled script or MCP command invokes them as executable code. Retain the artwork for the icon and permit Anthropic's reviewer to inspect it; do not disguise it as source code or claim the directory hold is cleared before a live revalidation.

After a repository push, revalidate the existing submission and inspect the fetched commit and displayed listing. Repository metadata, a passing local validator, and a push are not proof of a refreshed or approved public directory listing.

Reference: https://code.claude.com/docs/en/plugins-reference#directory-listing-fields
