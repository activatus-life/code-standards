---
sidebar_position: 3
---

# Migrating an Existing Project

Moving an established codebase onto the standards is done in stages, so each change stays small enough to check properly. This is the order that worked on a real 600-file project.

**Already following the standards, and just updating to a newer version?** You don't need this guide. Read the [Version History](/docs/version-history) from your project's version onward, and do only what it lists.

**Agree the standards first.** Print the list in [Setup, step 3](/docs/Guides/setup#3-agree-the-standards), and ask the [step 4](/docs/Guides/setup#4-working-with-the-agent) questions. Skip any stage for a standard the person turned down.

## The stages

| Stage | What                                                                   | Setup standard | Why this order                                            |
| ----- | ---------------------------------------------------------------------- | -------------- | --------------------------------------------------------- |
| 0     | [Regression check](#stage-0--regression-check)                         | —              | Every later stage is measured against it                  |
| 1     | [Formatting](#stage-1--formatting)                                     | 7, 9, 10       | The reformat touches every file, so it goes first, alone  |
| 2     | [ESLint](#stage-2--eslint)                                             | 6              | Fix the code, never the rules                             |
| 3     | [Names](#stage-3--names)                                               | 1              | The lint errors show most of the names to change          |
| 4     | [Constants](#stage-4--constants)                                       | 12.1           | Components move next, and will import these               |
| 5     | [Components](#stage-5--components)                                     | 12, 13, 14     | Pure moves first, then shared code, which needs the paths |
| 6     | [Docs](#stage-6--docs)                                                 | 18             | The mechanical copy first, then the rewrite               |
| 7     | [AGENTS.md, skills and version](#stage-7--agentsmd-skills-and-version) | 21             | Describes the final layout, so it goes last               |

## How to work through the stages

- **One branch per stage, stacked.** Each stage branches from the one before it. Stop after each stage for the person to review and commit. This is what keeps a large migration reviewable.
- **Each stage changes one kind of thing.** A stage that moves files does not also change what they do.
- **Run `pnpm lint`, `pnpm format:check`, the tests and the build at the end of every stage**, and the regression check from Stage 0 if the project has one.
- **Record anything left for later** under "Unfinished changes" in `docs/development/coding-standards.md`. See [Finishing a change later](/docs/Guides/setup#finishing-a-change-later).

:::warning[Squash merges lose the reformat commit]

If the project squash-merges pull requests, the reformat commit's hash disappears from `main` when the stack is merged, and `.git-blame-ignore-revs` stops working. Decide before starting:

- **Land Stages 0 and 1 on `main` by themselves first**, with a merge that keeps the commits, so the reformat survives as its own commit. Then stack the rest on top. Recommended.
- **Or accept losing blame-ignore**, and squash everything.

:::

## Before you start: third-party code is exempt

The standards apply to **code we write**, not to packages we pull in. Do not lint, reformat, rename or restructure third-party code — see [Third-party code is exempt](/docs/Standards/eslint#third-party-code-is-exempt).

- `node_modules/` is ignored automatically.
- Third-party code copied into the repo belongs in a `vendor/` folder, which the configs ignore.
- Add `vendor/` to `.prettierignore` too.
- **shadcn components are not third-party.** They are our code: convert them to the standards rather than moving them to `vendor/`. See [Adding a shadcn component](/docs/Guides/component-library-workflow#adding-a-shadcn-component).

## Stage 0 — Regression check

Optional, and recommended when Stages 4 to 6 will move a lot of code. Set up the [regression check](/docs/Guides/regression-checks) and take its baseline from the **live production site**, before anything changes. Every later stage must pass it unchanged.

**Take the baseline first, then move one kind of thing at a time.** The constants moves (Stage 4) and the folder moves (Stage 5a) are separate steps, each followed by a full regression run. When a run fails, only one kind of move can have caused it.

## Stage 1 — Formatting

Applies setup standards 7, 9 and 10. Three commits, in this order:

1. **The config files.** Rename every config to `.mjs` ([why](/docs/Guides/setup#5-apply-the-standards)). Add `prettier.config.mjs` from the [Prettier page](/docs/Standards/prettier), with its `format` and `format:check` scripts, `.editorconfig`, `.nvmrc` and `.envrc`. Do not reformat anything yet.

   ```bash
   pnpm add -D prettier prettier-plugin-tailwindcss
   ```

2. **The reformat, on its own.** Run `pnpm format` and commit the result with nothing else in it. Every file changes, and none of it changes behaviour.
3. **`.git-blame-ignore-revs`.** Create it with the reformat commit's full hash and a comment saying what it was. GitHub reads it automatically. For local `git blame`, each person runs once:

   ```bash
   git config blame.ignoreRevsFile .git-blame-ignore-revs
   ```

Add a `.prettierignore` for generated files and anything Prettier must not format. See [What Prettier skips](/docs/Standards/prettier#what-prettier-skips).

## Stage 2 — ESLint

Applies setup standard 6.

Copy the [standard config](/docs/Standards/eslint) for the project's framework to `eslint.config.mjs`, unchanged, and `eslint.overrides.mjs` beside it. To see the size of the job first, turn the noisiest rules down to warnings **in `eslint.overrides.mjs`**, never in `eslint.config.mjs`:

```js title="eslint.overrides.mjs"
// Temporary, while migrating: see Unfinished changes in
// docs/development/coding-standards.md.
export const projectOverrides = [
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "warn",
			"unicorn/filename-case": "warn",
			"unicorn/name-replacements": "warn",
		},
	},
];
```

Record the temporary warnings under "Unfinished changes". Run `pnpm lint`, and fix one kind of error at a time, such as every `any`. **Fix the code, not the rules.** When the warnings are gone, empty `eslint.overrides.mjs` again.

## Stage 3 — Names

Applies setup standard 1. Its own branch, after ESLint: the lint errors show most of the names to change.

Renaming is the biggest job in most migrations, and the easiest place to get confused. Every name we write becomes [Human-Readable Names](/docs/Standards/human-readable-names). Work through it in this order.

### 1. Decide what stays

Before renaming anything, sort the short names into three piles:

| Pile                                                                                                                   | What to do                | Where to check                                                                 |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| **A dictionary word** — `id`, `docs`, `app`, `url`, `api`                                                              | Leave it                  | [Dictionary](/docs/Standards/human-readable-names#dictionary)                  |
| **A third-party name** — React's `ref`, Next.js's `params`, shadcn/ui's `cn`, Linear's `pageInfo`, Node's `cwd` option | Leave it exactly as it is | [Third-party names](/docs/Standards/human-readable-names#third-party-names)    |
| **Our own shorthand** — `btn`, `lib/`, `helpers/`, `utilities/`                                                        | Rename it                 | The [Never / Always](/docs/Standards/human-readable-names#never--always) table |

**Not sure which pile?** Don't guess and don't rename it. Ask, and if it is a dictionary word, [add it to the dictionary](/docs/Standards/human-readable-names#adding-a-word-to-the-dictionary) first. Everyone then makes the same call.

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

### 3. Rename in this order

1. **Folders**, with `git mv` so the history follows the files. Fix the imports at the same time.
2. **Types**, so the `@typescript-eslint/naming-convention` errors clear.
3. **Variables, functions and properties.** Use your editor's **Rename Symbol** (F2), not find-and-replace: it renames every use and nothing else. An agent working from the command line has no editor, so it uses the [rename script](#renaming-from-the-command-line) instead.
4. **Everything the linter can't see** — form fields, union values, routes, scripts, environment variables. Search for each one by hand.

### 4. Names that leave the codebase

Some names are used outside the code. Renaming them needs more than a code change:

- **Database columns** need a migration.
- **Environment variables** must be renamed in every `.env.local` and in Vercel's settings too, or the app gets an empty value.
- **API routes and request fields** used by another app need both names to work until that app is updated.
- **Routes people have bookmarked** need a redirect from the old path.

Tell the person about each of these, so nobody gets caught out.

### Renaming from the command line

An AI agent working in a terminal has no editor, so it cannot press F2. The package ships a script that does the same job, using the project's own TypeScript and the same rename engine as the editor:

```bash
node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs <file> <currentName> <newName>
```

```bash
# Rename a type everywhere it is used
node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs components/ui/button/types.ts ButtonProperties ButtonProps
```

**Many renames at once:** list them in a text file, one per line, and pass it with `--list`. Blank lines and lines starting with `#` are skipped, and the renames run in order:

```text title="renames.txt"
# Version 3 renames
components/ui/button/types.ts ButtonProperties ButtonProps
lib/terminal/tabs.ts surfaceReference surfaceRef
```

```bash
node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs --list renames.txt
```

- **Give it the file where the name is declared.** It renames that symbol and every use of it, across the whole project, and leaves anything else with the same name alone.
- **Shorthand stays correct.** `{ properties }` becomes `{ properties: props }`, so objects keep their shape.
- **It only renames TypeScript and JavaScript names.** Folders, files, form fields, routes and environment variables still need renaming by hand.
- **It cannot reach keys in plain object literals that aren't typed**, such as the expected value in a test's `toEqual({ properties: … })`. Search the tests for the old name and fix those keys by hand.
- **Run the type check and tests after each batch** of renames.

## Stage 4 — Constants

Applies setup standard 12.1. Move every link into `r`, every piece of text into `s`, every loose number into `numbers.ts`, motion into `animation.ts`, drawing layouts into `artwork.ts`, and class names shared between files into `classNames.ts`, all in `lib/constants/`. See [Constants](/docs/Structure/folder-structure#constants).

- **Move the values, nothing else.** The page must look and work exactly as before.
- **No component-level `constants.ts` survives this stage.**
- **Move animation and artwork objects whole.** Never pull their numbers out into `numbers.ts`. Any other file in `lib/constants/` is folded into the standard file that fits.
- **Where each value goes is the project's call.** Read the [Constants table](/docs/Structure/folder-structure#constants) and decide. Record any value that fits none under "Details" in `coding-standards.md`, with the person's yes.
- **An id moves into the object that uses it.** **CSS written as a string moves to `globals.css`**, never into a constants file.
- **A list of items with links** keeps its words in `s` and its links in `r` under the same keys, and a loop looks each one up by its key: see [the example](/docs/Structure/folder-structure#a-list-of-items-with-links). Delete any separate lookup object that maps a key to its link.
- **Shared types move to `lib/types/`.** `lib/constants/` never imports from `lib/types/`.

## Stage 5 — Components

Applies setup standards 12, 13 and 14. Two branches:

1. **5a: move the component folders, and nothing else.** Use `git mv` so the history follows, and rewrite the import paths. No code inside a file changes. Pure moves are quick to review. Follow [Where components live](/docs/Structure/folder-structure#-where-components-live): the homepage in `app/(homepage)/`, the site frame in `components/layout/`, and no `components/features/`.
2. **5b: move the code several components share** to its standard home, now that the final paths are known: a shared component up one level, a hook beside the component that owns it, and sort, find, get, filter and format functions into `utils/`. Sub-components sit flat in their parent's `components/` folder.

## Stage 6 — Docs

Applies setup standard 18. Two branches:

1. **6a: the mechanical part.** Copy the [doc templates](/docs/templates#document-templates) and the [`docsSite/` viewer](/docs/Standards/documentation#-setting-it-up), move images into `docs/assets/`, and delete the old viewer's leftovers.
2. **6b: rewrite the content as Decision Docs.** This is the part that needs judgement, so it is reviewed on its own. Follow [Converting existing docs](/docs/Standards/documentation#-converting-existing-docs).

**Keep every docs folder and file from the templates, even ones that do not apply yet.** This rule is final: no docs folder is deleted, whatever the size of the project. See [Setting it up](/docs/Standards/documentation#-setting-it-up).

## Stage 7 — AGENTS.md, skills and version

Applies setup standard 21.

1. Copy the [AGENTS.md template](/docs/templates#agents) to the project root and replace every `[placeholder]`. It describes the final layout, so it goes last.
2. Copy the eight [standard skill files](/docs/templates#skills) into `.agents/skills/`, and again into `.claude/commands/`.
3. Set `**Code standards version:**` to the installed package's full version, such as `3.2.2`.
4. Run the [standards check](/docs/Guides/setup#checking-a-project), and fix what it finds.

## Tips

- **Don't mix formatting and logic changes.** Reformat on its own, then change the code.
- **Generated files** are ignored with an entry in `eslint.overrides.mjs`, such as `{ ignores: ["generated/**"] }`, and a line in `.prettierignore`. Record the reason in `coding-standards.md`.
- **New files follow the full standards from day one**, even before the migration is finished.
