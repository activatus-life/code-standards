---
name: lintFix
description: Auto-fix lint and formatting issues, then report
argument-hint: "[path]"
allowed-tools: Read, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm format:*), Bash(git status:*), Bash(git diff:*)
---

Run every linter in fix mode, then the formatter, and report what changed.

1. Read `package.json` and find the scripts that exist: `lint:fix`, `lint:css:fix` and `format`.
2. Run them in this order, skipping any that do not exist:
   - ESLint: `pnpm lint:fix $ARGUMENTS`
   - Stylelint: `pnpm lint:css:fix`
   - Prettier: `pnpm format`
3. Run `git status --short` and `git diff --stat` to see which files changed.
4. Report:
   - The files that were changed
   - The issues that remain and could not be fixed automatically, grouped by file

If none of the three scripts exist, stop and say so.

Do NOT fix the remaining issues by hand. Report them and leave them for the person.
Do NOT change files in `node_modules/` or `vendor/`. Third-party code is exempt from the standards.
Do NOT stage, commit or push. Leave every change uncommitted.
