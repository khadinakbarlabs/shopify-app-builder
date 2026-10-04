#!/usr/bin/env node
// Offline project records and reports. No network, credential discovery or scheduler.
import { randomUUID } from "node:crypto";
import { lstat, mkdir, open, readFile, realpath, rename, unlink, rmdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIRECTORY = ".shopify-app-builder";
const MAX_BYTES = 256 * 1024;
const sensitive = /(?:gh[pousr]_[a-z0-9_]{20,}|github_pat_[a-z0-9_]{20,}|(?:shpat|shpca|shpss|shpua)_[a-z0-9]{20,}|apify_api_[a-z0-9_-]{20,}|sk-(?:ant-|proj-)?[a-z0-9_-]{20,}|-----BEGIN .*PRIVATE KEY|bearer\s+[a-z0-9._-]{20,}|[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,})/i;
const isObject = value => value !== null && typeof value === "object" && !Array.isArray(value);
const isoDate = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;

export function newProject({name = "My Shopify app", problem = "", experience = "beginner", appType = "unknown", framework = "", apiVersion = ""} = {}, now = new Date().toISOString()) {
  const state = {schemaVersion: 1, revision: 0, updatedAt: now, profile: {name, problem, experience, appType, framework, apiVersion}, facts: [], decisions: [], milestones: [], sessions: [], feedback: []};
  assertValid(state);
  return state;
}

export function validateProject(state) {
  const errors = [];
  function shape(value, fields, label) {
    if (!isObject(value)) { errors.push(`${label} must be an object.`); return false; }
    for (const key of Object.keys(value)) if (!fields.includes(key)) errors.push(`${label} has an unsupported field.`);
    for (const key of fields) if (!Object.hasOwn(value, key)) errors.push(`${label}.${key} is required.`);
    return true;
  }
  function text(value, label, allowEmpty = false) {
    if (typeof value !== "string" || value.length > 600 || /[\u0000-\u001f\u007f]/.test(value) || (!allowEmpty && !value.trim())) errors.push(`${label} must be a short, single-line value.`);
    else if (sensitive.test(value) || /https?:\/\/[^\s/]+@/i.test(value)) errors.push(`${label} may contain credentials or contact data; remove it before saving.`);
  }
  function choice(value, values, label) { if (!values.includes(value)) errors.push(`${label} has an unsupported value.`); }
  function date(value, label, allowEmpty = false) { if (!(allowEmpty && value === "") && !isoDate(value)) errors.push(`${label} must be an ISO UTC timestamp.`); }
  function list(value, fields, label, check, max = 50) {
    if (!Array.isArray(value) || value.length > max) { errors.push(`${label} must be an array of at most ${max} records.`); return; }
    const ids = new Set();
    for (const row of value) {
      if (!shape(row, fields, label)) continue;
      if (typeof row.id !== "string" || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(row.id) || ids.has(row.id)) errors.push(`${label} needs unique lowercase record IDs.`);
      ids.add(row.id); check(row);
    }
  }
  if (!shape(state, ["schemaVersion", "revision", "updatedAt", "profile", "facts", "decisions", "milestones", "sessions", "feedback"], "project")) return errors;
  if (state.schemaVersion !== 1) errors.push("Unsupported schemaVersion; preserve the file and use a compatible helper.");
  if (!Number.isSafeInteger(state.revision) || state.revision < 0) errors.push("Invalid revision.");
  date(state.updatedAt, "updatedAt");
  if (shape(state.profile, ["name", "problem", "experience", "appType", "framework", "apiVersion"], "profile")) {
    for (const key of ["name", "problem", "framework", "apiVersion"]) text(state.profile[key], `profile.${key}`, key !== "name");
    choice(state.profile.experience, ["beginner", "intermediate", "expert"], "experience");
    choice(state.profile.appType, ["unknown", "embedded", "theme-extension", "custom", "headless"], "appType");
    if (state.profile.apiVersion && !/^\d{4}-(01|04|07|10)$/.test(state.profile.apiVersion)) errors.push("apiVersion must be a quarterly version or empty when unknown.");
  }
  list(state.facts, ["id", "key", "value", "status", "source", "verifiedAt"], "facts", row => {
    for (const key of ["key", "value", "source"]) text(row[key], `fact.${key}`, key === "source" && row.status === "assumed");
    choice(row.status, ["confirmed", "assumed"], "fact.status");
    date(row.verifiedAt, "fact.verifiedAt", row.status === "assumed");
  });
  list(state.decisions, ["id", "summary", "reason"], "decisions", row => {
    text(row.summary, "decision.summary"); text(row.reason, "decision.reason");
  });
  list(state.milestones, ["id", "title", "status", "blockedReason", "evidence"], "milestones", row => {
    text(row.title, "milestone.title"); text(row.blockedReason, "milestone.blockedReason", row.status !== "blocked");
    choice(row.status, ["pending", "in-progress", "blocked", "verified"], "milestone.status");
    if (!Array.isArray(row.evidence) || row.evidence.length > 20) { errors.push("milestone.evidence must contain at most 20 observations."); return; }
    if (row.status === "verified" && row.evidence.length === 0) errors.push("A verified milestone requires evidence.");
    for (const item of row.evidence) {
      if (!shape(item, ["kind", "summary", "source", "observedAt"], "evidence")) continue;
      choice(item.kind, ["local-test", "dev-store", "production", "review"], "evidence.kind");
      text(item.summary, "evidence.summary"); text(item.source, "evidence.source"); date(item.observedAt, "evidence.observedAt");
    }
  });
  list(state.sessions, ["id", "summary", "nextAction", "occurredAt"], "sessions", row => {
    text(row.summary, "session.summary"); text(row.nextAction, "session.nextAction"); date(row.occurredAt, "session.occurredAt");
  });
  list(state.feedback, ["id", "target", "category", "summary", "status", "createdAt"], "feedback", row => {
    choice(row.target, ["plugin", "app"], "feedback.target");
    choice(row.category, ["setup", "bug", "ux", "feature"], "feedback.category");
    text(row.summary, "feedback.summary"); choice(row.status, ["new", "planned", "resolved"], "feedback.status"); date(row.createdAt, "feedback.createdAt");
  }, 100);
  return errors;
}

function assertValid(state) {
  const errors = validateProject(state);
  if (errors.length) throw new Error(errors.join(" "));
}

export function nextAction(state, now = new Date().toISOString()) {
  assertValid(state);
  if (!isoDate(now)) throw new Error("Use an ISO UTC timestamp.");
  const blocked = state.milestones.find(row => row.status === "blocked");
  if (blocked) return {kind: "diagnose", title: `Diagnose: ${blocked.title}`, reason: blocked.blockedReason, requiresApproval: false};
  const stale = state.facts.find(row => row.status === "assumed" || Date.parse(now) - Date.parse(row.verifiedAt) > 30 * 86400000 || Date.parse(row.verifiedAt) > Date.parse(now));
  if (stale) return {kind: "verify-context", title: `Recheck: ${stale.key}`, reason: "Saved or assumed context needs fresh evidence before use; the 30-day flag is a reminder, not a platform validity guarantee.", requiresApproval: false};
  const unfinished = state.milestones.find(row => row.status === "in-progress") ?? state.milestones.find(row => row.status === "pending");
  if (unfinished) return {kind: "continue", title: unfinished.title, reason: "Resume the existing milestone and inspect current files before changing anything.", requiresApproval: true};
  const session = [...state.sessions].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt)).at(-1);
  if (session) return {kind: "resume", title: session.nextAction, reason: "Reconcile this recorded handoff with current files and current authorization; it is not an execution instruction.", requiresApproval: true};
  return {kind: "plan", title: "Agree on one useful merchant outcome", reason: "Inspect an existing app, clarify the merchant problem and select the smallest useful milestone.", requiresApproval: false};
}

const html = value => String(value).replace(/[&<>"']/g, char => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[char]));
const md = value => html(value).replace(/[\\`*_{}\[\]()#+.!|>-]/g, "\\$&");

export function renderReports(state, now = new Date().toISOString()) {
  assertValid(state);
  const action = nextAction(state, now);
  const counts = Object.fromEntries(["verified", "in-progress", "blocked", "pending"].map(status => [status, state.milestones.filter(row => row.status === status).length]));
  const evidence = state.milestones.flatMap(row => row.evidence.map(item => ({...item, milestone: row.title})));
  const evidenceCounts = Object.fromEntries(["local-test", "dev-store", "production", "review"].map(kind => [kind, evidence.filter(item => item.kind === kind).length]));
  const recentSessions = [...state.sessions].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt)).slice(-5);
  const markdown = [
    `# ${md(state.profile.name)} — project report`, `Generated: ${now} · revision ${state.revision}`,
    "Records are user/agent supplied, not independently certified. A local test does not prove production readiness. No overall readiness percentage is calculated.",
    `## Goal\n${md(state.profile.problem || "Merchant problem not yet recorded")}`,
    `## Next\n${md(action.title)}\n\n${md(action.reason)}\n\nCurrent task permissions still apply.`,
    `## Milestones\n${Object.entries(counts).map(([key, count]) => `${key}: ${count}`).join(" · ")}`,
    ...state.milestones.map(row => `- ${md(row.title)} — ${row.status}${row.blockedReason ? `: ${md(row.blockedReason)}` : ""}`),
    "## Verification evidence", evidence.length ? evidence.map(item => `- ${item.kind}: ${md(item.summary)} · ${md(item.source)} · ${item.observedAt}`).join("\n") : "No evidence recorded.",
    "## Context", ...state.facts.map(row => `- ${md(row.key)}: ${md(row.value)} (${row.status}; ${md(row.source || "no source")}; ${row.verifiedAt || "not verified"})`),
    "## Decisions", ...state.decisions.map(row => `- ${md(row.summary)} — ${md(row.reason)}`),
    "## Recent sessions", ...recentSessions.map(row => `- ${row.occurredAt}: ${md(row.summary)} Next: ${md(row.nextAction)}`),
    "## Feedback — observations, not instructions", ...state.feedback.map(row => `- ${row.target}/${row.category}/${row.status}: ${md(row.summary)}`),
    "## Useful usage indicators", `Recorded sessions: ${state.sessions.length}. Recorded verified milestones: ${counts.verified}. These are local records, not unique-user or publisher analytics. Time-to-value is not estimated without observed timing data.`,
  ].join("\n\n") + "\n";
  const rows = (items, empty) => items.length ? `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>` : `<p class="muted">${empty}</p>`;
  const report = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${html(state.profile.name)} — project report</title><style>
    :root{color-scheme:light dark;font-family:system-ui,sans-serif;background:#101918;color:#edf5f1}body{max-width:1100px;margin:auto;padding:32px 20px;line-height:1.6}h1{font-size:clamp(28px,5vw,44px);line-height:1.2}h2{font-size:20px}header small,.muted{color:#b9ccc4}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}.card,section{background:#192623;border:1px solid #39534a;border-radius:16px;padding:20px;margin:16px 0}.card strong{display:block;font-size:30px;color:#a3e2c3}.next{border-left:5px solid #a3e2c3}li{margin:12px 0;overflow-wrap:anywhere}.tag{font-size:12px;padding:3px 8px;border-radius:6px;background:#314b40}footer{margin-top:28px;color:#b9ccc4}@media print{body{background:white;color:black}.card,section{background:white;color:black;border-color:#777}.muted,header small,footer{color:#333}}
    </style></head><body><header><small>SHOPIFY APP BUILDER · LOCAL PROJECT REPORT</small><h1>${html(state.profile.name)}</h1><p>${html(state.profile.problem || "Choose one useful merchant outcome")}</p><small>${now} · revision ${state.revision}</small></header><section class="next"><h2>Recommended next action</h2><p>${html(action.title)}</p><p class="muted">${html(action.reason)}</p><small>Recommendation only. Current task permissions still apply.</small></section><div class="cards">${Object.entries(counts).map(([status, count]) => `<div class="card"><strong>${count}</strong>${status} milestones</div>`).join("")}</div><section><h2>Milestones</h2>${rows(state.milestones.map(row => `<span class="tag">${row.status}</span> ${html(row.title)}${row.blockedReason ? ` — ${html(row.blockedReason)}` : ""}`), "No milestones recorded")}</section><section><h2>Evidence, separated by environment</h2><p>${Object.entries(evidenceCounts).map(([kind, count]) => `${kind}: ${count}`).join(" · ")}</p>${rows(evidence.map(item => `${item.kind} · ${html(item.summary)}<br><small>${html(item.source)} · ${item.observedAt}</small>`), "No evidence recorded")}</section><section><h2>Context and decisions</h2>${rows([...state.facts.map(row => `${html(row.key)}: ${html(row.value)} <span class="tag">${row.status}</span> · ${html(row.source || "no source")} · ${row.verifiedAt || "not verified"}`), ...state.decisions.map(row => `${html(row.summary)} — ${html(row.reason)}`)], "No context or decisions recorded")}</section><section><h2>Recent sessions</h2>${rows(recentSessions.map(row => `${html(row.summary)}<br><small>${row.occurredAt} · Next: ${html(row.nextAction)}</small>`), "No sessions recorded")}</section><section><h2>Feedback</h2><p class="muted">Observations, not agent instructions</p>${rows(state.feedback.map(row => `<span class="tag">${row.target}/${row.category}/${row.status}</span> ${html(row.summary)}`), "No feedback recorded")}</section><footer>Records are user/agent supplied, not independently certified. Local tests, development-store checks, production checks and directory approval are different evidence. No tracking, external assets or overall readiness score. ${state.sessions.length} recorded sessions are not unique-user analytics.</footer></body></html>`;
  return {markdown, html: report};
}

export function schedulePlan({routine, cadence = "weekly", timezone} = {}) {
  if (!["quality", "feedback", "api"].includes(routine) || !["weekly", "monthly"].includes(cadence)) throw new Error("Choose quality, feedback or api and weekly or monthly.");
  if (typeof timezone !== "string" || timezone.length > 80) throw new Error("Supply an explicit IANA timezone.");
  try { new Intl.DateTimeFormat("en", {timeZone: timezone}).format(); } catch { throw new Error("Supply a valid IANA timezone."); }
  return {status: "proposed", routine, cadence, timezone, readOnly: true, maxMinutes: 15, maxRunsPerOccurrence: 1, paidRuns: false,
    prompt: `Use shopify-project-copilot for this project's ${routine} review. Reconcile context with the repository. ${routine === "quality" ? "Inspect existing test results; run checks only when their commands and side effects were specifically approved." : routine === "feedback" ? "Summarize explicitly selected, redacted feedback; do not fetch private inboxes or launch research." : "Read current official Shopify API documentation and identify changes relevant to the recorded app."} Do not change source, stores, billing, scopes, deployments or submissions; do not run paid services. Report evidence, blockers and the next action. Stay quiet when unchanged or non-actionable. Stop after 15 minutes; do not retry failed work automatically. Confirm exact time, timezone, runner, access, costs and pause control before enabling.`};
}

async function inspect(candidate, kind, maximumBytes = MAX_BYTES) {
  try {
    const stat = await lstat(candidate);
    if (stat.isSymbolicLink()) throw new Error("Refusing a symbolic link in project state or report paths.");
    if (kind === "directory" ? !stat.isDirectory() : !stat.isFile()) throw new Error("Unexpected project state path type.");
    if (kind === "file" && stat.size > maximumBytes) throw new Error("Project input exceeds the size limit.");
    return true;
  } catch (error) { if (error.code === "ENOENT") return false; throw error; }
}

async function directory(root, create = false) {
  const resolved = await realpath(root);
  await inspect(resolved, "directory");
  const dir = path.join(resolved, DIRECTORY);
  if (!(await inspect(dir, "directory"))) {
    if (!create) return null;
    await mkdir(dir, {mode: 0o700});
    await inspect(dir, "directory");
  }
  return dir;
}

async function readState(dir) {
  const file = path.join(dir, "project.json");
  if (!(await inspect(file, "file"))) return null;
  const contents = await readFile(file, "utf8");
  if (Buffer.byteLength(contents) > MAX_BYTES) throw new Error("Project input exceeds the size limit.");
  let state; try { state = JSON.parse(contents); } catch { throw new Error("Project JSON is invalid; preserve it and repair a copy."); }
  assertValid(state);
  return state;
}

export async function loadProject(root) {
  const dir = await directory(root);
  return dir ? readState(dir) : null;
}

async function locked(root, task) {
  const dir = await directory(root, true);
  const lock = path.join(dir, "write.lock");
  try { await mkdir(lock, {mode: 0o700}); } catch (error) {
    if (error.code === "EEXIST") throw new Error("Project is busy. Do not remove the lock until the other writer has stopped.");
    throw error;
  }
  try { return await task(dir); } finally { await rmdir(lock); }
}

async function atomicWrite(dir, filename, contents) {
  const destination = path.join(dir, filename);
  await inspect(destination, "file", MAX_BYTES * 8);
  const temporary = path.join(dir, `.write-${randomUUID()}`);
  const handle = await open(temporary, "wx", 0o600);
  try {
    await handle.writeFile(contents, "utf8"); await handle.sync(); await handle.close();
    await inspect(destination, "file", MAX_BYTES * 8);
    await rename(temporary, destination);
  } finally {
    await handle.close().catch(() => {});
    await unlink(temporary).catch(error => { if (error.code !== "ENOENT") throw error; });
  }
}

export async function saveProject(root, state, {expectedRevision} = {}) {
  assertValid(state);
  if (Buffer.byteLength(JSON.stringify(state)) > MAX_BYTES) throw new Error("Project input exceeds the size limit.");
  if (expectedRevision !== null && (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0)) throw new Error("Supply the revision being edited, or null for a new record.");
  return locked(root, async dir => {
    const current = await readState(dir);
    if ((current?.revision ?? null) !== expectedRevision) throw new Error("Project changed since it was read. Reload and reconcile; no data was overwritten.");
    if (state.revision !== (expectedRevision ?? 0)) throw new Error("The input revision does not match the revision being edited.");
    const next = {...state, revision: (current?.revision ?? 0) + 1, updatedAt: new Date().toISOString()};
    const ignore = path.join(dir, ".gitignore");
    if (!(await inspect(ignore, "file"))) await atomicWrite(dir, ".gitignore", "# Private local project context and reports\n*\n");
    await atomicWrite(dir, "project.json", JSON.stringify(next, null, 2) + "\n");
    return next;
  });
}

export async function writeReports(root, now = new Date().toISOString()) {
  if (!(await loadProject(root))) throw new Error("No project record. Initialize explicitly before generating a report.");
  return locked(root, async dir => {
    const reports = renderReports(await readState(dir), now);
    const output = path.join(dir, "reports");
    if (!(await inspect(output, "directory"))) await mkdir(output, {mode: 0o700});
    await atomicWrite(output, "latest.md", reports.markdown);
    await atomicWrite(output, "latest.html", reports.html);
    return {markdown: path.join(output, "latest.md"), html: path.join(output, "latest.html")};
  });
}

async function cli(args) {
  const [command, ...rest] = args;
  if (!command || command === "--help") {
    console.log("Offline project copilot: init --project <app-folder> [--name <name>] [--problem <merchant-task>]; status --project <app-folder>; update --project <app-folder> --input <reviewed-json>; report --project <app-folder>; feedback --project <app-folder> --target plugin|app --category setup|bug|ux|feature --summary <redacted-text>; schedule --routine quality|feedback|api --cadence weekly|monthly --timezone <IANA>. Schedule prints a proposal only. No telemetry or automatic execution."); return;
  }
  const allowed = {init: ["project", "name", "problem"], status: ["project"], update: ["project", "input"], report: ["project"], feedback: ["project", "target", "category", "summary"], schedule: ["routine", "cadence", "timezone"]}[command];
  if (!allowed) throw new Error("Unknown command. Use --help.");
  const options = {};
  for (let i = 0; i < rest.length; i += 2) {
    const key = rest[i].slice(2);
    if (!rest[i].startsWith("--") || !allowed.includes(key) || Object.hasOwn(options, key) || !rest[i + 1] || rest[i + 1].startsWith("--")) throw new Error("Unknown, duplicate or incomplete option. Use --help.");
    options[key] = rest[i + 1];
  }
  if (command === "schedule") { console.log(JSON.stringify(schedulePlan(options), null, 2)); return; }
  if (!options.project) throw new Error("Choose an existing app folder with --project.");
  if (command === "init") { await saveProject(options.project, newProject(options), {expectedRevision: null}); console.log("Local project record initialized. No app, account, tracking or schedule was created."); return; }
  const state = await loadProject(options.project);
  if (!state) throw new Error("No project record. Use init explicitly; existing app files are never scaffolded.");
  if (command === "status") console.log(JSON.stringify({revision: state.revision, profile: state.profile, next: nextAction(state)}, null, 2));
  if (command === "report") console.log(JSON.stringify(await writeReports(options.project), null, 2));
  if (command === "update") {
    if (!options.input || !(await inspect(path.resolve(options.input), "file"))) throw new Error("Choose a reviewed JSON input file.");
    const contents = await readFile(options.input, "utf8");
    if (Buffer.byteLength(contents) > MAX_BYTES) throw new Error("Project input exceeds the size limit.");
    let draft; try { draft = JSON.parse(contents); } catch { throw new Error("Input JSON is invalid."); }
    await saveProject(options.project, draft, {expectedRevision: draft?.revision}); console.log("Local context updated. Reports and external actions are unchanged.");
  }
  if (command === "feedback") {
    state.feedback.push({id: randomUUID(), target: options.target, category: options.category, summary: options.summary, status: "new", createdAt: new Date().toISOString()});
    await saveProject(options.project, state, {expectedRevision: state.revision}); console.log("Feedback saved locally. Nothing was shared with the publisher.");
  }
}

if (process.argv[1] && await realpath(process.argv[1]).catch(() => null) === fileURLToPath(import.meta.url)) {
  cli(process.argv.slice(2)).catch(error => {
    console.error(error.code ? "Local file operation failed. Check the selected folder and permissions; no external action was attempted." : error.message);
    process.exitCode = 1;
  });
}
