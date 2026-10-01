import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const SKILL_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
const DEFAULT_REPOSITORY = "https://github.com/khadinakbarlabs/shopify-app-builder";

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error("Skill is missing YAML frontmatter");

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    fields[key] = value;
  }

  return { fields, body: text.slice(match[0].length).trim() };
}

function titleFromId(id) {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function skillSourceUrl(id, repository = DEFAULT_REPOSITORY) {
  return `${repository}/blob/main/skills/${encodeURIComponent(id)}/SKILL.md`;
}

export function loadGuidanceCatalog({ skillsDirectory, repository = DEFAULT_REPOSITORY }) {
  const entries = readdirSync(skillsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && SKILL_ID.test(entry.name))
    .map((entry) => {
      const id = entry.name;
      const file = path.join(skillsDirectory, id, "SKILL.md");
      const raw = readFileSync(file, "utf8");
      const { fields, body } = parseFrontmatter(raw);
      if (fields.name !== id || !fields.description) {
        throw new Error(`Invalid skill metadata in ${file}`);
      }

      return Object.freeze({
        id,
        title: titleFromId(id),
        description: fields.description,
        body,
        sourceUrl: skillSourceUrl(id, repository),
      });
    })
    .sort((left, right) => left.id.localeCompare(right.id));

  if (!entries.length) throw new Error(`No guidance files found in ${skillsDirectory}`);
  return Object.freeze(entries);
}

const COMMON_QUERY_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "how", "i", "in", "is", "it",
  "me", "my", "of", "on", "or", "the", "to", "use", "what", "when", "which", "with", "you",
  "app", "shopify", "guidance", "bundled", "find", "open", "read", "should", "summarize", "list",
]);

function searchTerms(text) {
  return new Set((text.toLowerCase().match(/[a-z0-9]+/g) ?? [])
    .map((term) => term.length > 3 && term.endsWith("s") && !term.endsWith("ss") ? term.slice(0, -1) : term));
}

export function searchGuidance(catalog, query, limit = 8) {
  const queryTerms = [...searchTerms(query)];
  const focusedTerms = queryTerms.filter((term) => !COMMON_QUERY_WORDS.has(term));
  const terms = focusedTerms.length ? focusedTerms : queryTerms;
  const indexed = catalog.map((entry) => ({
    entry,
    id: searchTerms(entry.id),
    description: searchTerms(entry.description),
    body: searchTerms(entry.body.slice(0, 8_000)),
  }));
  const weights = new Map(terms.map((term) => {
    const matchingDocuments = indexed.filter(({ id, description, body }) => id.has(term) || description.has(term) || body.has(term)).length;
    return [term, Math.log(1 + catalog.length / (1 + matchingDocuments))];
  }));
  return indexed
    .map(({ entry, id, description, body }) => {
      const score = terms.reduce((total, term) => total + weights.get(term) * (
        (id.has(term) ? 12 : 0) + (description.has(term) ? 6 : 0) + (body.has(term) ? 2 : 0)
      ), 0);
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.entry.id.localeCompare(right.entry.id))
    .slice(0, limit)
    .map(({ entry }) => ({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      url: entry.sourceUrl,
    }));
}

export function findGuidance(catalog, id) {
  return catalog.find((entry) => entry.id === id) ?? null;
}
