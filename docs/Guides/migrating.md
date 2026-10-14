---
sidebar_position: 3
---

# Migrating an Existing Project

Migrating an established codebase to the shared standards is best done in stages to keep PRs reviewable.

## Before you start: third-party code is exempt

The standards apply to **code we write**, not to packages we pull in. Do not lint, reformat, rename or restructure third-party code — see [Third-party code is exempt](/Standards/eslint#third-party-code-is-exempt).

- `node_modules/` is ignored automatically.
- Third-party code copied into the repo belongs in a `vendor/` folder, which the configs ignore.
- Add `vendor/` to `.prettierignore` too.
- **shadcn components are not third-party.** They are our code: convert them to the standards rather than moving them to `vendor/`. See [Adding a shadcn component](/Guides/component-library-workflow#adding-a-shadcn-component).

## Stage 1 — Prettier (formatting only)

Formatting changes are safe to land in one big PR because they don't change behaviour.

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
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
vendor/
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

## Stage 5 — Agent skills

Copy the eight [standard skill files](/templates#skills) into `.agents/skills/`, and again into `.claude/commands/`.

## Stage 6 — Docs

Move the project's existing documentation into the standard [`docs/` folders](/Standards/documentation#-the-folders), rewriting each as a [Decision Doc](/Standards/documentation#-the-doc-format), then add the [`docsSite/` viewer](/Standards/documentation#-setting-it-up) so it shows at `/docs`.

## Stage 7 — Commit message checks

Add Commitlint and the two Husky hooks: one checks the commit message, the other runs `pnpm lint` before every commit. Add the lint hook **last**, once the project passes `pnpm lint`. See [Enforcing commit messages](/Standards/conventional-commits#enforcing-commit-messages).

## Tips

- **Don't mix formatting and logic changes** in the same PR.
- **Exclude generated files** from ESLint with `// eslint-disable-file` or `.eslintignore`-equivalent glob ignores in the config.
- **Fix new-file compliance first**: agree that all *new* files must pass the full ruleset even before the migration is complete.
