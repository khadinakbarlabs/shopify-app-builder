import {lstat,readFile,realpath} from "node:fs/promises";
import path from "node:path";
import {ProjectError,safeFailure} from "./contract.mjs";

export async function projectRoot(root) {
  let resolved;
  try { resolved=await realpath(root); }
  catch(error) {
    if(error.code==="ENOENT") throw new ProjectError("PROJECT_NOT_FOUND","The selected app folder does not exist.","Select an existing app folder or explicitly request app scaffolding. The context helper does not create app folders.");
    if(error.code==="ENOTDIR") throw new ProjectError("PROJECT_NOT_DIRECTORY","The selected app path is not a folder.","Select an existing app folder, not a file.");
    throw error;
  }
  if(!(await lstat(resolved)).isDirectory()) throw new ProjectError("PROJECT_NOT_DIRECTORY","The selected app path is not a folder.","Select an existing app folder, not a file.");
  return resolved;
}
async function selectedFile(root,name) {
  const file=path.join(root,name);
  let stat;
  try { stat=await lstat(file); } catch(error) {if(error.code==="ENOENT")return null; throw error;}
  if(stat.isSymbolicLink()||!stat.isFile()) throw new ProjectError("UNSAFE_PATH","A selected metadata path is not a regular contained file.","Inspect the selected metadata path; do not follow a symlink to unrelated files.");
  if(stat.size>256*1024) throw new ProjectError("INPUT_TOO_LARGE","Selected metadata exceeds 256 KiB.","Inspect the metadata manually or supply a smaller reviewed fixture.");
  const text=await readFile(file,"utf8");
  if(Buffer.byteLength(text)>256*1024) throw new ProjectError("INPUT_TOO_LARGE","Selected metadata exceeds 256 KiB.","Inspect the metadata manually.");
  return text;
}

// No recursive scan, package scripts, credential files, CLI execution or network.
export async function inspectProject(root) {
  const resolved=await projectRoot(root);
  const result={runtime:{name:"node",version:process.versions.node},sources:[],frameworks:[],availableChecks:[],scopes:[],apiVersion:"",findings:[],appExecution:"not-performed"};
  const observe=async(name,operation)=>{
    try {const text=await selectedFile(resolved,name); if(text!==null){result.sources.push({path:name,observedAt:new Date().toISOString()}); operation(text);}}
    catch(error){result.findings.push(safeFailure(error));}
  };
  await observe("package.json",text=>{
    let pkg;
    try{pkg=JSON.parse(text);}catch{throw new ProjectError("PACKAGE_INVALID","Selected package.json is invalid JSON.","Preserve it and repair a reviewed copy before running project commands.");}
    if(!pkg||typeof pkg!=="object"||Array.isArray(pkg)) throw new ProjectError("PACKAGE_INVALID","Selected package.json must be an object.","Inspect the selected package metadata.");
    const deps={...pkg.dependencies,...pkg.devDependencies};
    const known={"@shopify/shopify-app-react-router":"React Router","@shopify/shopify-app-remix":"Remix","@shopify/shopify-app-express":"Express","@shopify/hydrogen":"Hydrogen"};
    result.frameworks=Object.keys(known).filter(key=>Object.hasOwn(deps,key)).map(key=>known[key]);
    result.availableChecks=["test","lint","typecheck","build"].filter(key=>pkg.scripts&&typeof pkg.scripts[key]==="string");
  });
  await observe("shopify.app.toml",text=>{
    const scopes=text.match(/^\s*scopes\s*=\s*"([a-z_,\s]{0,1000})"\s*(?:#.*)?$/m)?.[1];
    if(scopes) result.scopes=[...new Set(scopes.split(",").map(s=>s.trim()).filter(s=>/^[a-z_]+$/.test(s)))].slice(0,50);
    const versions=[...new Set([...text.matchAll(/^\s*api_version\s*=\s*"(\d{4}-(?:01|04|07|10))"\s*(?:#.*)?$/gm)].map(m=>m[1]))];
    if(versions.length===1) result.apiVersion=versions[0];
    if(versions.length>1) result.findings.push({code:"API_VERSION_AMBIGUOUS",message:"App metadata contains different API versions.",recovery:"Inspect the relevant extension/webhook/API configuration before choosing a version."});
  });
  if(result.frameworks.length>1)result.findings.push({code:"FRAMEWORK_AMBIGUOUS",message:"Multiple Shopify app frameworks are declared.",recovery:"Inspect the actual routes and imports; preserve the established framework rather than migrating automatically."});
  if(!result.frameworks.length)result.findings.push({code:"FRAMEWORK_UNCONFIRMED",message:"No known Shopify app framework was confirmed in selected metadata.",recovery:"Inspect relevant app files; custom or theme projects may not use one of these packages. Do not scaffold or migrate automatically."});
  if(!result.availableChecks.length)result.findings.push({code:"CHECKS_UNCONFIRMED",message:"No test, lint, typecheck or build script was confirmed.",recovery:"Inspect the project's documented checks before choosing a command. Missing checks are not evidence of failure or readiness."});
  return result;
}
