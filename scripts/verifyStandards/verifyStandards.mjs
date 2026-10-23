#!/usr/bin/env node
// Checks a project against the Activatus Code Standards, and against
// the exceptions it has recorded in docs/development/coding-standards.md.
// It reports; it never changes a file.
//
// Run it from the project root:
//   node node_modules/@activatus/code-standards/scripts/verifyStandards/verifyStandards.mjs
//
// A finding for a standard the project has recorded as skipped or
// changed is listed as a recorded exception, to check by hand, and does
// not fail the run.
import { formatReport } from "./formatReport.mjs";
import { runChecks } from "./runChecks.mjs";

const projectDirectory = process.cwd();
const result = runChecks({ projectDirectory });

console.log(formatReport({ result, projectDirectory }));

if (result.failures.length > 0) {
	process.exitCode = 1;
}
