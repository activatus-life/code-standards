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
5. **One pull request per kind of change** (for example, all the folder renames together), so each one stays easy to review. Follow the project's commit rule in `AGENTS.md`.
6. **Run `pnpm lint`, `pnpm test` and the build** after each change.
7. **Update the version number** in `AGENTS.md` once every change is done.

**When a change does not fit the project**, for example it renames a folder the project does not have, skip it. If you are not sure, ask; do not guess.

## Adding a version

Anyone changing the standards adds a version, in the same pull request as the change:

- **One version per change that reaches `main`**, numbered one higher than the last. Whole numbers only.
- **Bump the package's major version to match** in `package.json`: version 3 is `3.0.0`. Then publish it to npm (npmjs.com) with `pnpm publish`. pnpm is the tool; npm is where the package lives, and projects install it from there with `pnpm add`.
- **For every change, write:** what changed, why, what to do in a project, and how to check it is done. Write it for an agent that has not read the rest of the standards.
- **If a project has nothing to do, say so.**
- **Newest version at the top.**

---

## Version 3 — not released yet

**Not published to npm yet.** These changes are on the live site, and will be released together as version 3. Until then, projects stay on version 2: do not apply anything below.

### 1. Branches are named after their ticket

**Why:** Every task has a ticket. Naming the branch after the ticket links the ticket, the branch and the Pull Request automatically, in Linear and GitHub.

**What to do:**

- Name every new branch for ticket work `<TICKET-ID>-<short-title>`, such as `ACT-14-invoice-export`. No type in front: the type goes in the commit message.
- Use `type/short-description` only for work with no ticket, such as `docs/update-readme`. Use the Conventional Commits types: `feat`, never `feature`.
- Update the "Branches" line in `AGENTS.md` from the [template](/templates#agents).
- Do not rename existing branches.

**How to check:** The "Branches" line in `AGENTS.md` shows `ACT-14-invoice-export`. If the project already names branches this way, there is nothing else to do.

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
- Rename `docs/overview/writing-documentation.md` → `docs/overview/writing-docs.md`, and fix every link to it.
- Rename the environment variable `DOCUMENTATION_URL` → `DOCS_URL` in `next.config.mjs`, `.env.local`, `.env.example` and the hosting provider's settings.
- Rename the route `/documentation` → `/docs`. Copy the new rewrite from the [`next.config.mjs` template](/templates#docs-route).
- In `docsSite/docusaurus.config.ts`, set `baseUrl: '/docs/'` and `path: '../docs'`. Copy the [`docsSite/` template](/templates#docs-site) if unsure.
- Rename the scripts in `package.json`: `documentation:install` → `docs:install`, `documentation:dev` → `docs:dev`, `documentation:build` → `docs:build`.
- Update every mention in `AGENTS.md`, `README.md` and the docs themselves.

**How to check:** `grep -rn "documentation/\|documentationSite\|DOCUMENTATION_URL\|documentation:" --exclude-dir=node_modules .` finds nothing. Normal sentences that say "documentation" are fine.

### 4. `props` is a dictionary word: prop types end in `Props`

**Why:** `props` is the word every React developer uses. `properties` is harder to read.

**What to do:**

- Rename every type ending in `Properties` to end in `Props`: `ButtonProperties` → `ButtonProps`. Use the editor's Rename Symbol (F2), not find-and-replace.
- Rename variables and parameters called `properties` to `props`, including spreads: `...buttonProperties` → `...buttonProps`.
- Copy the new [ESLint config](/Standards/eslint). Two things changed in it:
  - The type-name rule is now `(Props|Type)$`.
  - `unicorn/name-replacements` now has `replacements: { docs: false, props: false, utils: false }`.

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

**What to do:** This is standard 22 in the list from change 2. If the person kept it, keep the template's "NEVER COMMIT CODE" lines for strict no commit. Otherwise, replace them with the project's own rule, saying exactly which agents may commit, push and open Pull Requests, and when. See [A project can choose otherwise](/Standards/agent-specs#a-project-can-choose-otherwise).

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
