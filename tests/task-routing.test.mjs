import assert from "node:assert/strict";
import {readFile,readdir} from "node:fs/promises";
import test from "node:test";

test("router retains focused intent routes and read-only review boundaries", async()=>{
  const text=await readFile("skills/using-shopify-app-builder/SKILL.md","utf8");
  for(const intent of ["Build","Fix","Audit","Improve","Import","Review","Release","Resume"]) assert.match(text,new RegExp(`\\| ${intent} \\|`));
  assert.match(text,/Do not implement unless requested/);
  assert.match(text,/not shopping advice or unrelated app development/);
  assert.match(text,/before questions/);
});

test("merchant acceptance guide includes isolation and failure behavior, not only records", async()=>{
  const text=await readFile("skills/using-shopify-app-builder/references/first-merchant-value.md","utf8");
  for(const signal of [/two-shop/,/authenticated request/,/loading, empty, success and failure/,/failed save does not show success/,/separate gate/]) assert.match(text,signal);
  const command=await readFile("commands/start-shopify-app.md","utf8");
  assert.match(command,/implement the first merchant feature/);
});

test("copilot advertises contained doctor/handoff, manual fallback and truthful execution", async()=>{
  const text=await readFile("skills/shopify-project-copilot/SKILL.md","utf8");
  for(const signal of [/project\.mjs doctor/,/project\.mjs handoff/,/continue manually/,/runs no package\/Shopify CLI commands/,/status\/report/]) assert.match(text,signal);
  const contract=await readFile("skills/shopify-project-copilot/references/execution.md","utf8");
  assert.match(contract,/not permission to replay/);
  assert.match(contract,/REPORT_PARTIAL/);
});

test("eight native cases contain graders and bounded runs without write/network grants",async()=>{
  const cases=(await readdir("evals",{withFileTypes:true})).filter(e=>e.isDirectory()&&e.name!=="results");
  assert.equal(cases.length,8);
  for(const item of cases){
    const prompt=await readFile(`evals/${item.name}/prompt.md`,"utf8");
    assert.match(prompt,/runs: 1/);
    assert.match(prompt,/timeout_seconds: 180/);
    assert.match(prompt,/allowed_tools: \[Read, Glob, Grep, Skill\]/);
    assert.ok((await readdir(`evals/${item.name}/graders`)).length>=2);
  }
});
