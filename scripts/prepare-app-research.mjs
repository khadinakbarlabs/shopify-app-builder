#!/usr/bin/env node
// Offline input preparation only. No login, token discovery, network or paid run.
import path from "node:path";
import { fileURLToPath } from "node:url";

function boundedInteger(value, fallback, maximum, name) {
  const result = value ?? fallback;
  if (!Number.isInteger(result) || result < 1 || result > maximum) {
    throw new Error(`${name} must be an integer between 1 and ${maximum}.`);
  }
  return result;
}

export function buildResearchInput({queries = [], startUrls = [], maxApps, maxReviews} = {}) {
  if (!Array.isArray(queries) || !Array.isArray(startUrls)) throw new Error("Targets must be arrays.");
  if (queries.length + startUrls.length !== 1) throw new Error("Choose one query or app URL for the first sample.");
  const input = {
    mode: "auto",
    maxApps: boundedInteger(maxApps, 5, 20, "maxApps"),
    maxReviews: boundedInteger(maxReviews, 10, 50, "maxReviews"),
    scrapeReviews: false,
    enrichDetails: false,
  };
  if (queries.length) {
    const query = queries[0];
    if (typeof query !== "string" || !query.trim() || query.length > 200 || /[\r\n\u0000-\u001f]/.test(query)) {
      throw new Error("Use a short public niche query, without control characters.");
    }
    input.queries = [query.trim()];
  } else {
    let url;
    try { url = new URL(startUrls[0]); } catch { throw new Error("Use a valid apps.shopify.com URL."); }
    if (url.username || url.password) throw new Error("Do not put credentials in URLs.");
    if (url.protocol !== "https:") throw new Error("Use HTTPS for the public app URL.");
    if (url.hostname !== "apps.shopify.com" || url.port || url.hash || url.search) {
      throw new Error("Use an apps.shopify.com app or reviews URL without a query, fragment or custom port.");
    }
    if (!/^\/[a-z0-9][a-z0-9-]*(?:\/reviews)?\/?$/.test(url.pathname)) {
      throw new Error("Use a direct app or reviews URL; use a niche query for search.");
    }
    input.startUrls = [{url: url.href}];
  }
  return input;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (!args.length || args.includes("--help")) {
      console.log("Offline Shopify research input: --query <public niche> OR --url <public app URL>, optionally --max-apps <1-20> --max-reviews <1-50>. Prints JSON; never starts a paid run.");
    } else {
      const values = {};
      const flags = new Set(["--query", "--url", "--max-apps", "--max-reviews"]);
      for (let i = 0; i < args.length; i += 2) {
        if (!flags.has(args[i]) || args[i + 1] === undefined || Object.hasOwn(values, args[i])) throw new Error("Unknown, duplicate or incomplete option. Use --help.");
        values[args[i]] = args[i + 1];
      }
      const input = buildResearchInput({
        queries: values["--query"] ? [values["--query"]] : [],
        startUrls: values["--url"] ? [values["--url"]] : [],
        maxApps: values["--max-apps"] === undefined ? undefined : Number(values["--max-apps"]),
        maxReviews: values["--max-reviews"] === undefined ? undefined : Number(values["--max-reviews"]),
      });
      console.log(JSON.stringify(input, null, 2));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
