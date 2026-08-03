#!/usr/bin/env node

import { access, mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_CACHES = Object.freeze([".shopify", ".next", "node_modules/.cache"]);
const ALLOWED_CACHES = new Set([...DEFAULT_CACHES, "prisma/.prisma"]);

async function pathExists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function backupCaches({ root = process.cwd(), include = DEFAULT_CACHES } = {}) {
  const normalizedRoot = path.resolve(root);
  const uniqueCaches = [...new Set(include)];

  for (const cachePath of uniqueCaches) {
    if (!ALLOWED_CACHES.has(cachePath)) {
      throw new Error(`Unsupported cache path: ${cachePath}`);
    }
  }

  const timestamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
  const backupDirectory = path.join(
    normalizedRoot,
    ".shopify-app-builder-backups",
    timestamp,
  );
  const moved = [];

  for (const cachePath of uniqueCaches) {
    const source = path.join(normalizedRoot, cachePath);
    if (!(await pathExists(source))) continue;
    const destination = path.join(backupDirectory, cachePath);
    await mkdir(path.dirname(destination), { recursive: true });
    await rename(source, destination);
    moved.push(cachePath);
  }

  return { backupDirectory, moved };
}

const isDirectExecution = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectExecution) {
  const include = [];
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--include" && args[index + 1]) {
      include.push(args[index + 1]);
      index += 1;
    }
  }
  backupCaches({ include: include.length ? include : undefined })
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
