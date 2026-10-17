---
sidebar_position: 2
sidebar_label: "Setup"
---

# Setting Up a Project

> For the AI agent. A person has told you to follow the Activatus Code Standards in their project. This is everything you do, in order.

The person creates the app themselves — with `create-next-app`, Expo or anything else — and tells you to follow the standards. **Do not ask which framework the project uses.** Look at the project: its `package.json` and files tell you. The person only answers the questions below and checks your work. They never run a command.

**These standards are the base, for code only.** A project builds on top of them: it can add its own folders and conventions, and it makes its own project-management decisions (tickets, statuses, releases, who commits). Those go in the project's own docs, not here.

## 1. Install the standards

```bash
pnpm add -D @activatus/code-standards
```

**If pnpm refuses because the version is too new**, that is pnpm's `minimumReleaseAge` setting: by default it will not install a version published less than a day ago. The standards come from us, so add the package to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`:

```yaml title="pnpm-workspace.yaml"
minimumReleaseAgeExclude:
  - "@activatus/code-standards"
```

The standards are now in `node_modules/@activatus/code-standards/`:

| Folder                    | What it holds                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `docs/`                   | Every standard, as Markdown. The same pages as https://activatus-code-standards.vercel.app |
| `docs/version-history.md` | What changed in each version, and what a project has to do about it                        |
| `static/templates/`       | The config files to copy: `AGENTS.md`, ESLint, Prettier, Stylelint and the rest            |

**Read the standards from `node_modules`, not the website.** The installed package is the exact version the project uses. The package version is the standards version: `2.0.0` is version 2.

## 2. Work out where the project is

Open the project's `AGENTS.md` and look for `**Code standards version:**`.

| What you find                                | What it means                        | Go to                                                       |
| -------------------------------------------- | ------------------------------------ | ----------------------------------------------------------- |
| No `AGENTS.md`, or no code standards version | The standards have never been set up | [3. Agree the standards](#3-agree-the-standards)            |
| A version lower than the installed package   | The project follows an older version | [Updating to a newer version](#updating-to-a-newer-version) |
| The same version as the installed package    | Already up to date                   | Nothing to do. Tell the person                              |

## 3. Agree the standards

**Print this list to the person exactly as it is written**, with the same numbers, so they can answer with numbers:

```text
These are the Activatus Code Standards. Want anything different?
Tell me the numbers to skip or change, or say "all good".

 1. Human-readable names: every name is whole words, using the Dictionary
 2. Readable code: files under 300 lines, one job per function, one parameter, return early, no magic numbers
 3. Arrow functions and const only, named exports, no classes
 4. Every function and component has a test file
 5. Strict TypeScript: no any, no !, no unexplained as; type names end in Props or Type
 6. ESLint, with the standard config
 7. Prettier, with the Tailwind class-sorting plugin
 8. Stylelint, for any hand-written CSS
 9. EditorConfig
10. Node version set by .nvmrc and direnv
11. Styling: Tailwind, flexbox first, colours only from the global palette
12. Folder structure: folders at the project root; reusable helper functions in utils/ (no business rules, no outside calls)
13. Components live where they are used: components/ui/, components/shared/, or beside their page
14. Component files in a fixed order, with index.ts exports, and server and client code in separate files
15. Design System Components: every project builds the standard components with the same props
16. Imports: no circular imports, import from folders not files
17. API routes: one folder per route, kebab-case
18. Docs: every file in docs/ is a Decision Doc, shown at /docs by the docs site
19. Removed in version 3: commit messages are the project's own workflow
20. Removed in version 3: branch names are the project's own workflow
21. AGENTS.md and the eight agent skills
22. Removed in version 3: whether agents commit is the project's own workflow
23. The Ontology: the shared words for code
```

Then wait for the answer.

**The numbers never change.** A project records its choices by number, so the numbers stay put:

- **A number is never reused.** A removed standard keeps its number in the list, marked "Removed in version N", so a project's old choices still point at the right thing.
- **A new standard takes the number of the standard it sits closest to, plus a decimal:** a new styling standard after 11 is 11.1, then 11.2, up to 11.9. The list stays short, and nothing after it moves.
- **A removed decimal standard keeps its number too**, marked the same way: `11.2. Removed in version N`.
- **Skip the removed ones** when applying the standards. There is nothing to do for them.

| The person says                         | Do                            |
| --------------------------------------- | ----------------------------- |
| "All good"                              | Apply every standard          |
| "Skip 7"                                | Apply every standard except 7 |
| "Change 7: we use Biome for formatting" | Apply 7 as they describe it   |
| Something unclear                       | Ask. Do not guess             |

**Record the answer** in `docs/development/coding-standards.md`, under "Details". For each skipped or changed standard, write its number, its name, what is different, and the reason the person gave. If nothing is different, write "No differences". Copy the file from `static/templates/docs/development/coding-standards.md` if it does not exist.

The list has nothing about branches, commit messages or whether agents may commit. Those are the project's own workflow. Ask the person how they work, and write it in the "Project workflow" section of `AGENTS.md`. See [Project workflow](/Standards/agent-specs#project-workflow).

## 4. Apply the standards

Do only the standards the person agreed to. Copy every file from `node_modules/@activatus/code-standards/static/templates/` — never write a config file from scratch.

**Every config file is `.mjs`, even in a TypeScript project.** Never convert one to `.ts` or `.mts`. `.mjs` works in both, so every project looks the same. If the project has a config as `.js`, `.ts` or `.mts`, such as `next.config.ts` from `create-next-app` or `vitest.config.mts`, rename it to `.mjs`, removing any TypeScript-only syntax: a type annotation becomes a JSDoc comment, for example `/** @type {import("next").NextConfig} */`. A tool that cannot read `.mjs` keeps its own format.

**An existing project with code already in it** also needs its code brought up to the standards. Do that with [Migrating an Existing Project](/Guides/migrating), one stage at a time, after the config files below are in place.

| Standard                 | What to set up                                                                                                                                                                                                                                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6. ESLint                | Copy the config for the project's framework from `static/templates/eslint/`: `base`, `typescript`, `react` or `nextjs`. Install the packages listed on the [ESLint page](/Standards/eslint). Add the scripts `"lint": "eslint ."` and `"lint:fix": "eslint . --fix"`                                                 |
| 7. Prettier              | `pnpm add -D prettier prettier-plugin-tailwindcss`. Copy `static/templates/prettier.config.mjs`. Add the scripts `"format": "prettier --write ."` and `"format:check": "prettier --check ."`                                                                                                                         |
| 8. Stylelint             | Only if the project has hand-written CSS or SCSS. Copy the config from `static/templates/stylelint/css/` or `scss/`. See [Stylelint](/Standards/stylelint)                                                                                                                                                           |
| 9. EditorConfig          | Copy `static/templates/.editorconfig`                                                                                                                                                                                                                                                                                |
| 10. Node version         | Copy `static/templates/.nvmrc` and `static/templates/.envrc`. See [direnv + nvm](/Standards/direnv)                                                                                                                                                                                                                  |
| 11. Styling              | Copy `static/templates/globals.css` to `app/globals.css`. Ask the person for the project's colours, and replace the example palette                                                                                                                                                                                  |
| 18. Docs                 | Copy `static/templates/docs/` to `docs/` and `static/templates/docsSite/` to `docsSite/`. Add the `/docs` route from `static/templates/next.config.mjs`. See [Setting it up](/Standards/documentation#-setting-it-up)                                                                                                |
| 21. AGENTS.md and skills | Copy `static/templates/AGENTS.md` to the project root and fill in every `[placeholder]`. If the framework wrote its own `AGENTS.md` (Next.js does), keep any instruction it gives about reading the framework's own docs. Copy `static/templates/skills/` into `.agents/skills/`, and again into `.claude/commands/` |

The other standards are rules for how code is written. There is nothing to install for them: follow them in every change.

**Finish by:**

1. Setting `**Code standards version:**` in `AGENTS.md` to the installed package's major version. See [Finishing a change later](#finishing-a-change-later) if anything is left to do.
2. Running `pnpm lint`, `pnpm format:check` and the tests.
3. Telling the person what you set up, which standards they skipped, and anything only they can do, such as filling in a secret in `.env.local`.

---

## Updating to a newer version

The project already follows the standards, and a newer version is out.

**A patch keeps the same version number.** When only the last number changes, such as 3.0.0 → 3.0.1, the project's version in `AGENTS.md` stays the same, but there may still be work to do. Update the package, then read that version's **Fixes** list and do anything it asks for the project's version. Check it every time the package is updated, even when the version number has not changed.

1. **Note the project's version.** Read `**Code standards version:**` in `AGENTS.md`. This is the version the code follows.
2. **Update the package:**

   ```bash
   pnpm update @activatus/code-standards --latest
   ```

   Its major version is now the newest version.

3. **Read `node_modules/@activatus/code-standards/docs/version-history.md`**, but only the versions newer than the project's. Do not re-read the rest of the standards.
4. **Skip any change to a standard the project opted out of.** The opt-outs are listed in `docs/development/coding-standards.md`.
5. **Do every other change** as its "What to do" says, and run its "How to check" search.
6. **Set `**Code standards version:**`** in `AGENTS.md` to the new version, and tell the person what changed. If a change is being finished later, record it first: see [Finishing a change later](#finishing-a-change-later).

See the [Version History](/version-history) for the full update rules.

---

## Finishing a change later

Sometimes a change is too big for the update, such as switching on the standard ESLint config in a project that never had it. It can be finished later, but **the version number must stay honest**.

1. Set the project's version to the new version anyway.
2. In `docs/development/coding-standards.md`, under **Unfinished changes**, list each change that is not done yet: its version and number, what is left, and where it is being done, if the project tracks that.

   ```md
   ## Unfinished changes

   - Version 2, change 4: the standard ESLint config is not switched on yet. Being done in ACT-120.
   ```

3. When it is finished, remove it from the list.

An agent updating to a later version reads this list first, and finishes or skips those changes before starting the new ones.
