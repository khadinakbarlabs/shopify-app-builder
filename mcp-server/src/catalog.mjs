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

function countMatches(text, term) {
  return text.split(term).length - 1;
}

export function searchGuidance(catalog, query, limit = 8) {
  const terms = query.toLowerCase().match(/[a-z0-9][a-z0-9-]{1,}/g) ?? [];
  return catalog
    .map((entry) => {
      const id = entry.id.toLowerCase();
      const description = entry.description.toLowerCase();
      const body = entry.body.slice(0, 8_000).toLowerCase();
      const score = terms.reduce(
        (total, term) => total + countMatches(id, term) * 8 + countMatches(description, term) * 4 + countMatches(body, term),
        0,
      );
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
