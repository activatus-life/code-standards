---
name: typescript
description: Tighten loose types and remove unsafe assertions
argument-hint: "[path]"
allowed-tools: Read, Glob, Grep, Edit, Bash(pnpm typecheck:*), Bash(pnpm lint:*)
---

Replace loose types with precise ones in the given files.

1. Work out the scope: `$ARGUMENTS` if given. If it is empty, stop and ask which file or folder to work on.
2. Find every loose type in scope:
   - `any`, written or implied
   - Non-null assertions (`value!`)
   - Type casts (`value as SomeType`), except `as const`
3. Fix each one:
   - Replace `any` with the real type, or with `unknown` narrowed by a check
   - Replace `value!` with a check that the value exists
   - Replace a cast with validation or a properly typed source
4. Follow the naming rule for every type you add or rename: the name ends in `Props` (the object parameter of a component or function) or `Type` (everything else).
5. Run `pnpm typecheck`, then `pnpm lint`. Fix any errors your changes caused.
6. Report each change: the file, what the type was, and what it is now. List anything you could not tighten, and why.

If `package.json` has no `typecheck` script, say so and skip that check. Do NOT run `tsc` directly.

Do NOT silence an error with `any`, `!`, `as`, `@ts-ignore` or `@ts-expect-error`.
Do NOT change what the code does. Change types only.
Do NOT edit files in `node_modules/` or `vendor/`.
Do NOT stage, commit or push. Leave every change uncommitted.
