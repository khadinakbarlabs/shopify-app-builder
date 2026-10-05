import assert from "node:assert/strict";
import {mkdtemp, mkdir, readFile, writeFile, symlink} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import test from "node:test";

const run = promisify(execFile);
const helper = path.resolve("skills/shopify-project-copilot/scripts/project.mjs");
const temp = () => mkdtemp(path.join(os.tmpdir(), "shopify-contract-"));
async function invoke(args) {
  try { const result = await run(process.execPath, [helper, ...args]); return {...result, exitCode: 0, receipt: JSON.parse(result.stdout)}; }
  catch (error) { return {stdout:error.stdout, stderr:error.stderr, exitCode:error.code, receipt:JSON.parse(error.stdout)}; }
}

test("missing app is a structured blocked result with actionable recovery and no secret/path echo", async () => {
  const root = await temp();
  const result = await invoke(["status", "--project", path.join(root, "missing-private-folder")]);
  assert.equal(result.exitCode, 1);
  assert.equal(result.receipt.error.code, "PROJECT_NOT_FOUND");
  assert.equal(result.receipt.state, "blocked");
  assert.match(result.receipt.error.recovery, /existing app folder/);
  assert.equal(result.receipt.externalOutcome, "not-attempted");
  assert.ok(!result.stdout.includes("missing-private-folder"));
  assert.equal(result.stderr, "");
});

test("doctor inspects selected app without setup, running scripts or saving context", async () => {
  const root = await temp();
  await writeFile(path.join(root,"package.json"), JSON.stringify({dependencies:{"@shopify/shopify-app-react-router":"1.0.0"},scripts:{test:"never execute me",dev:"never execute me"}}));
  await writeFile(path.join(root,"shopify.app.toml"), 'client_id = "do-not-expose"\n[access_scopes]\nscopes = "read_products"\n[webhooks]\napi_version = "2026-10"\n');
  const {receipt,exitCode} = await invoke(["doctor","--project",root]);
  assert.equal(exitCode,0);
  assert.equal(receipt.operation,"doctor");
  assert.equal(receipt.verificationLevel,"observed-files");
  assert.deepEqual(receipt.outputs.frameworks,["React Router"]);
  assert.deepEqual(receipt.outputs.availableChecks,["test"]);
  assert.deepEqual(receipt.outputs.scopes,["read_products"]);
  assert.equal(receipt.outputs.apiVersion,"2026-10");
  assert.ok(!JSON.stringify(receipt).includes("do-not-expose"));
  assert.ok(!JSON.stringify(receipt).includes("never execute"));
  await assert.rejects(readFile(path.join(root,".shopify-app-builder","project.json")));
});

test("doctor reports conflicts, malformed metadata and missing checks without a false readiness claim", async () => {
  const root = await temp();
  await writeFile(path.join(root,"package.json"), JSON.stringify({dependencies:{"@shopify/shopify-app-react-router":"1","@shopify/shopify-app-remix":"1"}}));
  let result = await invoke(["doctor","--project",root]);
  assert.equal(result.receipt.state,"partial");
  assert.ok(result.receipt.outputs.findings.some(f=>f.code==="FRAMEWORK_AMBIGUOUS"));
  await writeFile(path.join(root,"package.json"),"bad JSON with private details");
  result = await invoke(["doctor","--project",root]);
  assert.equal(result.receipt.state,"partial");
  assert.ok(result.receipt.outputs.findings.some(f=>f.code==="PACKAGE_INVALID"));
  assert.ok(!result.stdout.includes("private details"));
});

test("errors distinguish uninitialized state, unsupported schema, corrupt JSON, conflict and busy writer", async () => {
  const root = await temp();
  assert.equal((await invoke(["status","--project",root])).receipt.error.code,"STATE_NOT_INITIALIZED");
  const init = await invoke(["init","--project",root]);
  assert.equal(init.receipt.ok,true);
  assert.match(init.receipt.runId,/^[a-f0-9-]{36}$/);
  assert.equal(init.receipt.verificationLevel,"recorded-context");
  assert.equal(init.receipt.appExecution,"not-performed");
  assert.equal((await invoke(["init","--project",root])).receipt.error.code,"STATE_CONFLICT");
  const file=path.join(root,".shopify-app-builder","project.json");
  const original=await readFile(file,"utf8");
  await mkdir(path.join(root,".shopify-app-builder","write.lock"));
  assert.equal((await invoke(["feedback","--project",root,"--target","plugin","--category","ux","--summary","Clear recovery"])).receipt.error.code,"STATE_BUSY");
  assert.equal(await readFile(file,"utf8"),original);
  await writeFile(file,'{"schemaVersion":999}');
  assert.equal((await invoke(["status","--project",root])).receipt.error.code,"STATE_UNSUPPORTED_VERSION");
  assert.equal(await readFile(file,"utf8"),'{"schemaVersion":999}');
  await writeFile(file,"invalid JSON");
  assert.equal((await invoke(["status","--project",root])).receipt.error.code,"STATE_INVALID_JSON");
});

test("handoff preserves merchant goal, blockers and evidence without declaring app completion or granting authority", async () => {
  const root=await temp();
  await invoke(["init","--project",root,"--problem","Alert merchants about low stock"]);
  const file=path.join(root,".shopify-app-builder","project.json");
  const state=JSON.parse(await readFile(file,"utf8"));
  state.profile.framework="React Router";
  state.milestones.push({id:"alerts",title:"Tenant-isolated alerts",status:"blocked",blockedReason:"Need a two-shop isolation test",evidence:[{kind:"local-test",summary:"UI fixture passed",source:"tests/ui.test.mjs",observedAt:state.updatedAt}]});
  await writeFile(file,JSON.stringify(state));
  const result=await invoke(["handoff","--project",root]);
  assert.equal(result.receipt.outputs.goal,state.profile.problem);
  assert.equal(result.receipt.outputs.next.kind,"diagnose");
  assert.equal(result.receipt.outputs.evidence[0].kind,"local-test");
  assert.equal(result.receipt.outputs.authority,"current-session-only");
  assert.deepEqual(result.receipt.outputs.coverage.evidence,{total:1,returned:1,omitted:0});
  assert.equal(result.receipt.outputs.appExecution,"not-performed");
  assert.equal((await readFile(file,"utf8")),JSON.stringify(state));
});

test("handoff reports truncation and retains sourced fact identities instead of implying full coverage", async()=>{
  const {newProject,projectHandoff}=await import("../skills/shopify-project-copilot/scripts/project.mjs");
  const state=newProject({problem:"Keep shop alerts isolated"});
  for(let i=0;i<12;i++)state.facts.push({id:`fact-${i}`,key:"API observation",value:"2026-10",status:"confirmed",source:"shopify.app.toml",verifiedAt:state.updatedAt});
  const handoff=projectHandoff(state);
  assert.equal(handoff.facts.length,10);
  assert.deepEqual(handoff.coverage.facts,{total:12,returned:10,omitted:2});
  assert.equal(handoff.facts[0].id,"fact-2");
  assert.equal(handoff.facts[0].source,"shopify.app.toml");
});

test("unknown arguments and unsafe paths produce safe JSON; doctor refuses symlinked input",async()=>{
  assert.equal((await invoke(["deploy"])).receipt.error.code,"INVALID_ARGUMENT");
  const unknown = await invoke(["private-input-do-not-echo"]);
  assert.equal(unknown.receipt.operation,"unknown");
  assert.ok(!unknown.stdout.includes("private-input"));
  const root=await temp(); const other=await temp();
  await writeFile(path.join(other,"package.json"),'{}');
  await symlink(path.join(other,"package.json"),path.join(root,"package.json"));
  const result=await invoke(["doctor","--project",root]);
  assert.equal(result.receipt.outputs.findings[0].code,"UNSAFE_PATH");
  assert.equal(result.receipt.state,"partial");
});

test("known report partial completion keeps its artifact identity without raw I/O errors", async () => {
  const {ProjectError,failureReceipt}=await import("../skills/shopify-project-copilot/scripts/contract.mjs");
  const result=failureReceipt("report","fixture-run",new ProjectError("REPORT_PARTIAL","Markdown saved; HTML completion is unconfirmed.","Inspect both report files before retrying."));
  assert.equal(result.ok,false);
  assert.equal(result.state,"partial");
  assert.equal(result.outputs.markdown,".shopify-app-builder/reports/latest.md");
  assert.equal(result.outputs.html,"unconfirmed");
});

test("filesystem error classification never emits raw diagnostics or claims safe external replay",async()=>{
  const {safeFailure}=await import("../skills/shopify-project-copilot/scripts/contract.mjs");
  for(const [raw,code] of [["EACCES","ACCESS_DENIED"],["EPERM","ACCESS_DENIED"],["ENOSPC","STORAGE_FULL"],["surprise","FILE_OPERATION_FAILED"]]){
    const error=safeFailure({code:raw,message:"private credentials and paths"});
    assert.equal(error.code,code); assert.ok(!JSON.stringify(error).includes("private credentials"));
  }
});
