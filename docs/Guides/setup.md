---
sidebar_position: 2
sidebar_label: "Setup"
---

# Setting Up a Project

> For the AI agent. A person has told you to follow the Activatus Code Standards in their project. This is everything you do, in order.

The person creates the app themselves — with `create-next-app`, Expo or anything else — and tells you to follow the standards. **Do not ask which framework the project uses.** Look at the project: its `package.json` and files tell you. The person only answers the questions below and checks your work. They never run a command.

**These standards are the base for code, plus how agents link and report the project's work.** A project builds on top of them: it can add its own folders and conventions, and it makes its own project-management decisions (tickets, releases, branches, commit messages, who commits). Those go in the project's own docs, not here. Step 4 records the project's GitHub repo and Linear project, and offers the optional [status circles](/docs/Standards/working-with-agents#status-circles).

**Setup asks the person two sets of questions. Ask both, every time:**

1. **The standards list** ([step 3](#3-agree-the-standards)).
2. **Working with the agent** ([step 4](#4-working-with-the-agent)): the GitHub repo, the Linear project, the status circles, and whether AI asks before every commit and push.

A person saying "all good" to the standards list has not answered step 4. Ask it next.

**The standards are the project's base.** After setup, never skip, loosen or change a standard on your own: ask the person first. If they agree, record it in `docs/development/coding-standards.md`, under "Details", then make the change. ESLint changes go in `eslint.overrides.mjs`, never in `eslint.config.mjs`. See [Project-specific overrides](/docs/Standards/eslint#project-specific-overrides).

## 1. Install the standards

```bash
pnpm add -D @activatus/code-standards@latest
```

**Always install with `@latest`, never a typed version number.** `package.json` keeps whatever version pnpm writes.

**If pnpm refuses because the version is too new**, that is pnpm's `minimumReleaseAge` setting: by default it will not install a version published less than a day ago. The standards come from us, so add the package to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`:

```yaml title="pnpm-workspace.yaml"
minimumReleaseAgeExclude:
  - "@activatus/code-standards"
```

Newer pnpm versions may add this exclusion for you when you run `pnpm add`. Check the file either way, and add it if it is not there: an update hits the same check when a new version of the standards has only just been published. The entry is the plain package name, with no version. If pnpm wrote one with versions in it, such as `'@activatus/code-standards@3.0.4 || 3.0.5'`, replace it with the plain name: otherwise pnpm adds another version to it on every update.

**Copy `static/templates/.prettierignore`** to the project root, or add its lines to the project's own. pnpm owns `pnpm-workspace.yaml` and rewrites it on every install, with single quotes, so `pnpm format:check` would fail after every update. `AGENTS.md` and the agent skills are copied from the standards and compared word for word by the [standards check](#checking-a-project), so Prettier must leave them alone too:

```text title=".prettierignore"
pnpm-workspace.yaml
AGENTS.md
.agents/skills/
.claude/commands/
```

The standards are now in `node_modules/@activatus/code-standards/`:

| Folder                    | What it holds                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `docs/`                   | Every standard, as Markdown. The same pages as https://activatus-code-standards.vercel.app |
| `docs/version-history.md` | What changed in each version, and what a project has to do about it                        |
| `static/templates/`       | The config files to copy: `AGENTS.md`, ESLint, Prettier, Stylelint and the rest            |

**Read the standards from `node_modules`, not the website.** The installed package is the exact version the project uses. The package version is the standards version, and a project records it in full: `3.2.2`.

## 2. Work out where the project is

Open the project's `AGENTS.md` and look for `**Code standards version:**`.

| What you find                                | What it means                        | Go to                                                       |
| -------------------------------------------- | ------------------------------------ | ----------------------------------------------------------- |
| No `AGENTS.md`, or no code standards version | The standards have never been set up | [3. Agree the standards](#3-agree-the-standards)            |
| A version lower than the installed package   | The project follows an older version | [Updating to a newer version](#updating-to-a-newer-version) |
| The same version as the installed package    | Already on this version              | [Already on this version](#already-on-this-version)         |

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
12.1. Constants: r for every link and s for every piece of text, in lib/constants/; other values stay with the code that uses them until they are shared
13. Components live where they are used: components/ui/, components/layout/, components/shared/, or beside their page
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

**Record the answer** in `docs/development/coding-standards.md`, under "Details". For each skipped or changed standard, write one line with its number and name from the list, then what is different and the reason the person gave. An exception that covers only some files names them, in backticks, after `for`:

```text
- 7. Prettier — skipped: the project uses Biome for formatting (2026-10-23).
- 4. Every function and component has a test file — changed for `app/api/**`: legacy routes, tested when each is replaced (2026-10-27).
```

**Every path after `for` goes in backticks**: a `for` with none fails the check, because it would otherwise cover every file. **Start no other line under "Details" with a number.** The [standards check](#checking-a-project) reads a line that starts with a number as an exception to that standard, and fails on one it cannot read. Use bullet points for anything else. If nothing is different, write "No differences". Copy the file from `static/templates/docs/development/coding-standards.md` if it does not exist.

The list has nothing about branches or commit messages. Those are the project's own workflow. Ask the person how they work, and write it in the "Project workflow" section of `AGENTS.md`. See [Project workflow](/docs/Standards/agent-specs#project-workflow).

**Then go straight to step 4.** Setup is not finished until the person has answered it.

## 4. Working with the agent

Do this step every time, straight after step 3. Once the standards are agreed, offer the five [Working with Agents](/docs/Standards/working-with-agents) options. All five are optional: offer every one, every time, so the person can fill them in quickly and keep going.

First the **project links**. Find each one yourself, then ask the person to confirm it or say "None":

- **GitHub repo:** read it with `git remote get-url origin`. If there is no remote, ask for it.
- **Linear project:** read it from the project's own docs if they name it: the workspace, the team (its key is the ticket prefix, such as `ACT`) and the project. If they do not, ask. Never copy it from another project.

Then the **status circles**. **Print this to the person exactly as it is written**:

```text
Status circles (optional). Want the agent to report each
ticket as one line, with a circle that says if you need to act?

 ✅ done  🟢 Pull Request to review  🟣 working on it
 🟡 ready to commit  🟠 waiting  🔴 blocked or you act
 ⚪ not started

Yes or no?
```

Then **ask before committing**. **Print this to the person exactly as it is written**:

```text
Would you like AI to ask you before every commit and push
to git? Yes or no?
```

Then **told about decisions**. **Print this to the person exactly as it is written**:

```text
Would you like AI to tell you about each coding decision
it makes that the code standards do not cover? Yes or no?
```

**Record the answers** in the "Project workflow" section of `AGENTS.md`, from the template: each link they confirmed, and the status circles if they said yes. Delete the line for any link they said "None" to, and the status circles section if they said no. If they said yes to asking before committing, write under **Who commits**: "Ask the person before every commit and push, and wait for a clear yes to that specific action. A yes covers one action only." If they said no, write nothing about it: the agent uses its own judgement. If they said yes to being told about decisions, write under **Decisions**: "Tell the person about each coding decision you make that the code standards do not cover, in the summary at the end of the task." If they said no, delete the Decisions line. Write all five answers in `docs/development/coding-standards.md`, under "Details", on one line, so a later update knows not to ask again: `- Working with the agent: GitHub repo [link or None]; Linear project [project or None]; status circles [yes or no]; ask before every commit and push [yes or no]; told about decisions [yes or no] ([date]).` See [Working with Agents](/docs/Standards/working-with-agents).

## 5. Apply the standards

Do only the standards the person agreed to. Copy every file from `node_modules/@activatus/code-standards/static/templates/` — never write a config file from scratch.

**Every config file is `.mjs`, even in a TypeScript project.** Never convert one to `.ts` or `.mts`. `.mjs` works in both, so every project looks the same. If the project has a config as `.js`, `.ts` or `.mts`, such as `next.config.ts` from `create-next-app` or `vitest.config.mts`, rename it to `.mjs`, removing any TypeScript-only syntax: a type annotation becomes a JSDoc comment, for example `/** @type {import("next").NextConfig} */`. A tool that cannot read `.mjs` keeps its own format.

**An existing project with code already in it** also needs its code brought up to the standards. Do that with [Migrating an Existing Project](/docs/Guides/migrating), one stage at a time, after the config files below are in place.

| Standard                 | What to set up                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 6. ESLint                | Copy the config for the project's framework from `static/templates/eslint/`: `base`, `typescript`, `react` or `nextjs`, and copy `static/templates/eslint.overrides.mjs` beside it. Install the packages listed on the [ESLint page](/docs/Standards/eslint). Add the scripts `"lint": "eslint ."` and `"lint:fix": "eslint . --fix"`                                                                        |
| 7. Prettier              | `pnpm add -D prettier prettier-plugin-tailwindcss`. Copy `static/templates/prettier.config.mjs`. Add the `format` and `format:check` scripts exactly as on the [Prettier page](/docs/Standards/prettier#usage)                                                                                                                                                                                               |
| 8. Stylelint             | Only if the project has hand-written CSS or SCSS. Copy the config from `static/templates/stylelint/css/` or `scss/`. See [Stylelint](/docs/Standards/stylelint)                                                                                                                                                                                                                                              |
| 9. EditorConfig          | Copy `static/templates/.editorconfig`                                                                                                                                                                                                                                                                                                                                                                        |
| 10. Node version         | Copy `static/templates/.nvmrc` and `static/templates/.envrc`. See [direnv + nvm](/docs/Standards/direnv)                                                                                                                                                                                                                                                                                                     |
| 11. Styling              | Copy `static/templates/globals.css` to `app/globals.css`. Ask the person for the project's colours, and replace the example palette                                                                                                                                                                                                                                                                          |
| 12.1. Constants          | Create `lib/constants/` with `routes.ts` (`r`), `strings.ts` (`s`) and an `index.ts` that exports them. Create `noData.ts` once the data's shape is decided, and `numbers.ts`, `animation.ts`, `status.ts` and the others once more than one file shares a value. If the project keeps them somewhere else, such as `app/constants/`, move them. See [Constants](/docs/Structure/folder-structure#constants) |
| 18. Docs                 | Copy `static/templates/docs/` to `docs/` and `static/templates/docsSite/` to `docsSite/`. Add the `/docs` route from `static/templates/next.config.mjs`. See [Setting it up](/docs/Standards/documentation#-setting-it-up)                                                                                                                                                                                   |
| 21. AGENTS.md and skills | Copy `static/templates/AGENTS.md` to the project root and fill in every `[placeholder]`. If the framework wrote its own `AGENTS.md` (Next.js does), keep any instruction it gives about reading the framework's own docs. Copy `static/templates/skills/` into `.agents/skills/`, and again into `.claude/commands/`. Add the `standards:check` script: see [Checking a project](#checking-a-project)        |

The other standards are rules for how code is written. There is nothing to install for them: follow them in every change.

**Finish by:**

1. Setting `**Code standards version:**` in `AGENTS.md` to the installed package's full version, such as `3.2.2`. See [Finishing a change later](#finishing-a-change-later) if anything is left to do.
2. Running `pnpm lint`, `pnpm format:check`, the tests and the [standards check](#checking-a-project), and fixing what they find.
3. **Printing this to the person**, filled in, so every project's handover reads the same:

```text
Code standards set up: version [full package version].

Set up:       [the standards applied, by number]
Skipped:      [numbers and reasons, or "None"]
Left to do:   [unfinished changes, or "None"]
Only you can: [secrets in .env.local and the like, or "Nothing"]

Before we start: please review docs/product/ontology.md,
the product's words and how it speaks. Ask me to change
anything that is wrong.
```

---

## Already on this version

The project's `AGENTS.md` has the same full version as the installed package, such as 3.2.2. There are no version changes to make.

1. **Check `docs/development/coding-standards.md`, under "Details",** for the [step 4](#4-working-with-the-agent) answers: the GitHub repo, the Linear project, the status circles, asking before committing and being told about decisions. Ask the person any that are not recorded, and record them as step 4 says.
2. **Run the [standards check](#checking-a-project)**, and fix what it finds.
3. **Tell the person** what you changed, or that the project was already up to date.

---

## Updating to a newer version

The project already follows the standards, and a newer version is out.

**Every new number can ask for work**, whichever part changed. What each part means is in [How versions are numbered](/docs/version-history#how-versions-are-numbered).

1. **Note the project's version.** Read `**Code standards version:**` in `AGENTS.md`. This is the version the code last applied. If it is only a major number, such as `3`, find the full version first: see [Updating a project to a new version](/docs/version-history#updating-a-project-to-a-new-version).
2. **Update the package:**

   ```bash
   pnpm add -D @activatus/code-standards@latest
   ```

   Its version is now the newest. If pnpm refuses because the version is too new, or `pnpm format:check` now fails on `pnpm-workspace.yaml`, see [1. Install the standards](#1-install-the-standards). Check `minimumReleaseAgeExclude` in `pnpm-workspace.yaml` is the plain name, `"@activatus/code-standards"`, with no version in it.

3. **Read `node_modules/@activatus/code-standards/docs/version-history.md`**, but only the entries newer than the project's version. Do not re-read the rest of the standards.
4. **Skip any change to a standard the project opted out of.** The opt-outs are listed in `docs/development/coding-standards.md`.
5. **Do every other change** as its "What to do" says, and run its "How to check" search.
6. **Ask any [step 4](#4-working-with-the-agent) question** whose answer is not recorded in `docs/development/coding-standards.md`, under "Details".
7. **Run the [standards check](#checking-a-project)**, and fix what it finds.
8. **Set `**Code standards version:**`** in `AGENTS.md` to the installed package's full version, and tell the person what changed. If a change is being finished later, record it first: see [Finishing a change later](#finishing-a-change-later).

See the [Version History](/docs/version-history) for the full update rules.

---

## Checking a project

The package ships a script that checks the project against the standards. Add it to the project's `package.json` during setup:

```json
{
	"scripts": {
		"standards:check": "node node_modules/@activatus/code-standards/scripts/verifyStandards/verifyStandards.mjs"
	}
}
```

```bash
pnpm standards:check
```

It reports, and never changes a file. Each finding gives the standard's number and the page to read. It checks:

| Standard | What it checks                                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 21       | `AGENTS.md` has the code standards version and an unchanged Code standards section; the skills match the templates                                                                         |
| 6 to 10  | `eslint.config.mjs`, `prettier.config.mjs`, `stylelint.config.mjs`, `.editorconfig` and `.envrc` match the templates; `eslint.overrides.mjs`, `.nvmrc` and the format scripts are in place |
| 12.1     | `lib/constants/` has `index.ts`, `routes.ts` and `strings.ts`, and no `unsortedValues.ts` is left waiting                                                                                  |
| 13       | `components/` holds only `ui/`, `layout/` and `shared/`, every sub-component sits flat in its root component's `components/` folder, and the homepage is in `app/(homepage)/`              |
| 21       | `docs/development/coding-standards.md` records the five agent answers under "Details", and every numbered line there is a well-formed exception                                            |
| 11       | `docs/design/design-system.md` has a filled-in Colour palette table                                                                                                                        |
| 15       | Every `components/ui/` component is on the Design System Components list, or recorded under "Components for the standards"                                                                 |
| 4        | Every file that exports a function or component has a test file beside it                                                                                                                  |
| 18       | Every doc template is in place, and every doc has one "Group — Menu item" title matching its file name, a Status line, and Decision, Why and Related sections                              |

**It follows the project's own rules, not only the standard ones.** A finding for a standard recorded as skipped or changed in `docs/development/coding-standards.md` is listed as a recorded exception to check by hand, and does not fail the check. An exception that names files covers only those files. A numbered line under "Details" that is not shaped like an exception fails the check, because it would otherwise switch a standard off by accident. The project's ESLint changes live in `eslint.overrides.mjs`, which it never compares. It also lists any Unfinished changes.

**The check is a helper, not the standard.** Passing it does not mean every rule is followed: names, the order inside a component and much more still need reading. And a finding that is wrong for the project is not fixed by bending the code to the script: record the exception in `coding-standards.md`, with the person's yes.

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
