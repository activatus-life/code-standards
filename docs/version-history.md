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

1. **Find the project's version** in its `AGENTS.md`. If there is none, the project has never followed the standards: follow [Setup](/docs/Guides/setup) instead.
2. **Update the package:** `pnpm update @activatus/code-standards --latest`. If pnpm refuses because the version is too new, add the package to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`, as in [Setup](/docs/Guides/setup#1-install-the-standards). Then read this page from `node_modules/@activatus/code-standards/docs/version-history.md`.
3. **Read each version newer than the project's**, oldest first. Skip any change to a standard the project opted out of: they are listed in `docs/development/coding-standards.md`.
4. **For each change, do the "What to do" steps**, then run the "How to check" searches. A search that still finds something means the change is not finished. When a change says to copy a line from the `AGENTS.md` template, and the project's `AGENTS.md` records the standards in its own words instead, write the updated rule there in the project's own shape.
5. **Strike out what the standard now covers.** After the changes, re-read the project's list of opted-out and changed standards in `docs/development/coding-standards.md`. Take off the list any exception the new version has made part of the standard, and update any rule it records for an old shape of the standard. A differences list that still describes the old standard sends the next agent wrong.
6. **Run `pnpm lint`, `pnpm test` and the build** after each change.
7. **Update the version number** in `AGENTS.md` once every change is done.

**A patch keeps the same version number.** When only the last number changes, such as 3.0.0 → 3.0.1, the project's version in `AGENTS.md` stays the same, but there may still be work to do. Update the package, then read that version's **Fixes** list and do anything it asks for the project's version. Check it every time the package is updated, even when the version number has not changed.

**When a change does not fit the project**, for example it renames a folder the project does not have, skip it. If you are not sure, ask; do not guess.

## Adding a version

Anyone changing the standards adds a version, alongside the change:

- **One version per release**, numbered one higher than the last. Whole numbers only. A version can collect several changes before it is released.
- **Bump the package's major version to match** in `package.json`: version 3 is `3.0.0`. Then publish it to npm (npmjs.com) with `pnpm publish`. pnpm is the tool; npm is where the package lives, and projects install it from there with `pnpm add`.
- **For every change, write:** what changed, why, what to do in a project, and how to check it is done. Write it for an agent that has not read the rest of the standards.
- **If a project has nothing to do, say so.**
- **Newest version at the top.**
- **Work in progress goes under `## Version N — not released yet`**, with a line saying projects should not apply it yet. Changes can be added to it over time. To release it: pilot it (below), drop "not released yet", add the **Released** date and **Updates from** line, set `package.json` to `N.0.0`, then publish.
- **Pilot a version in a real project before releasing it.** Once the work-in-progress version is written, have one real project apply it exactly as written, reading only what the page says. Every judgement call the agent has to make, and every instruction that does not fit the project, is a missing sentence: fold it back into the version before publishing. Release only when the pilot runs without the agent asking a question the page does not answer.
- **Fixing a released version** bumps only the last number: `3.0.0` → `3.0.1`. Update the version's changes in place, and list what was fixed under its **Fixes**. Projects keep the same version number in `AGENTS.md`. Write each fix so a project already on that version knows what to do.
- **Every patch number is published.** Publish each patch to npm as soon as its Fixes are written. A Fixes entry for a version that was never published sends a project to install something that does not exist.
- **Judgement calls after release are fixes, not workarounds.** When a project's update needed a call the steps did not cover, add it under the version's Fixes so every other project gets it too. A project should never keep a private workaround for an unclear step.

---

## Version 3

**Released:** 2026-10-17 · **Updates from:** version 2 · **Latest fix:** 3.0.8

Install it with `pnpm add -D @activatus/code-standards@3.0.8`. Do change 1 first: it says which parts of the project's `AGENTS.md` are now the project's own to write.

**Fixes in 3.0.8.** If the project already applied 3.0.7, check these:

- **Ask before every commit and push (option B) is gone.** Whether agents commit is the project's own workflow, as in change 1. If the project took B in 3.0.7, the rule stays only if the person wants it: it belongs under **Who commits** in Project workflow, in the project's own words. Remove the "Ask before every commit and push" section copied from the template, and take B off `docs/development/coding-standards.md`.
- **The Linear project can come from the project's own docs.** If they already name it, read it from there and confirm it with the person. Never copy it from another project.
- **`pnpm-workspace.yaml` is Prettier-ignored.** pnpm rewrites it with single quotes on every install, so `pnpm format:check` failed after every update. Add `pnpm-workspace.yaml` to `.prettierignore`.
- **The update steps cover pnpm's release-age check**: if pnpm refuses a version that has only just been published, add the package to `minimumReleaseAgeExclude`. See [Setup](/docs/Guides/setup#1-install-the-standards).
- 3.0.3 and 3.0.6 were never published to npm. Their fixes are in 3.0.4 and 3.0.7. Every patch is now published.

**How to check:** `.prettierignore` lists `pnpm-workspace.yaml`, `pnpm format:check` passes, and `AGENTS.md` has no "Ask before every commit and push" section unless the person chose to keep that rule.

**Fixes in 3.0.7.** New, optional: [Working with Agents](/docs/Standards/working-with-agents). Setup now asks for the project's GitHub repo and Linear project, and offers status circles. (3.0.7 also offered asking before every commit and push. 3.0.8 removed it.) If the project already applied 3.0.5:

- Add **GitHub repo** and **Linear project** to the Project workflow section of `AGENTS.md`, from the [template](/docs/templates#agents). Read the repo from `git remote get-url origin` and confirm it with the person. Read the Linear project from the project's own docs if they name it, and confirm it; otherwise ask. Never copy it from another project.
- Print the [status circles](/docs/Guides/setup#working-with-the-agent) question to the person. If they say yes, copy the Status circles section from the template into Project workflow. Write their answer in `docs/development/coding-standards.md`, under "Details". If `AGENTS.md` already has status circles in the project's own words, keep that.

**How to check:** Project workflow in `AGENTS.md` names the GitHub repo and the Linear project, and `docs/development/coding-standards.md` records whether the project took the status circles.

**Fixes in 3.0.6.** Never published to npm: these fixes are in 3.0.7. Nothing to do in a project. The update steps gained two rules: when the project's `AGENTS.md` records the standards in its own words, an update writes the changed line in that shape; and after an update the project's list of opted-out and changed standards is re-read, taking off it anything the new version now covers. The 3.0.5 numbers change has its check spelled out: `pnpm lint` reporting a `no-magic-numbers` finding means it is not finished. A project-specific block in an ESLint config is now defined: it is recorded in the project's `docs/development/coding-standards.md`, or `pnpm lint` fails without it.

**Fixes in 3.0.5.** The ESLint configs now pass their own rules. Copied in as they were, they gave three problems on the config file itself: `No magic number: 3` (`no-magic-numbers`), and in Next.js projects two warnings, `import/no-anonymous-default-export` and `import-x/no-named-as-default-member`. Copy the new [ESLint config](/docs/Standards/eslint) for the project's framework over `eslint.config.mjs`, keeping any project-specific block: one that is recorded in the project's `docs/development/coding-standards.md`, or without which `pnpm lint` fails. A block that is neither, and the lint passes without it, is a leftover: ask before removing it. Then run `pnpm lint`: the config file itself has no problems. If the project already fixed these three by hand, there is nothing to do.

- `max-depth` uses a named constant, `MAXIMUM_NESTING_DEPTH`.
- The array is assigned to `config` before `export default config`.
- The eslint-comments preset is imported by name: `import { recommended as eslintCommentsRecommended } from "@eslint-community/eslint-plugin-eslint-comments/configs";`.
- Numbers have a home: [Numbers](/docs/Structure/folder-structure#numbers-named-and-kept-by-topic). A number used in one file is named at the top of that file, and one shared across the app goes in `lib/constants/`, in a file named after its topic, such as `durations.ts`. There is no `n` object and no `numbers.ts`. If the project has a file of unrelated numbers, split it by topic. Copy the updated **No magic numbers** line from the [`AGENTS.md` template](/docs/templates#agents). Run `pnpm lint`: a `no-magic-numbers` finding means the change is not finished.
- `docsSite/` is ignored. It is the standard docs viewer, with its own packages and build, and without the ignore ESLint lints its built files. If the project already ignores it, nothing changes.
- The one-parameter selectors moved into their own `SINGLE_OBJECT_PARAMETER` list. **Next.js:** route handlers in `app/**/route.ts` may now take `(request, context)`. If the project switched the rule off for them some other way, such as an override block or `eslint-disable` comments, remove it.

**Fixes in 3.0.4.** If the project already applied 3.0.3, do these:

- New standard 12.1: links, text and stand-in data live in `lib/constants/`, as `r`, `s` and noData. `r` and `s` are the only single-letter names allowed. Do change 11.
- The standards site has a home page, and the docs moved to `/docs/...`. Old links redirect, so nothing breaks. Update any link to the standards site in the project's `AGENTS.md` or docs to the `/docs/` address, such as `https://activatus-code-standards.vercel.app/docs/ontology`.

**Fixes in 3.0.3.** Never published to npm: these fixes are in 3.0.4. Change 8 now says how to type a function inside an object that is built somewhere else: give the function its own `Props` type, such as `LaunchSessionProps`, and use it. If the project wrote those parameter types out inline, such as `({ worktreePath }: { worktreePath: string })`, replace each with the function's `Props` type. Also new: type first, never `satisfies`. It is an ESLint error now, so copy the new ESLint config and replace each `satisfies` with a type on the declaration, except in Storybook story files.

**Fixes in 3.0.2.** Nothing to do in a project:

- The update steps say how to pick up a patch: the version number in `AGENTS.md` stays the same, so always read the version's Fixes list after updating the package.
- A removed decimal standard keeps its number, such as `11.2. Removed in version N`.
- [When lint must pass](/docs/Standards/lint-errors#when-lint-must-pass) names the usual ways projects check it: a CI job or a git hook.

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
- In `AGENTS.md`, replace the "Development workflow" section with a **Project workflow** section, copied from the [template](/docs/templates#agents). Fill it in with the project's own rules: who commits, branches, commit messages, Pull Requests, merging and releases. Put the most important rule for agents, usually whether they may commit, at the very top: one line, or a short section if it needs more.
- Remove the "Never commit code" and "Do not create, switch or delete branches" lines from "Out of scope for AI agents", unless they are the project's own rule. If they are, they belong in Project workflow.
- Commitlint and the Husky hooks (`.husky/commit-msg` and `.husky/pre-commit`) are no longer templates. Keep them if the project wants them: they are now the project's choice. The standard is only that `pnpm lint` passes before work is finished. See [When lint must pass](/docs/Standards/lint-errors#when-lint-must-pass).

**How to check:** `AGENTS.md` has a Project workflow section, and every rule in it is written up in the project's docs.

### 2. `lib`, `ref` and `repo` are dictionary words, and `library/` is `lib/`

**Why:** They are the words developers use. `lib/` is the name Next.js and shadcn/ui use too.

**What to do:**

- Rename the `library/` folder to `lib/` with `git mv`, and fix the imports: `@/library/` → `@/lib/`.
- Rename every name ending in `Reference` to end in `Ref`, whatever it refers to: `inputReference` → `inputRef`, `surfaceReference` → `surfaceRef`. Rename `repository` back to `repo` where it is short for a Git repository, such as `repositoryName` → `repoName`. Use the editor's Rename Symbol (F2), or the [rename script](/docs/Guides/migrating#renaming-from-the-command-line).
- Copy the new [ESLint config](/docs/Standards/eslint). The naming rule now has `replacements: { docs: false, lib: false, props: false, ref: false, repo: false, utils: false }` and `allowList: { params: true, searchParams: true }`.
- Update the "Dictionary words stay short" line in `AGENTS.md` from the [template](/docs/templates#agents), and remove `lib/` → `library/` and `repo` → `repository` from its Never / Always table.

**How to check:** There is no `library/` folder, `grep -rn "@/library" --exclude-dir=node_modules .` finds nothing, and `pnpm lint` passes.

### 3. utils, services and lib are defined

**Why:** It wasn't clear which functions go in `utils/`, `services/` or `lib/`. See [utils, services and lib](/docs/Structure/folder-structure#utils-services-and-lib).

**What to do:** Check each function in those three folders against the definitions, and move any that are in the wrong one. The common one: a function in `utils/` that calls a database or an API belongs in `services/` or `lib/`. Shared constants and types live in `lib/constants/` and `lib/types/`; a component's own types stay in its `types.ts`. Move any root-level `constants/` or `types/` folder into `lib/`.

**How to check:** Nothing in `utils/` imports from `services/`, `lib/integrations/` or a database client, and there is no root-level `constants/` or `types/` folder.

### 4. The Ontology only holds code words

**Why:** Project-management words mean different things in different projects. Launchpad's "project" is a product made of several MVPs, and its Pull Requests go through `feature → dev → uat → main`.

**What to do:** The code [Ontology](/docs/ontology) no longer defines `project`, `repository`, `branch`, `commit`, `pull_request`, `pull_request_review` or `production`, and `human`, `developer` and `agent` no longer say who may commit. If the project uses those words, define them in its own `docs/product/ontology.md`, the way the project actually works.

**How to check:** The project's ontology defines every project-management word it uses.

### 5. Every config file is `.mjs`

**Why:** `.mjs` works in TypeScript and JavaScript projects alike, so every project looks the same.

**What to do:**

- Rename each config file that is `.js`, `.ts` or `.mts` to `.mjs`, even in a TypeScript project, wherever the tool can read `.mjs`: `prettier.config.mjs`, `next.config.mjs`, `eslint.config.mjs`, `docsSite/docusaurus.config.mjs`, `docsSite/sidebars.mjs` and so on. Use `git mv`. Never convert a config to `.ts` or `.mts`.
- Remove any TypeScript-only syntax as you go. A type annotation becomes a JSDoc comment: `const config: NextConfig = {` becomes `/** @type {import("next").NextConfig} */ const config = {`. Copy the [`docsSite/` templates](/docs/templates#docs-site), which are already `.mjs`.
- Update anything that names the old file, such as `sidebarPath: './sidebars.mjs'` in the docs site config.

**How to check:** `ls *.config.* docsSite/*.config.* docsSite/sidebars.*` shows only `.mjs` files, and `pnpm lint`, `pnpm format:check`, the build and `pnpm docs:build` still run.

### 6. Prettier: 70-character lines and tabs

**Why:** A lot of code is read and reviewed on a phone, where short lines fit the screen. Tabs let each person see the indent at the width they like.

**What to do:**

- Copy the new [`prettier.config.mjs`](/docs/templates#prettier) and [`.editorconfig`](/docs/templates#editorconfig). Prettier now has `printWidth: 70` and `useTabs: true`, and keeps spaces for Markdown and YAML. EditorConfig indents with tabs, except Markdown, YAML and Python.
- Run `pnpm format` once, on its own, with no other changes mixed in. It touches nearly every file, so keep it apart from real changes.
- If the project shows code on a web page, such as its docs site, add `pre, code { tab-size: 2; }` to its CSS, so tabs are not shown 8 characters wide. The [`docsSite/` template](/docs/templates#docs-site) already has it.

**How to check:** `pnpm format:check` passes.

### 7. When a name clashes, rename our own thing first

**Why:** A third-party name is the name everyone knows it by, and a clash usually means our own name is too vague. Renaming an import for taste makes the code harder to search and to match against the package's docs.

**What to do:** Search for renamed imports: `grep -rn "import {[^}]* as " --include=*.ts --include=*.tsx --exclude-dir=node_modules .`. For each one:

- **If nothing in the file clashes with the original name**, undo the rename and use the original name.
- **If our own thing clashes**, rename ours to a more specific full-word name, with the editor's Rename Symbol or the [rename script](/docs/Guides/migrating#renaming-from-the-command-line). Then undo the import rename. For example, our `createClient` becomes `createProjectDatabaseClient`, and Supabase's `createClient` keeps its name.
- **If both names are third-party, or ours is fixed by a framework** (such as a Next.js route's `GET`), keep the import renamed, as the owner plus the original name, never shortened: `Link as LucideLinkIcon`.

See [When a name clashes](/docs/Standards/human-readable-names#when-a-name-clashes).

**How to check:** Every renamed import that is left clashes with another third-party name or a framework-fixed name, and starts with its owner's name.

### 8. Name a type after what it is, not the job it does

**Why:** A type named after its role in one function, such as `StartAgentRunDependenciesType`, is a second name for what is really part of that function's props.

**What to do:** Find types used for only one field of one `Props` type. Move each one inside that `Props` and delete the separate type. Where the object is built somewhere else, don't just delete its type: the functions inside lose their parameter types and the type check fails. Give each function its own `Props` type for its single object parameter, named after the function, and use it there: `launchSession: async ({ worktreePath }: LaunchSessionProps) =>`. Don't write the type out inline, such as `({ worktreePath }: { worktreePath: string })`.

**Type first, never `satisfies`.** A value gets its type where it is declared, and `satisfies` is now an ESLint error. Replace each `{ … } satisfies SomeType` with a type on the declaration: `const config: ConfigType = { … }`. **Leave story files alone**: they follow Storybook's docs, `satisfies Meta<typeof Component>` with `StoryObj<typeof meta>`, and ESLint allows it there. Copy the new [ESLint config](/docs/Standards/eslint) to switch the check on.

**How to check:** No type is used only as the type of one field of one `Props`, `grep -rn " satisfies " --include=*.ts --include=*.tsx --exclude=*.stories.* --exclude-dir=node_modules .` finds nothing, and the type check and `pnpm lint` pass.

### 9. "go" means carry on

**Why:** People often send just "go" to nudge an agent along, for example when their connection drops and the agent looks stuck. An agent must never read it as permission to commit.

**What to do:** Copy the line that starts **"go" means carry on** from the top of the [`AGENTS.md` template](/docs/templates#agents) into the top of the project's `AGENTS.md`.

**How to check:** The project's `AGENTS.md` has the line near the top.

### 10. Unfinished changes are recorded, not hidden

**Why:** A big change, such as switching on the standard ESLint config, may be finished later. The version number has to stay honest about that.

**What to do:** Add an "Unfinished changes" section to `docs/development/coding-standards.md`, from the [template](/docs/templates#document-templates). List any change from any version that is not done yet, with what is left and where it is being done, or write "None". See [Finishing a change later](/docs/Guides/setup#finishing-a-change-later).

**How to check:** `docs/development/coding-standards.md` has an "Unfinished changes" section.

### 11. Links, text and stand-in data live in `lib/constants/`

**Why:** One place for every link and every piece of text means nothing is hard-coded in a component, and the keys of `s` become the translation keys when a site gets more languages. noData lets every page render while working locally with no internet.

**What to do:**

- Create `lib/constants/` with `routes.ts`, `strings.ts`, `noData.ts` and `index.ts`, as in [Constants](/docs/Structure/folder-structure#constants). If the project already has them somewhere else, such as `app/constants/`, move the folder with `git mv` and fix the imports: `@/app/constants` → `@/lib/constants`.
- `routes.ts` exports `r`, with every link: the app's own pages, outside sites, and `mailto:`, `tel:` and `sms:` links. `strings.ts` exports `s`, with every piece of static text. Use named exports, `export const r = { … }`, never `export default`.
- Move links and text written straight into components into `r` and `s`.
- Rename each noData export to `NO_DATA_` plus the thing it stands in for: `noDataInsights` → `NO_DATA_INSIGHTS`. Move dummy values, such as `dummyHeading`, out of `s` to the top of `noData.ts` as `DUMMY_HEADING` and the rest. Move anything in `noData.ts` that is real copy, such as a page's metadata, into `s`.
- Use noData only in local development: `query?.insights ?? (IS_LOCAL_DEVELOPMENT ? NO_DATA_INSIGHTS : [])`.
- Inside `lib/constants/`, files import each other directly, `import { s } from "./strings";`, never through `@/lib/constants`.
- Copy the new **Links, text and stand-in data** line and the `r` and `s` exception from the [`AGENTS.md` template](/docs/templates#agents).
- Add `12.1` to the project's standards: it is a new standard, so ask the person whether the project follows it. Record a no in `docs/development/coding-standards.md`.

**How to check:** `grep -rn "export default" lib/constants` and `grep -rn "noData[A-Z]\|dummy" lib/constants/strings.ts` find nothing, and the type check, `pnpm lint` and the build pass.

### No action needed

- The [Ontology](/docs/ontology) defines `dependency`: something the code relies on but does not define itself. Ticket relationships are not dependencies; each project names those itself.
- The package now ships a rename script for agents working from the command line, using TypeScript's own rename: `node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs <file> <currentName> <newName>`. Pass `--list renames.txt` to do many renames in one run, one per line. It can't reach keys in untyped object literals, such as the expected value in a test's `toEqual({ … })`: search the tests for old names and fix those by hand. See [Renaming from the command line](/docs/Guides/migrating#renaming-from-the-command-line).
- The [Setup](/docs/Guides/setup) guide says the standards are a base for code only, and explains how to get past pnpm's `minimumReleaseAge` when a new version is too fresh to install.
- [Folder Structure](/docs/Structure/folder-structure) explains each `lib/` folder in one line.
- The [ESLint page](/docs/Standards/eslint#installation) says the config needs ESLint 10.4 or later, and the React configs explain why they set `settings.react.version`.

---

## Version 2

**Released:** 2026-10-15 · **Updates from:** version 1

### 1. The standards are an npm package — do this first

**Why:** A project installs the standards, so an agent reads the exact version the project uses, straight from `node_modules`. The package version is the standards version: `2.0.0` is version 2.

**What to do:**

- `pnpm add -D @activatus/code-standards`
- Read the rest of this update from `node_modules/@activatus/code-standards/docs/version-history.md`. The templates to copy are in `node_modules/@activatus/code-standards/static/templates/`.
- In `AGENTS.md`, under "Code standards", say the standards are installed as `@activatus/code-standards`, and that agents read them from `node_modules/@activatus/code-standards/docs/`. Copy the wording from the [`AGENTS.md` template](/docs/templates#agents).

**How to check:** `@activatus/code-standards` is in the project's `devDependencies`.

### 2. The person agrees which standards apply — do this second

**Why:** Not every standard suits every project. The person now picks, from a numbered list, and the choices are written down so every agent follows the same ones.

**What to do:**

- Print the numbered list in [Setup, step 3](/docs/Guides/setup#3-agree-the-standards) to the person, exactly as written, and record their answer in `docs/development/coding-standards.md`.
- For the rest of this update, **skip any change to a standard the person opted out of.**

**How to check:** `docs/development/coding-standards.md` lists the opted-out standards by number, or says "No differences".

### 3. `docs` is a dictionary word: the docs folder is `docs/` again

**Why:** `docs` is a word, not an abbreviation, and `documentation` is long and hard to read in names.

**What to do:**

- Rename the folders with `git mv`: `documentation/` → `docs/`, `documentationSite/` → `docsSite/`.
- **If both `docsSite/` and `documentationSite/` exist**, merge them into `docsSite/`: move each tracked file from `documentationSite/` with `git mv`, keeping whichever copy is newer, then delete `documentationSite/`. Ask the person before deleting a file that exists in only one of them.
- Rename `docs/overview/writing-documentation.md` → `docs/overview/writing-docs.md`, and fix every link to it.
- Rename the environment variable `DOCUMENTATION_URL` → `DOCS_URL` in `next.config.mjs`, `.env.local`, `.env.example` and the hosting provider's settings.
- Rename the route `/documentation` → `/docs`. Copy the new rewrite from the [`next.config.mjs` template](/docs/templates#docs-route).
- **Re-copy `docsSite/docusaurus.config.ts`** from the [`docsSite/` template](/docs/templates#docs-site), keeping the project's name and theme. Version 2 changed it: `baseUrl: '/docs/'`, `path: '../docs'`, full-word variable names (`rest` → `remainingArguments`, `doc` → `page`), and `static/img` → `static/images`. Rename the project's `docsSite/static/img/` to `static/images/` to match.
- Rename the scripts in `package.json`: `documentation:install` → `docs:install`, `documentation:dev` → `docs:dev`, `documentation:build` → `docs:build`.
- If the docs site's generated folders were ever committed, stop tracking them: `git rm -r --cached docsSite/.docusaurus docsSite/build`. They are in the [`docsSite/` template's](/docs/templates#docs-site) `.gitignore`.
- Update every mention in `AGENTS.md`, `README.md` and the docs themselves.
- **Update every ignore list** that names the old folders: ESLint, Prettier, `tsconfig.json`, Vitest or Jest, and `.gitignore`. A leftover docs site with its own `node_modules` makes test runners and linters run its files too.

**How to check:** `grep -rn "documentation/\|'../documentation'\|documentationSite\|DOCUMENTATION_URL\|documentation:" --exclude-dir=node_modules .` finds nothing. Normal sentences that say "documentation" are fine.

### 4. `props` is a dictionary word: prop types end in `Props`

**Why:** `props` is the word every React developer uses. `properties` is harder to read.

**What to do:**

- Rename every type ending in `Properties` to end in `Props`: `ButtonProperties` → `ButtonProps`. Never use find-and-replace. Use the editor's Rename Symbol (F2) or, for an agent working from the command line, the rename script in version 3 and later of the package: `node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs <file> <currentName> <newName>`. Both use TypeScript's own rename, so they change every use and nothing else.
- Rename variables and parameters called `properties` to `props`, including spreads: `...buttonProperties` → `...buttonProps`.
- **If the project already uses the standard ESLint config**, copy the new [ESLint config](/docs/Standards/eslint). It needs ESLint 10.4 or later. Two things changed in it:
  - The type-name rule is now `(Props|Type)$`.
  - `unicorn/name-replacements` now has `replacements: { docs: false, props: false, utils: false }`.
- **If the project never had the standard ESLint config**, do only the renames in this change. Switching the config on can find hundreds of problems, so do it separately with [Migrating an Existing Project](/docs/Guides/migrating), one stage per Pull Request, and record it as unfinished: see [Finishing a change later](/docs/Guides/setup#finishing-a-change-later).

**How to check:** `grep -rn "Properties\b" --include=*.ts --include=*.tsx --exclude-dir=node_modules .` finds nothing of ours, and `pnpm lint` passes.

### 5. `utils` is a dictionary word: reusable functions live in `utils/`

**Why:** `utils` is the word developers use. `utilities` and `helpers` are not.

**What to do:**

- Rename every `utilities/` folder to `utils/` with `git mv`, at every level: global, section and component.
- Rename any `helpers/` folder to `utils/`. Split a `helpers.ts` grab-bag file into one folder per function.
- Fix the imports: `@/utilities` → `@/utils`, `./utilities` → `./utils`.

**How to check:** `find . -type d \( -name utilities -o -name helpers \) -not -path "*/node_modules/*"` finds nothing, and `grep -rn "utilities\"" --exclude-dir=node_modules .` finds no imports.

### 6. Components live where they are used: no feature folders

**Why:** Grouping by feature and grouping by page meant two places for the same component. Now there is one rule. See [Where components live](/docs/Structure/folder-structure#-where-components-live).

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

**Why:** Some short names are words, not abbreviations. The [Dictionary](/docs/Standards/human-readable-names#dictionary) is the one list of them, so nobody has to guess.

**What to do:**

- The Dictionary has: `id`, `docs`, `props`, `utils`, `app`, `url`, `api`, `uat`, `pdf`, `html`, `css`, `json`, `readme`.
- Any other short name in the project's own code is written out in full. If one seems like a word, ask for it to be added to the Dictionary; do not just use it.
- Copy the new "Dictionary words stay short" bullet into `AGENTS.md` from the [template](/docs/templates#agents).

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
- Check every word in it against the [Ontology](/docs/ontology). If the project gives a code word a different meaning, remove that entry and use the code standards' meaning. Tell a person what changed.
- Make the project's ontology say that it adds to the code standards' ontology.
- Update the "Ontology" section of `AGENTS.md` from the [template](/docs/templates#agents). It now points to both ontologies.

**How to check:** No term in `docs/product/ontology.md` is also defined in the code standards' [Ontology](/docs/ontology).

### 11. Whether agents may commit is the project's choice

**Why:** Strict no commit is right for most projects, but a tool built to ship code with AI, such as Launchpad, needs agents to commit.

**What to do:** This is standard 22 in the list from change 2. If the person kept it, keep the template's "NEVER COMMIT CODE" lines for strict no commit. Otherwise, replace them with the project's own rule, saying exactly which agents may commit, push and open Pull Requests, and when. See [A project can choose otherwise](/docs/Standards/agent-specs#project-workflow).

**How to check:** The top of `AGENTS.md` states the project's commit rule.

### 12. The live standards site

**Why:** The standards now have a real address: https://activatus-code-standards.vercel.app

**What to do:** Replace `[code standards site URL]` in `AGENTS.md` and `docs/development/coding-standards.md` with https://activatus-code-standards.vercel.app

**How to check:** `grep -rn "code standards site URL" .` finds nothing.

### 13. This Version History

**What to do:** Add `**Code standards version:** 2` to `AGENTS.md`, under "Code standards".

### No action needed

- The [Setup](/docs/Guides/setup) guide is written for the agent: install the package, check the version, agree the standards, apply them. It never asks which framework the project uses, and never creates the app: the person does that.
- The [migration guide](/docs/Guides/migrating#stage-4--names) has a Names stage.

---

## Version 1

**Released:** 2026-10-15

The first numbered version: everything in the standards on this date. It included `documentation/` for the docs folder, `Properties` at the end of prop types, `utilities/` for reusable functions, `components/features/`, and the Component Reference. Version 2 replaced all five.

**What to do in a project:** follow the [migration guide](/docs/Guides/migrating) for everything.
