---
name: lint
description: Run all linters in check-only mode and report issues
argument-hint: "[path]"
allowed-tools: Read, Glob, Grep, Bash(pnpm lint:*)
---

Run every configured linter and report the issues. Do NOT modify any files.

1. Read `package.json` and find the lint scripts (`lint`, and `lint:css` if it exists).
2. Run each one in check-only mode:
   - ESLint: `pnpm lint $ARGUMENTS`
   - Stylelint, only if the `lint:css` script exists: `pnpm lint:css`
3. Report the findings grouped by file. For each issue give the line, the rule name and the message.
4. Finish with a one-line total: the number of errors and warnings, and how many are auto-fixable.

If `package.json` has no `lint` script, stop and say so. Do NOT fall back to running `eslint` directly.

Do NOT fix anything, even issues that are auto-fixable — `/lintFix` does that.
Do NOT lint or report on files in `node_modules/` or `vendor/`. Third-party code is exempt from the standards.
Do NOT stage, commit or push.
