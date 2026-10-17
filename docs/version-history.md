---
sidebar_position: 1.6
sidebar_label: "Version History"
---

# Version History

> What changed in each version of the standards, and exactly what a project has to do about it. Written for the AI agent doing the update.

**Every change to the standards gets a new version number.** Each project records the version it follows in its `AGENTS.md`, under "Code standards":

```md
**Code standards version:** 2
```

## Updating a project to a new version

**Read only the versions newer than the project's.** A project on version 1 that is updating to version 3 reads version 2 and version 3 on this page, and nothing else. Do not re-read every standard or check the whole codebase: each version lists every change that matters, and how to find the code it affects.

1. **Find the project's version** in its `AGENTS.md`. If there is none, the project has never followed the standards: follow [Setup](/Guides/setup) instead.
2. **Update the package:** `pnpm update @activatus/code-standards --latest`. Then read this page from `node_modules/@activatus/code-standards/docs/version-history.md`.
3. **Read each version newer than the project's**, oldest first. Skip any change to a standard the project opted out of: they are listed in `docs/development/coding-standards.md`.
4. **For each change, do the "What to do" steps**, then run the "How to check" searches. A search that still finds something means the change is not finished.
5. **Run `pnpm lint`, `pnpm test` and the build** after each change.
6. **Update the version number** in `AGENTS.md` once every change is done.

**A patch keeps the same version number.** When only the last number changes, such as 3.0.0 → 3.0.1, the project's version in `AGENTS.md` stays the same, but there may still be work to do. Update the package, then read that version's **Fixes** list and do anything it asks for the project's version. Check it every time the package is updated, even when the version number has not changed.

**When a change does not fit the project**, for example it renames a folder the project does not have, skip it. If you are not sure, ask; do not guess.

## Adding a version

Anyone changing the standards adds a version, alongside the change:

- **One version per release**, numbered one higher than the last. Whole numbers only. A version can collect several changes before it is released.
- **Bump the package's major version to match** in `package.json`: version 3 is `3.0.0`. Then publish it to npm (npmjs.com) with `pnpm publish`. pnpm is the tool; npm is where the package lives, and projects install it from there with `pnpm add`.
- **For every change, write:** what changed, why, what to do in a project, and how to check it is done. Write it for an agent that has not read the rest of the standards.
- **If a project has nothing to do, say so.**
- **Newest version at the top.**
- **Work in progress goes under `## Version N — not released yet`**, with a line saying projects should not apply it yet. Changes can be added to it over time. To release it: drop "not released yet", add the **Released** date and **Updates from** line, set `package.json` to `N.0.0`, then publish.
- **Fixing a released version** bumps only the last number: `3.0.0` → `3.0.1`. Update the version's changes in place, and list what was fixed under its **Fixes**. Projects keep the same version number in `AGENTS.md`. Write each fix so a project already on that version knows what to do.

---

## Version 3

**Released:** 2026-10-17 · **Updates from:** version 2 · **Latest fix:** 3.0.2

Install it with `pnpm add -D @activatus/code-standards@3.0.2`. Do change 1 first: it says which parts of the project's `AGENTS.md` are now the project's own to write.

**Fixes in 3.0.2.** Nothing to do in a project:

- The update steps say how to pick up a patch: the version number in `AGENTS.md` stays the same, so always read the version's Fixes list after updating the package.
- A removed decimal standard keeps its number, such as `11.2. Removed in version N`.
- [When lint must pass](/Standards/lint-errors#when-lint-must-pass) names the usual ways projects check it: a CI job or a git hook.

**Fixes in 3.0.1.** If the project already applied 3.0.0, check these:

- Setup list numbers are permanent again: 19, 20 and 22 are marked removed, and AGENTS.md and the Ontology are back to 21 and 23. Choices recorded under the version 2 numbers are still right.
- The Husky lint hook is no longer a standard. Lint must pass before work is finished; how that is enforced is the project's choice.
- Every name ending in `Reference` uses `Ref`, not only React refs.
- The rename script takes a list of renames with `--list`.

### 1. Project workflow is no longer part of the standards

**Why:** The standards are a base for code. How a project runs its work — branch names, commit messages, Pull Requests, merging, releases, and whether AI agents may commit — is each project's own decision, and every project makes it differently.

**What to do:**

- The Branch Naming and Commit Messages standards are gone, along with standards 19, 20 and 22 from the setup list. Keep whatever the project already does, and make sure it is written up in the project's own docs, usually `docs/development/`.
- **Standards 19, 20 and 22 keep their numbers, marked as removed.** No other number changes. If `docs/development/coding-standards.md` records a choice for 19, 20 or 22, move that rule into Project workflow and take it off the list.
- In `AGENTS.md`, replace the "Development workflow" section with a **Project workflow** section, copied from the [template](/templates#agents). Fill it in with the project's own rules: who commits, branches, commit messages, Pull Requests, merging and releases. Put the most important rule for agents, usually whether they may commit, at the very top: one line, or a short section if it needs more.
- Remove the "Never commit code" and "Do not create, switch or delete branches" lines from "Out of scope for AI agents", unless they are the project's own rule. If they are, they belong in Project workflow.
- Commitlint and the Husky hooks (`.husky/commit-msg` and `.husky/pre-commit`) are no longer templates. Keep them if the project wants them: they are now the project's choice. The standard is only that `pnpm lint` passes before work is finished. See [When lint must pass](/Standards/lint-errors#when-lint-must-pass).

**How to check:** `AGENTS.md` has a Project workflow section, and every rule in it is written up in the project's docs.

### 2. `lib`, `ref` and `repo` are dictionary words, and `library/` is `lib/`

**Why:** They are the words developers use. `lib/` is the name Next.js and shadcn/ui use too.

**What to do:**

- Rename the `library/` folder to `lib/` with `git mv`, and fix the imports: `@/library/` → `@/lib/`.
- Rename every name ending in `Reference` to end in `Ref`, whatever it refers to: `inputReference` → `inputRef`, `surfaceReference` → `surfaceRef`. Rename `repository` back to `repo` where it is short for a Git repository, such as `repositoryName` → `repoName`. Use the editor's Rename Symbol (F2), or the [rename script](/Guides/migrating#renaming-from-the-command-line).
- Copy the new [ESLint config](/Standards/eslint). The naming rule now has `replacements: { docs: false, lib: false, props: false, ref: false, repo: false, utils: false }` and `allowList: { params: true, searchParams: true }`.
- Update the "Dictionary words stay short" line in `AGENTS.md` from the [template](/templates#agents), and remove `lib/` → `library/` and `repo` → `repository` from its Never / Always table.

**How to check:** There is no `library/` folder, `grep -rn "@/library" --exclude-dir=node_modules .` finds nothing, and `pnpm lint` passes.

### 3. utils, services and lib are defined

**Why:** It wasn't clear which functions go in `utils/`, `services/` or `lib/`. See [utils, services and lib](/Structure/folder-structure#utils-services-and-lib).

**What to do:** Check each function in those three folders against the definitions, and move any that are in the wrong one. The common one: a function in `utils/` that calls a database or an API belongs in `services/` or `lib/`. Shared constants and types live in `lib/constants/` and `lib/types/`; a component's own types stay in its `types.ts`. Move any root-level `constants/` or `types/` folder into `lib/`.

**How to check:** Nothing in `utils/` imports from `services/`, `lib/integrations/` or a database client, and there is no root-level `constants/` or `types/` folder.

### 4. The Ontology only holds code words

**Why:** Project-management words mean different things in different projects. Launchpad's "project" is a product made of several MVPs, and its Pull Requests go through `feature → dev → uat → main`.

**What to do:** The code [Ontology](/ontology) no longer defines `project`, `repository`, `branch`, `commit`, `pull_request`, `pull_request_review` or `production`, and `human`, `developer` and `agent` no longer say who may commit. If the project uses those words, define them in its own `docs/product/ontology.md`, the way the project actually works.

**How to check:** The project's ontology defines every project-management word it uses.

### 5. Every config file is `.mjs`

**Why:** `.mjs` works in TypeScript and JavaScript projects alike, so every project looks the same.

**What to do:**

- Rename each config file that is `.js`, `.ts` or `.mts` to `.mjs`, even in a TypeScript project, wherever the tool can read `.mjs`: `prettier.config.mjs`, `next.config.mjs`, `eslint.config.mjs`, `docsSite/docusaurus.config.mjs`, `docsSite/sidebars.mjs` and so on. Use `git mv`. Never convert a config to `.ts` or `.mts`.
- Remove any TypeScript-only syntax as you go. A type annotation becomes a JSDoc comment: `const config: NextConfig = {` becomes `/** @type {import("next").NextConfig} */ const config = {`. Copy the [`docsSite/` templates](/templates#docs-site), which are already `.mjs`.
- Update anything that names the old file, such as `sidebarPath: './sidebars.mjs'` in the docs site config.

**How to check:** `ls *.config.* docsSite/*.config.* docsSite/sidebars.*` shows only `.mjs` files, and `pnpm lint`, `pnpm format:check`, the build and `pnpm docs:build` still run.

### 6. Prettier: 70-character lines and tabs

**Why:** A lot of code is read and reviewed on a phone, where short lines fit the screen. Tabs let each person see the indent at the width they like.

**What to do:**

- Copy the new [`prettier.config.mjs`](/templates#prettier) and [`.editorconfig`](/templates#editorconfig). Prettier now has `printWidth: 70` and `useTabs: true`, and keeps spaces for Markdown and YAML. EditorConfig indents with tabs, except Markdown, YAML and Python.
- Run `pnpm format` once, on its own, with no other changes mixed in. It touches nearly every file, so keep it apart from real changes.
- If the project shows code on a web page, such as its docs site, add `pre, code { tab-size: 2; }` to its CSS, so tabs are not shown 8 characters wide. The [`docsSite/` template](/templates#docs-site) already has it.

**How to check:** `pnpm format:check` passes.

### 7. When a name clashes, rename our own thing first

**Why:** A third-party name is the name everyone knows it by, and a clash usually means our own name is too vague. Renaming an import for taste makes the code harder to search and to match against the package's docs.

**What to do:** Search for renamed imports: `grep -rn "import {[^}]* as " --include=*.ts --include=*.tsx --exclude-dir=node_modules .`. For each one:

- **If nothing in the file clashes with the original name**, undo the rename and use the original name.
- **If our own thing clashes**, rename ours to a more specific full-word name, with the editor's Rename Symbol or the [rename script](/Guides/migrating#renaming-from-the-command-line). Then undo the import rename. For example, our `createClient` becomes `createProjectDatabaseClient`, and Supabase's `createClient` keeps its name.
- **If both names are third-party, or ours is fixed by a framework** (such as a Next.js route's `GET`), keep the import renamed, as the owner plus the original name, never shortened: `Link as LucideLinkIcon`.

See [When a name clashes](/Standards/human-readable-names#when-a-name-clashes).

**How to check:** Every renamed import that is left clashes with another third-party name or a framework-fixed name, and starts with its owner's name.

### 8. Name a type after what it is, not the job it does

**Why:** A type named after its role in one function, such as `StartAgentRunDependenciesType`, is a second name for what is really part of that function's props.

**What to do:** Find types used for only one field of one `Props` type. Move each one inside that `Props` and delete the separate type. Where the object is built somewhere else, remove its type annotation: TypeScript checks it against the `Props` when it is passed in. See [Name a type after what it is](/Standards/readable-code#name-a-type-after-what-it-is-not-the-job-it-does).

**How to check:** No type is used only as the type of one field of one `Props`.

### 9. "go" means carry on

**Why:** People often send just "go" to nudge an agent along, for example when their connection drops and the agent looks stuck. An agent must never read it as permission to commit.

**What to do:** Copy the line that starts **"go" means carry on** from the top of the [`AGENTS.md` template](/templates#agents) into the top of the project's `AGENTS.md`.

**How to check:** The project's `AGENTS.md` has the line near the top.

### 10. Unfinished changes are recorded, not hidden

**Why:** A big change, such as switching on the standard ESLint config, may be finished later. The version number has to stay honest about that.

**What to do:** Add an "Unfinished changes" section to `docs/development/coding-standards.md`, from the [template](/templates#document-templates). List any change from any version that is not done yet, with what is left and where it is being done, or write "None". See [Finishing a change later](/Guides/setup#finishing-a-change-later).

**How to check:** `docs/development/coding-standards.md` has an "Unfinished changes" section.

### No action needed

- The [Ontology](/ontology) defines `dependency`: something the code relies on but does not define itself. Ticket relationships are not dependencies; each project names those itself.
- The package now ships a rename script for agents working from the command line, using TypeScript's own rename: `node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs <file> <currentName> <newName>`. Pass `--list renames.txt` to do many renames in one run, one per line. It can't reach keys in untyped object literals, such as the expected value in a test's `toEqual({ … })`: search the tests for old names and fix those by hand. See [Renaming from the command line](/Guides/migrating#renaming-from-the-command-line).
- The [Setup](/Guides/setup) guide says the standards are a base for code only, and explains how to get past pnpm's `minimumReleaseAge` when a new version is too fresh to install.
- [Folder Structure](/Structure/folder-structure) explains each `lib/` folder in one line.
- The [ESLint page](/Standards/eslint#installation) says the config needs ESLint 10.4 or later, and the React configs explain why they set `settings.react.version`.

---

## Version 2

**Released:** 2026-10-15 · **Updates from:** version 1

### 1. The standards are an npm package — do this first

**Why:** A project installs the standards, so an agent reads the exact version the project uses, straight from `node_modules`. The package version is the standards version: `2.0.0` is version 2.

**What to do:**

- `pnpm add -D @activatus/code-standards`
- Read the rest of this update from `node_modules/@activatus/code-standards/docs/version-history.md`. The templates to copy are in `node_modules/@activatus/code-standards/static/templates/`.
- In `AGENTS.md`, under "Code standards", say the standards are installed as `@activatus/code-standards`, and that agents read them from `node_modules/@activatus/code-standards/docs/`. Copy the wording from the [`AGENTS.md` template](/templates#agents).

**How to check:** `@activatus/code-standards` is in the project's `devDependencies`.

### 2. The person agrees which standards apply — do this second

**Why:** Not every standard suits every project. The person now picks, from a numbered list, and the choices are written down so every agent follows the same ones.

**What to do:**

- Print the numbered list in [Setup, step 3](/Guides/setup#3-agree-the-standards) to the person, exactly as written, and record their answer in `docs/development/coding-standards.md`.
- For the rest of this update, **skip any change to a standard the person opted out of.**

**How to check:** `docs/development/coding-standards.md` lists the opted-out standards by number, or says "No differences".

### 3. `docs` is a dictionary word: the docs folder is `docs/` again

**Why:** `docs` is a word, not an abbreviation, and `documentation` is long and hard to read in names.

**What to do:**

- Rename the folders with `git mv`: `documentation/` → `docs/`, `documentationSite/` → `docsSite/`.
- **If both `docsSite/` and `documentationSite/` exist**, merge them into `docsSite/`: move each tracked file from `documentationSite/` with `git mv`, keeping whichever copy is newer, then delete `documentationSite/`. Ask the person before deleting a file that exists in only one of them.
- Rename `docs/overview/writing-documentation.md` → `docs/overview/writing-docs.md`, and fix every link to it.
- Rename the environment variable `DOCUMENTATION_URL` → `DOCS_URL` in `next.config.mjs`, `.env.local`, `.env.example` and the hosting provider's settings.
- Rename the route `/documentation` → `/docs`. Copy the new rewrite from the [`next.config.mjs` template](/templates#docs-route).
- **Re-copy `docsSite/docusaurus.config.ts`** from the [`docsSite/` template](/templates#docs-site), keeping the project's name and theme. Version 2 changed it: `baseUrl: '/docs/'`, `path: '../docs'`, full-word variable names (`rest` → `remainingArguments`, `doc` → `page`), and `static/img` → `static/images`. Rename the project's `docsSite/static/img/` to `static/images/` to match.
- Rename the scripts in `package.json`: `documentation:install` → `docs:install`, `documentation:dev` → `docs:dev`, `documentation:build` → `docs:build`.
- If the docs site's generated folders were ever committed, stop tracking them: `git rm -r --cached docsSite/.docusaurus docsSite/build`. They are in the [`docsSite/` template's](/templates#docs-site) `.gitignore`.
- Update every mention in `AGENTS.md`, `README.md` and the docs themselves.
- **Update every ignore list** that names the old folders: ESLint, Prettier, `tsconfig.json`, Vitest or Jest, and `.gitignore`. A leftover docs site with its own `node_modules` makes test runners and linters run its files too.

**How to check:** `grep -rn "documentation/\|'../documentation'\|documentationSite\|DOCUMENTATION_URL\|documentation:" --exclude-dir=node_modules .` finds nothing. Normal sentences that say "documentation" are fine.

### 4. `props` is a dictionary word: prop types end in `Props`

**Why:** `props` is the word every React developer uses. `properties` is harder to read.

**What to do:**

- Rename every type ending in `Properties` to end in `Props`: `ButtonProperties` → `ButtonProps`. Never use find-and-replace. Use the editor's Rename Symbol (F2) or, for an agent working from the command line, the rename script in version 3 and later of the package: `node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs <file> <currentName> <newName>`. Both use TypeScript's own rename, so they change every use and nothing else.
- Rename variables and parameters called `properties` to `props`, including spreads: `...buttonProperties` → `...buttonProps`.
- **If the project already uses the standard ESLint config**, copy the new [ESLint config](/Standards/eslint). It needs ESLint 10.4 or later. Two things changed in it:
  - The type-name rule is now `(Props|Type)$`.
  - `unicorn/name-replacements` now has `replacements: { docs: false, props: false, utils: false }`.
- **If the project never had the standard ESLint config**, do only the renames in this change. Switching the config on can find hundreds of problems, so do it separately with [Migrating an Existing Project](/Guides/migrating), one stage per Pull Request, and record it as unfinished: see [Finishing a change later](/Guides/setup#finishing-a-change-later).

**How to check:** `grep -rn "Properties\b" --include=*.ts --include=*.tsx --exclude-dir=node_modules .` finds nothing of ours, and `pnpm lint` passes.

### 5. `utils` is a dictionary word: reusable functions live in `utils/`

**Why:** `utils` is the word developers use. `utilities` and `helpers` are not.

**What to do:**

- Rename every `utilities/` folder to `utils/` with `git mv`, at every level: global, section and component.
- Rename any `helpers/` folder to `utils/`. Split a `helpers.ts` grab-bag file into one folder per function.
- Fix the imports: `@/utilities` → `@/utils`, `./utilities` → `./utils`.

**How to check:** `find . -type d \( -name utilities -o -name helpers \) -not -path "*/node_modules/*"` finds nothing, and `grep -rn "utilities\"" --exclude-dir=node_modules .` finds no imports.

### 6. Components live where they are used: no feature folders

**Why:** Grouping by feature and grouping by page meant two places for the same component. Now there is one rule. See [Where components live](/Structure/folder-structure#-where-components-live).

| Used by                                                  | Lives in                    |
| -------------------------------------------------------- | --------------------------- |
| Every project the same way: the Design System Components | `components/ui/`            |
| More than one page of this project                       | `components/shared/`        |
| A few pages in one section                               | `app/(section)/components/` |
| One page only                                            | `app/page-name/components/` |

**What to do:**

- For each component in `components/features/` or `components/layout/`, find where it is imported (`grep -rn "ComponentName"`).
  - Imported by one page → move it to that page's `components/` folder.
  - Imported by pages in one section → move it to that section's route group: `app/(section)/components/`.
  - Imported by pages in more than one section → move it to `components/shared/`.
- Move a feature's `utils/` folder the same way, to wherever its functions are used.
- Delete the empty `components/features/` and `components/layout/` folders.
- Leave `components/ui/` as it is.

**How to check:** `components/features/` and `components/layout/` do not exist, and the build passes.

### 7. The Component Reference is now Design System Components

**Why:** It is the list of standard components every project builds the same way, and "design system components" is what people call that.

**What to do:** In `AGENTS.md` and the project's docs, change "Component Reference" to "Design System Components", and change links from `/template-components` to `/design-system-components`.

**How to check:** `grep -rn "Component Reference\|template-components" --exclude-dir=node_modules .` finds nothing.

### 8. The Dictionary: short names that are words

**Why:** Some short names are words, not abbreviations. The [Dictionary](/Standards/human-readable-names#dictionary) is the one list of them, so nobody has to guess.

**What to do:**

- The Dictionary has: `id`, `docs`, `props`, `utils`, `app`, `url`, `api`, `uat`, `pdf`, `html`, `css`, `json`, `readme`.
- Any other short name in the project's own code is written out in full. If one seems like a word, ask for it to be added to the Dictionary; do not just use it.
- Copy the new "Dictionary words stay short" bullet into `AGENTS.md` from the [template](/templates#agents).

**How to check:** `pnpm lint` passes with the new ESLint config.

### 9. Third-party names are used as they are

**Why:** The naming rule is only for names we write. Names from someone else's code keep their own names: everyone knows them by those names, and renaming them breaks the code.

**What to do:**

- Undo any rename of a third-party name. The common one is shadcn/ui's `cn` function: it stays `cn`.
- In our own code, give the value a full-word name as soon as it arrives: `const workingDirectory = process.cwd();`, then `{ cwd: workingDirectory }`.

**How to check:** Nothing to search for. Review any renamed import from a package.

### 10. The ontology only holds code words

**Why:** The code standards define words about writing code. Each project defines the words for what it builds.

**What to do:**

- Keep the project's product words in `docs/product/ontology.md`.
- Check every word in it against the [Ontology](/ontology). If the project gives a code word a different meaning, remove that entry and use the code standards' meaning. Tell a person what changed.
- Make the project's ontology say that it adds to the code standards' ontology.
- Update the "Ontology" section of `AGENTS.md` from the [template](/templates#agents). It now points to both ontologies.

**How to check:** No term in `docs/product/ontology.md` is also defined in the code standards' [Ontology](/ontology).

### 11. Whether agents may commit is the project's choice

**Why:** Strict no commit is right for most projects, but a tool built to ship code with AI, such as Launchpad, needs agents to commit.

**What to do:** This is standard 22 in the list from change 2. If the person kept it, keep the template's "NEVER COMMIT CODE" lines for strict no commit. Otherwise, replace them with the project's own rule, saying exactly which agents may commit, push and open Pull Requests, and when. See [A project can choose otherwise](/Standards/agent-specs#project-workflow).

**How to check:** The top of `AGENTS.md` states the project's commit rule.

### 12. The live standards site

**Why:** The standards now have a real address: https://activatus-code-standards.vercel.app

**What to do:** Replace `[code standards site URL]` in `AGENTS.md` and `docs/development/coding-standards.md` with https://activatus-code-standards.vercel.app

**How to check:** `grep -rn "code standards site URL" .` finds nothing.

### 13. This Version History

**What to do:** Add `**Code standards version:** 2` to `AGENTS.md`, under "Code standards".

### No action needed

- The [Setup](/Guides/setup) guide is written for the agent: install the package, check the version, agree the standards, apply them. It never asks which framework the project uses, and never creates the app: the person does that.
- The [migration guide](/Guides/migrating#stage-4--names) has a Names stage.

---

## Version 1

**Released:** 2026-10-15

The first numbered version: everything in the standards on this date. It included `documentation/` for the docs folder, `Properties` at the end of prop types, `utilities/` for reusable functions, `components/features/`, and the Component Reference. Version 2 replaced all five.

**What to do in a project:** follow the [migration guide](/Guides/migrating) for everything.
