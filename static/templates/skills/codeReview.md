---
name: codeReview
description: Review changes for bugs and standards compliance
argument-hint: "[branch, commit or path]"
allowed-tools: Read, Glob, Grep, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git merge-base:*)
---

Review the changes and report problems. Do NOT modify any files.

1. Work out what to review:
   - If `$ARGUMENTS` is a file or folder path, review those files.
   - If `$ARGUMENTS` is a branch or commit, review `git diff $ARGUMENTS...HEAD`.
   - If `$ARGUMENTS` is empty, review `git diff main...HEAD` plus the uncommitted changes from `git diff`.
2. Read `AGENTS.md` for the project's code standards.
3. Read every changed file in full, not only the changed lines.
4. Check each change for:
   - **Correctness** — logic errors, unhandled cases, broken error handling
   - **Security** — unvalidated input, secrets in code, missing permission checks
   - **Types** — `any`, non-null `!`, and `as` casts without a comment saying why
   - **Tests** — every new or changed function and component has a test file
   - **Readable code** — files over 300 lines, any name that is not human-readable (folders, files, props, form field `name`s and labels, types, union values, database columns, routes, environment variables and test names as well as variables), functions doing more than one thing, more than one parameter, nesting deeper than three levels, magic numbers
   - **Structure** — reusable functions outside a `utils/` folder, server and client code in one file, inline functions in render
   - **Styling** — hard-coded colours, CSS grid that was not asked for
5. Report the findings in order of severity: **Must fix**, **Should fix**, **Consider**. For each one give the file and line, what is wrong, and how to fix it.
6. Finish with a one-line verdict: ready to commit, or not.

If there are no changes to review, say so and stop.

Do NOT review files in `node_modules/` or `vendor/`. Third-party code is exempt from the standards.
Do NOT fix anything. Report only.
Do NOT stage, commit or push.
