---
name: test
description: Run the tests and report failures and missing tests
argument-hint: "[path]"
allowed-tools: Read, Glob, Grep, Bash(pnpm test:*)
---

Run the test suite and report the result. Do NOT modify any files.

1. Read `package.json` and confirm a `test` script exists.
2. Run `pnpm test $ARGUMENTS`.
3. Report the failures grouped by cause, not by file. Tests that fail for the same reason go under one heading. For each cause give the test names, the file and line, and what was expected against what happened.
4. Report separately any test that **never ran** — a file that failed to load, or a skipped test. A test that did not run has not passed.
5. Check for missing test files in scope. Every function and component needs a test file beside it:
   - `formatCurrency.ts` needs `formatCurrency.test.ts`
   - `Button.tsx` needs `Button.test.tsx`
   List every function and component file that has no test file. Ignore `index.ts`, `types.ts`, config files and Next.js route files.
6. Finish with a one-line total: passed, failed, never ran, and files missing a test.

If `package.json` has no `test` script, stop and say so.

Do NOT fix failing tests or the code they test. Report only.
Do NOT report on files in `node_modules/` or `vendor/`.
Do NOT stage, commit or push.
