---
sidebar_position: 3
---

# Migrating an Existing Project

Migrating an established codebase to the shared standards is best done in stages to keep PRs reviewable.

## Stage 1 — Prettier (formatting only)

Formatting changes are safe to land in one big PR because they don't change behaviour.

```bash
pnpm add -D prettier
```

Add `prettier.config.js` — see the [Prettier page](/Standards/prettier) for the full file contents.

Format everything at once:

```bash
pnpm prettier --write .
```

Commit with message `chore: apply prettier formatting`. This keeps the formatting diff isolated, making future `git blame` useful.

Add a `.prettierignore` if you have generated files you don't want touched:

```text
dist/
build/
coverage/
*.generated.ts
```

## Stage 2 — EditorConfig

Add the `.editorconfig` file. No code changes needed — your editor will handle it on next save.

## Stage 3 — ESLint

Add the [standard config](/Standards/eslint) for your project type, then start in warn-only mode to see what you're dealing with. Add a block before `prettier`:

```js
export default [
  // ...
  {
    rules: {
      // temporarily downgrade errors to warnings during migration
      "@typescript-eslint/no-explicit-any": "warn",
      "unicorn/filename-case": "warn",
    },
  },
  prettier,
];
```

Run `pnpm lint` and triage the output. Fix issues in thematic PRs (e.g. all `any` removals together). Once clean, remove the overrides.

## Stage 4 — AGENTS.md

Copy the [AGENTS.md template](/templates#agents) to the project root and replace every `[placeholder]`.

## Tips

- **Don't mix formatting and logic changes** in the same PR.
- **Exclude generated files** from ESLint with `// eslint-disable-file` or `.eslintignore`-equivalent glob ignores in the config.
- **Fix new-file compliance first**: agree that all *new* files must pass the full ruleset even before the migration is complete.
