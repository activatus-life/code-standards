---
name: format
description: Format files with Prettier and report what changed
argument-hint: "[path]"
allowed-tools: Read, Glob, Bash(pnpm format:*), Bash(git status:*)
---

Format the project with Prettier and report which files changed.

1. Read `package.json` and confirm a `format` script exists.
2. Run `pnpm format $ARGUMENTS`.
3. Run `git status --short` to see which files changed.
4. Report the reformatted files. If nothing changed, say the project was already formatted.

If `package.json` has no `format` script, stop and say so.

Do NOT change files in `node_modules/` or `vendor/`.
Do NOT stage, commit or push. Leave every change uncommitted.
