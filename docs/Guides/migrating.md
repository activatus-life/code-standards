---
sidebar_position: 3
---

# Migrating an Existing Project

Migrating an established codebase to the shared standards is best done in stages to keep PRs reviewable.

**Already following the standards, and just updating to a newer version?** You don't need this whole guide. Read the [Version History](/version-history) from your project's version onward, and do only what it lists.

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

Add `prettier.config.mjs` — see the [Prettier page](/Standards/prettier) for the full file contents.

Format everything at once:

```bash
pnpm prettier --write .
```

Commit it on its own, following the project's commit message format. This keeps the formatting diff isolated, making future `git blame` useful.

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
      "unicorn/name-replacements": "warn",
    },
  },
  prettier,
];
```

Run `pnpm lint` and triage the output. Fix issues in thematic PRs (e.g. all `any` removals together). Once clean, remove the overrides.

## Stage 4 — Names

Renaming is the biggest job in most migrations, and the easiest place to get confused. Every name we write becomes [Human-Readable Names](/Standards/human-readable-names). Work through it in this order.

### 1. Decide what stays

Before renaming anything, sort the short names into three piles:

| Pile                                                                                                                   | What to do                | Where to check                                                            |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| **A dictionary word** — `id`, `docs`, `app`, `url`, `api`                                                              | Leave it                  | [Dictionary](/Standards/human-readable-names#dictionary)                  |
| **A third-party name** — React's `ref`, Next.js's `params`, shadcn/ui's `cn`, Linear's `pageInfo`, Node's `cwd` option | Leave it exactly as it is | [Third-party names](/Standards/human-readable-names#third-party-names)    |
| **Our own shorthand** — `btn`, `lib/`, `helpers/`, `utilities/`                                                        | Rename it                 | The [Never / Always](/Standards/human-readable-names#never--always) table |

**Not sure which pile?** Don't guess and don't rename it. Ask, and if it is a dictionary word, [add it to the dictionary](/Standards/human-readable-names#adding-a-word-to-the-dictionary) first. Everyone then makes the same call.

### 2. The common renames

These come up in nearly every project:

| Before                                 | After                                        |
| -------------------------------------- | -------------------------------------------- |
| `utilities/`, `helpers/`, `helpers.ts` | `utils/`, or a file named after what it does |
| `ButtonProperties`, `properties`       | `ButtonProps`, `props`                       |
| `MAX_`, `MIN_`                         | `MAXIMUM_`, `MINIMUM_`                       |
| `"sm" \| "md" \| "lg"`                 | `"small" \| "medium" \| "large"`             |
| `auth`, `useAuth`                      | `authentication`, `useAuthentication`        |
| `(e) =>`, `(i) =>`                     | `(event) =>`, `(index) =>`                   |

`docs/`, `docsSite/`, `DOCS_URL` and `pnpm docs:dev` already follow the standard. Leave them.

### 3. Rename in this order, one pull request each

1. **Folders**, with `git mv` so the history follows the files. Fix the imports in the same pull request.
2. **Types**, so the `@typescript-eslint/naming-convention` errors clear.
3. **Variables, functions and properties.** Use your editor's **Rename Symbol** (F2), not find-and-replace: it renames every use and nothing else. An agent working from the command line has no editor, so it uses the [rename script](#renaming-from-the-command-line) instead.
4. **Everything the linter can't see** — form fields, union values, routes, scripts, environment variables. Search for each one by hand.

### 4. Names that leave the codebase

Some names are used outside the code. Renaming them needs more than a code change:

- **Database columns** need a migration.
- **Environment variables** must be renamed in every `.env.local` and in Vercel's settings too, or the app gets an empty value.
- **API routes and request fields** used by another app need both names to work until that app is updated.
- **Routes people have bookmarked** need a redirect from the old path.

Write each of these up in the pull request so nobody gets caught out.

### Renaming from the command line

An AI agent working in a terminal has no editor, so it cannot press F2. The package ships a script that does the same job, using the project's own TypeScript and the same rename engine as the editor:

```bash
node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs <file> <currentName> <newName>
```

```bash
# Rename a type everywhere it is used
node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs components/ui/button/types.ts ButtonProperties ButtonProps
```

- **Give it the file where the name is declared.** It renames that symbol and every use of it, across the whole project, and leaves anything else with the same name alone.
- **Shorthand stays correct.** `{ properties }` becomes `{ properties: props }`, so objects keep their shape.
- **It only renames TypeScript and JavaScript names.** Folders, files, form fields, routes and environment variables still need renaming by hand.
- **It cannot reach keys in plain object literals that aren't typed**, such as the expected value in a test's `toEqual({ properties: … })`. Search the tests for the old name and fix those keys by hand.
- **Run the type check and tests after each batch** of renames.

## Stage 5 — AGENTS.md

Copy the [AGENTS.md template](/templates#agents) to the project root and replace every `[placeholder]`. Agree the standards with the person first ([Setup, step 3](/Guides/setup#3-agree-the-standards)), and set the code standards version from the [Version History](/version-history).

## Stage 6 — Agent skills

Copy the eight [standard skill files](/templates#skills) into `.agents/skills/`, and again into `.claude/commands/`.

## Stage 7 — Docs

Move the project's existing documentation into the standard [`docs/` folders](/Standards/documentation#-the-folders), rewriting each as a [Decision Doc](/Standards/documentation#-the-doc-format), then add the [`docsSite/` viewer](/Standards/documentation#-setting-it-up) so it shows at `/docs`.

## Stage 8 — Lint before every commit

Add the Husky hook that runs `pnpm lint` before every commit. Add it **last**, once the project passes `pnpm lint`. See [Lint before every commit](/Standards/lint-errors#lint-before-every-commit).

## Tips

- **Don't mix formatting and logic changes** in the same PR.
- **Exclude generated files** from ESLint with `// eslint-disable-file` or `.eslintignore`-equivalent glob ignores in the config.
- **Fix new-file compliance first**: agree that all _new_ files must pass the full ruleset even before the migration is complete.
