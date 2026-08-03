#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Usage: validate-shopify-schema-ids.mjs <theme-dir-or-schema-file> [...]');
  process.exit(2);
}

const files = [];
for (const target of targets) collectFiles(target);

const issues = [];
for (const file of files) validateFile(file);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.file}: ${issue.message}`);
  }
  process.exit(1);
}

console.log(`Shopify schema ID check passed for ${files.length} file(s).`);

function collectFiles(path) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) {
      if (entry === 'node_modules' || entry === '.git') continue;
      collectFiles(join(path, entry));
    }
    return;
  }

  const ext = extname(path);
  if (ext === '.liquid' || ext === '.json') files.push(path);
}

function validateFile(file) {
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('.liquid')) {
    const schemaBlocks = [...text.matchAll(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/g)];
    schemaBlocks.forEach((match, index) => {
      const schema = parseJson(match[1], file, `Liquid schema block ${index + 1}`);
      if (schema) validateSectionSchema(schema, file, `schema block ${index + 1}`);
    });
    return;
  }

  if (file.endsWith('settings_schema.json')) {
    const schema = parseJson(text, file, 'settings_schema.json');
    if (schema) validateThemeSettingsSchema(schema, file);
    return;
  }

  if (file.includes('/sections/') || file.includes('/blocks/') || file.includes('/snippets/')) {
    const schema = parseJson(text, file, 'JSON schema');
    if (schema) validateSectionSchema(schema, file, 'json schema');
  }
}

function parseJson(text, file, label) {
  try {
    return JSON.parse(text.trim());
  } catch (error) {
    if (text.includes('"settings"') || text.includes('"blocks"')) {
      issues.push({ file, message: `${label} is not valid JSON: ${error.message}` });
    }
    return null;
  }
}

function validateSectionSchema(schema, file, scope) {
  checkSettingArray(schema.settings, file, `${scope} settings`);

  if (Array.isArray(schema.blocks)) {
    checkDuplicates(
      schema.blocks.map((block) => typeof block?.type === 'string' ? block.type : null).filter(Boolean),
      file,
      `${scope} blocks[].type`,
    );

    for (const block of schema.blocks) {
      const type = typeof block?.type === 'string' ? block.type : 'unknown';
      checkSettingArray(block?.settings, file, `${scope} block "${type}" settings`);
    }
  }

  if (Array.isArray(schema.presets)) {
    const settingIds = new Set(getSettingIds(schema.settings));
    for (const preset of schema.presets) {
      if (!preset || typeof preset !== 'object' || !preset.settings) continue;
      for (const key of Object.keys(preset.settings)) {
        if (!settingIds.has(key)) {
          issues.push({
            file,
            message: `${scope} preset "${preset.name ?? 'unnamed'}" references missing setting "${key}"`,
          });
        }
      }
    }
  }
}

function validateThemeSettingsSchema(schema, file) {
  if (!Array.isArray(schema)) return;
  const allIds = [];
  for (const group of schema) {
    const name = group?.name ?? 'unnamed group';
    checkSettingArray(group?.settings, file, `settings_schema group "${name}"`);
    allIds.push(...getSettingIds(group?.settings).map((id) => `${id}`));
  }
  checkDuplicates(allIds, file, 'settings_schema global settings[].id');
}

function checkSettingArray(settings, file, scope) {
  if (!Array.isArray(settings)) return;
  checkDuplicates(getSettingIds(settings), file, `${scope} settings[].id`);
}

function getSettingIds(settings) {
  if (!Array.isArray(settings)) return [];
  return settings
    .map((setting) => typeof setting?.id === 'string' ? setting.id : null)
    .filter(Boolean);
}

function checkDuplicates(values, file, scope) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  for (const value of repeated) {
    issues.push({ file: displayPath(file), message: `${scope} duplicates "${value}"` });
  }
}

function displayPath(file) {
  return file.startsWith(process.cwd()) ? relative(process.cwd(), file) || file : file;
}
