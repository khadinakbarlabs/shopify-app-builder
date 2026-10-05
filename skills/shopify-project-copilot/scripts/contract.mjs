// CLI receipts describe local helper work, never Shopify app execution.
export const HELPER_VERSION = "2.1.1";
const operations = new Set(["doctor", "handoff", "init", "status", "update", "report", "feedback", "schedule"]);
const safeOperation = operation => operations.has(operation) ? operation : "unknown";
export class ProjectError extends Error {
  constructor(code, message, recovery) { super(message); this.code=code; this.recovery=recovery; }
}
const failures = {
  ACCESS_DENIED: ["Access to a selected local file was denied.", "Check the selected folder's permissions. Do not read credentials or broaden access automatically."],
  STORAGE_FULL: ["The local write could not complete because storage is full.", "Inspect the existing record and available storage before retrying. Preserve partial files."],
  FILE_OPERATION_FAILED: ["A local file operation did not complete.", "Inspect the selected record and any output files before retrying; no external action was attempted."],
};
export function safeFailure(error) {
  if (error instanceof ProjectError) return {code:error.code,message:error.message,recovery:error.recovery};
  const code = ["EACCES","EPERM"].includes(error?.code) ? "ACCESS_DENIED" : error?.code==="ENOSPC" ? "STORAGE_FULL" : "FILE_OPERATION_FAILED";
  return {code,message:failures[code][0],recovery:failures[code][1]};
}
export function receipt(operation,runId,outputs,{state="completed",verificationLevel="recorded-context",message="Local helper operation completed.",nextAction="Reconcile with current files and continue the user's actual task."}={}) {
  return {contractVersion:1,helper:{name:"shopify-project",version:HELPER_VERSION},operation:safeOperation(operation),runId,ok:true,state,capability:"local-only",verificationLevel,appExecution:"not-performed",externalOutcome:"not-attempted",message,outputs,continuation:{nextAction},...outputs};
}
export function failureReceipt(operation,runId,error) {
  const failure=safeFailure(error);
  const blocked=["PROJECT_NOT_FOUND","PROJECT_NOT_DIRECTORY","STATE_NOT_INITIALIZED","STATE_BUSY","STATE_CONFLICT","ACCESS_DENIED","RUNTIME_UNSUPPORTED"].includes(failure.code);
  const partial = failure.code === "REPORT_PARTIAL";
  return {contractVersion:1,helper:{name:"shopify-project",version:HELPER_VERSION},operation:safeOperation(operation),runId,ok:false,state:partial?"partial":blocked?"blocked":"failed",capability:"local-only",verificationLevel:partial?"recorded-context":"none",appExecution:"not-performed",externalOutcome:"not-attempted",outputs:partial?{markdown:".shopify-app-builder/reports/latest.md",html:"unconfirmed"}:{},error:failure,continuation:{nextAction:failure.recovery}};
}
