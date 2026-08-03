# Open-source release audit

Audit date: 2026-08-03

## Scope

The maintained source, both plugin manifests, 31 skills, 9 commands, 5 agents, scripts, documentation, generated package contents, and publish configuration were reviewed before the first public release.

## Remediated findings

- Removed a personal publisher name from Claude and Codex manifests.
- Removed three absolute macOS paths that exposed a local username and made scripts non-portable.
- Replaced a token-shaped access-token example with an unmistakable placeholder.
- Corrected 13 skill frontmatter names that did not match their directories.
- Replaced `rm -rf` troubleshooting recipes with a bounded helper that moves allowlisted caches into a recoverable project-local backup.
- Added missing package, license, legal, security, support, marketplace, icon, logo, and release metadata.
- Removed README claims that referenced nonexistent setup and marketplace files.
- Corrected obsolete REST/GraphQL rate limits, an invented REST sunset date, old revenue-share formulas, and unsupported Built for Shopify outcome claims.

## Credential result

No live credential was found in the maintained source. Secretlint and the package release validator reported zero credential findings after remediation. The release validator also rejects common private-key and provider-token formats, local user paths, symlinks, and unapproved packaged files.

## Remaining operational boundaries

The skills contain versioned Shopify guidance that can become stale. Production code, policy claims, review criteria, and paid acquisition decisions must be checked against current official Shopify documentation and live account surfaces. Third-party marketplace review or indexing is external and cannot be guaranteed by a local release check.
