# [Project Name]

> [The project's most important rule for agents, stated first so every agent sees it. Usually whether an agent may commit, push or make branches. One line, or a short section if it needs more, such as which agents may commit, when, and how the others ask. See "Project workflow" below.]

> **"go" means carry on.** When the person sends only "go", carry on with the current task. It is never permission to commit, push or open a Pull Request, and it needs no reply asking what they meant.

## Project overview

[One paragraph: what this project does, who uses it, and why it exists.]

## Repository layout

```text
[Directory tree at depth 2. Regenerate it after structural changes.]
```

## Tech stack

| Layer | Technology | Version |
| --- | --- | --- |
| Framework | [e.g. Next.js (App Router)] | [version] |
| Language | [e.g. TypeScript] | [version] |
| Styling | [e.g. Tailwind CSS] | [version] |
| Database | [database] | [version] |
| Hosting | [hosting platform] | — |

## Essential commands

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Develop | `pnpm dev` |
| Build | `pnpm build` |
| Test | `pnpm test` |
| Lint | `pnpm lint` |
| Format | `pnpm format` |
| Type-check | `pnpm typecheck` |
| Docs site | `pnpm docs:dev` (then open `/docs`) |

## Project workflow

[How this project runs its work. These are the project's own decisions, not part of the code standards. Say where they are written up (usually `docs/development/`), then list the rules an agent must follow:]

- **Who commits**: [whether AI agents may commit, push or make branches, and when. If the person said yes to asking before committing during setup: "Ask the person before every commit and push, and wait for a clear yes to that specific action. A yes covers one action only." If they said no, leave the asking rule out]
- **Decisions**: [Optional. If the person said yes to being told about decisions during setup: "Tell the person about each coding decision you make that the code standards do not cover, in the summary at the end of the task." Delete this line if they said no]
- **Branches**: [how branches are named]
- **Commit messages**: [the commit message format]
- **Pull requests**: [review and CI requirements, and where Pull Requests merge to]
- **Merging and releases**: [merge strategy, and how work reaches production]
- **GitHub repo**: [Optional. https://github.com/organisation/repo, read from the git remote and confirmed with the person. Delete this line if the project does not use it]
- **Linear project**: [Optional. Workspace, team and project, such as `activatus-life`, team `ACT`, project Launchpad. The ticket prefix is the team's key, shared by every project in that team. Read it from the project's docs or asked for, and confirmed with the person. Delete this line if the project does not use Linear]

**Never copy a Linear workspace or ticket prefix from another project.** If the Linear project above is missing, ask before creating, linking or citing any ticket.

### Status circles

[Only if the person chose status circles during setup. Otherwise delete this section.]

Report every ticket or piece of work as one line: a status circle, the ticket ID as a link, a short title and, where there is one, its Pull Request as a link. The colour alone says whether the person needs to act.

| Circle | Means |
| --- | --- |
| ✅ | Merged, In UAT or Done. Nothing to do |
| 🟢 | Pull Request ready for the person to review and merge. The link is the Pull Request |
| 🟣 | Working on it |
| 🟡 | Ready to commit: done, checked, left uncommitted. Say the branch and where it is. The person commits it, or tells the agent to |
| 🟠 | Waiting on another ticket or Pull Request first. Say which |
| 🔴 | Blocked, or the person has to do something. Say what, in a few words |
| ⚪ | Not started (Backlog or Todo) |

Example: `🟢 [ABC-12](https://linear.app/[workspace]/issue/ABC-12) Short title: [#19](https://github.com/[organisation]/[repo]/pull/19)`

- Every ticket ID links to its ticket, and every Pull Request number links to the Pull Request.
- Work with no ticket is just the circle and a short title.
- Only what the person needs to act on. Leave out what they already know.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `[VARIABLE_NAME]` | [Yes / No] | [What it is for] |

<!-- code-standards:start -->

## Code standards

**This section, and the Ontology and Documentation sections after it, are copied from the code standards and replaced on every update.** Never edit it to describe a project exception: record exceptions in `docs/development/coding-standards.md`. Anything else the project adds, such as the block a framework writes, goes outside this section.

This project follows the Activatus Code Standards. They are installed as the `@activatus/code-standards` dev dependency: **read them in `node_modules/@activatus/code-standards/docs/`**, which is the exact version this project uses. The same pages are at https://activatus-code-standards.vercel.app for people.

**Code standards version:** [the full version of the installed `@activatus/code-standards` package when the standards were last applied, such as 3.2.2]

This is the version the code follows, written in full so it pairs with the installed package. When the package is updated, read only the entries newer than this number in `node_modules/@activatus/code-standards/docs/version-history.md`, make the changes they list, then update this number. See "Updating to a newer version" in `docs/Guides/setup.md`.

**The standards are the base, and you build freely from there.** Most of a project's code is something the standards never mention: decide it yourself, and keep the decision the same across the codebase. This covers how the code is built: its structure, names, files and where each value goes. It never covers what the product does, says or shows: those are product decisions, and you ask. Only skipping, loosening or changing a standard needs the person's yes.

**Standards this project skips or changes** are listed, by number, in `docs/development/coding-standards.md`. Follow every other standard.

**The standards are this project's base. Never skip, loosen or change one on your own.** Ask the person first. If they agree, record it in `docs/development/coding-standards.md`, under "Details" (the standard's number and name, what is different, why, and the date), then make the change and keep going. Never stop the work to wait for a new version of the standards. ESLint changes go in `eslint.overrides.mjs` with a comment naming the standard's number. Never edit `eslint.config.mjs`: it is copied from the standards unchanged.

Follow these rules in every change:

- **Every function and component has a test file**, created in the same change. One test file tests one function or one component.
- **No file longer than 300 lines.** Test files are exempt, and so are the files in `lib/constants/`, which hold data only.
- **Every name is made of whole, human-readable words.** Variables, parameters, props, types, constants, form fields, files, folders, routes, database columns, scripts and environment variables — everything. No shortened words, no single letters (except `r` and `s`, below), no numbered names, not even for a loop counter or an event handler. Full rule: Human-Readable Names in the code standards (https://activatus-code-standards.vercel.app/docs/Standards/human-readable-names).

  | Never | Always |
  | --- | --- |
  | `btn`, `msg`, `val`, `(e) =>`, `(item, i) =>` | `button`, `message`, `value`, `(event) =>`, `(item, index) =>` |
  | `deps`, `env`, `timeoutMs`, `MAX_` | `dependencies`, `environment`, `timeoutMilliseconds`, `MAXIMUM_` |
  | `<T>`, `"sm" \| "lg"` | `<ItemType>`, `"small" \| "large"` |
  | `name="email1"` | `name="emailAddress"` |
  | `helpers/`, `utilities/`, `helpers.ts` | `utils/`, a file named after what it does |

- **`id` is a word.** Write `id`, `userId`, `user_id` — never `identifier` and never `userID`. `identifier` is only for an outside system's separate field of that name (Linear's readable `ACT-73`).
- **Dictionary words stay short:** `id`, `docs`, `lib`, `props`, `ref`, `repo`, `utils`, `app`, `url`, `api`, `uat`, `pdf`, `html`, `css`, `json`, `readme`. Case them as words: `imageUrl`, not `imageURL`. Any other short name is written in full. A new dictionary word is added to the Dictionary in the Human-Readable Names standard first (https://activatus-code-standards.vercel.app/docs/Standards/human-readable-names#dictionary), never just used.
- **Names owned by someone else stay exactly as they are** — Linear's `id` and `pageInfo`, Node's `cwd` option and `process.env`, React's `ref` and `children`, shadcn/ui's `cn` helper, Next.js's `params`, `searchParams` and `LayoutProps`, HTML attributes, Tailwind classes. The rule is for names we write, not names from someone else's code. Renaming them breaks the code. Give the value a full-word name as soon as it comes into our code: `const workingDirectory = process.cwd();`, then pass `{ cwd: workingDirectory }`.
- **When a name clashes with a third-party import, rename our own thing first**, to a more specific full-word name: our `createProjectDatabaseClient`, next to Supabase's `createClient`. Rename the import only when both names are third-party, or ours is fixed by a framework (a Next.js route's `GET`). Then use the owner plus the original name, `Link as LucideLinkIcon`. Never rename an import for taste, and never shorten it.
- **Form fields especially.** A field has one name everywhere it goes: the input's `name` and `id`, the form schema, the API request, the type and the database column (`emailAddress` / `email_address`). Every field has a visible `<label>` in plain English — never a placeholder instead. Option values are words (`"monthly"`), not numbers. Validation messages name the field and say what to do.
- **The linter only checks some names.** Folders, props, form fields, database columns, routes and environment variables are not linted — check every one of them yourself.
- **Always `const`.** Never `var`. Use `let` only when a value must be reassigned, with `// eslint-disable-next-line no-restricted-syntax -- <reason>` on the line above.
- **Arrow functions everywhere.** Never use the `function` keyword: `export const Button = () => {}`, not `export function Button() {}`.
- **Never sort imports by hand.** Prettier sorts them on `pnpm format`. Side-effect imports, such as CSS, go after every other import.
- **Import components from their category:** `import { Button } from "@/components/ui";`. There is no `components/index.ts`. A category's `index.ts` exports only components a Client Component can import: a component that reaches server-only code starts with `import "server-only";`, is left out of it, and is imported from its own folder, such as `@/components/layout/siteHeader`.
- **No circular imports, ever.** A file never imports a file that imports it back. Inside a folder, import files directly — never through the folder's own `index.ts` — and never import a parent component from its sub-component.
- **Define before use.** A function or variable is written above the code that uses it.
- **A function does one thing.**
- **Functions, never classes.**
- **One parameter per function.** Use a single object when more than one value is needed.
- **Return early.** Never nest more than three levels deep.
- **No magic numbers or strings.** Use named constants. Only `-1`, `0` and `1` stay bare. Put the unit in the name: `SESSION_TIMEOUT_MILLISECONDS`. Config files keep their numbers at the top of the file.
- **Links go in `r` and text people see or hear goes in `s`**, both in `lib/constants/`, never written straight into a component. The keys of `s` become the translation keys when the site gets more languages. **Every other value lives with the code that uses it until it is shared:** a number, list, status or internal string (ids, keys, event names, log messages) one file uses is a named constant at the top of that file. Once more than one file needs it, it moves to the file in `lib/constants/` that fits, such as `numbers.ts`, `animation.ts`, `classNames.ts` or `status.ts`, or a new file named after what it holds. Stand-in data for local development goes in `noData.ts`, named `NO_DATA_` plus the thing it replaces. **Not sure where a value goes?** Put it in `lib/constants/unsortedValues.ts` and carry on. At the end of the work, ask the person where each value in it goes, move each one there, and delete the file. Constants in `lib/constants/` get real types from `lib/types/`, never `as const`. No `"#"` placeholder links: show plain text with a `{/* TODO: … */}` until the page exists. `r` and `s` are the only single-letter names allowed anywhere. Import constants in one line: `import { r, s } from "@/lib/constants";`. Full rule: https://activatus-code-standards.vercel.app/docs/Structure/folder-structure#constants
- **No nested ternaries. No boolean flag parameters.**
- **No `any`, no non-null `!`, no `as` cast without a comment saying why.**
- **Named exports only**, except where a tool requires a default export.
- **Type names end in `Props` or `Type`**, and say what the thing is, not the job it does. A type that only describes one field of a function's props is written inside the `Props`: `StartAgentRunProps` holds its `dependencies`, with no separate `StartAgentRunDependenciesType`. Every function still has its own `Props` for its single object parameter, such as `LaunchSessionProps` for `launchSession`, used wherever that function is written: `async ({ worktreePath }: LaunchSessionProps) =>`. Type a value where it is declared, never afterwards with `satisfies`, and never `as const`: when the code needs exact values, put them in the type. A constant's list type is `readonly`. The one exception is Storybook story files, which follow Storybook's docs: `satisfies Meta<typeof Component>`.
- **One component per file.** Server and client components live in separate files.
- **A component's children sit flat in its own `components/` folder**, `accordion/components/item/` and `accordion/components/ctaArrow/`, even when one child is only used by another. Never a `components/` folder inside a child: two levels at most.
- **Component file order**: imports, component, variables, state, `useMemo` values, `useCallback` functions, effects, render. No inline functions in render.
- **Reusable functions live in a `utils/` folder** — global, section or component level — one folder per function, with an `index.ts`. A function that sorts, finds, gets, filters or formats the data passed to it goes in a `utils/` folder the first time it is written. Move a function up a level when a second user needs it.
- **Components live where they are used:** Design System Components in `components/ui/`, plus any props-only component not on the list yet, recorded under "Components for the standards" in `docs/development/coding-standards.md`; the site frame (navigation, header, footer) in `components/layout/`; the homepage's components in `app/(homepage)/components/`; components used on three or more pages in `components/shared/`; components used by three or more pages in one section in that section's route group (`app/(billing)/components/`); everything else in its page's `components/` folder. Start a new component beside its page. When a second page needs it, copy it there: one copy only, and each copy has a comment naming the other. When a third page needs it, merge the copies into one shared component, with props designed from all three uses. No `components/features/` folder.
- **Code file names are camelCase**; component files are PascalCase. **Anything that becomes a URL is kebab-case**: route folders and documentation folders and files (`docs/architecture/background-jobs.md`). CSS variables are kebab-case too.
- **Lay out with flexbox first**, and split layouts into child components. Only use CSS grid when specifically asked.
- **Style with Tailwind.** Colours come from the global colour palette in `app/globals.css` only — never a hard-coded or arbitrary colour. The design decisions are in `docs/design/design-system.md`.
- **Comments explain why, not what.** Never leave commented-out code. Mark unfinished work with `// TODO: Message` (`{/* TODO: Message */}` in JSX).
- **Error messages say what happened and what to do.**

**Third-party code is exempt.** Code in `node_modules/` and `vendor/` belongs to someone else: do not lint it, do not reformat it, do not edit it to meet these rules.

**shadcn components are not third-party.** Code the shadcn CLI copies into the project is ours. Convert it to these standards in the same change that adds it — its own camelCase folder, one component per file, `types.ts`, `index.ts` and a test — keep only the parts that are used, and never put it in `vendor/`. **Do not change a component's props or behaviour** — only its styling. Components work identically in every Activatus project.

**Look before you build a component.** Check the project's `components/ui/`, then the Design System Components in the code standards, then other Activatus projects, then shadcn. Build to the props listed in the Design System Components; never invent new prop names for a component that is already listed. A component in `components/ui/` takes everything through props and never imports from features, services, stores or `app/`.

**Lint must pass before you finish.** Run `pnpm lint` and `pnpm test` before finishing any task, and fix every error by changing the code. After setting up or updating the standards, also run `pnpm standards:check`.

**Never switch a lint rule off to make an error go away.** Do not add `eslint-disable` comments, edit `eslint.config.mjs` or `eslint.overrides.mjs`, or move files to hide them. The only exceptions are `let`, a type cast and an `as const` that cannot be avoided, each on a single line with a reason after ` -- `. If a rule seems impossible to satisfy, stop and ask.

When you report a lint error to the person, explain it in plain English: what is wrong, why it matters, and what you did to fix it.

## Ontology

Activatus uses a fixed vocabulary, the ontology, in two parts:

- **Code words** — component, utils, Decision Doc and the rest — are defined in the code standards: https://activatus-code-standards.vercel.app/docs/ontology
- **Product words** — what this project builds and how its work is planned — are defined in `docs/product/ontology.md`.

- **Read both before starting work.** If the project's ontology gives a code word a different meaning, the code standards win — point the difference out.
- **Use their terms** in code, docs, database names and messages — never a synonym. It is `utils`, not `helpers` or `utilities`.
- **Never use a term either ontology has removed.**
- If a person uses a word loosely, work out which ontology term they mean and use that term. **If you are not sure what a term means, ask.** Do not guess and do not invent a new term.

## Documentation

The project's docs are plain Markdown in `docs/`. **Every file is a Decision Doc**: it states one decision and why it was made.

- **Read them before starting work** — the three docs in `docs/overview/` first, then the docs for the area being changed. Read the files directly; do not start the docs site to read them.
- **Check each doc's Status.** `Decided` is settled. `Current plan` may change. `Under evaluation` and `Not started` are **not decisions** — do not treat them as one and do not invent one. Ask.
- **Never invent a product decision to unblock yourself.** If the docs do not answer it, stop and ask.
- **Record a check only after it has run.** Never write a URL, commit, date or "passed" for a check that has not happened yet. Write what was decided, and add the result once it exists.
- **Update the docs in the same change.** If a change makes a doc wrong, fix the doc and change its Updated date.
- If the project has a `docsSite/`, do not edit it unless the task is about the docs viewer itself.

<!-- code-standards:end -->

## Available skills

Skill files live in `.agents/skills/`, mirrored to `.claude/commands/`.

| Skill | Invocation | What it does |
| --- | --- | --- |
| Lint | `/lint [path]` | Runs the linters in check-only mode and reports issues |
| Lint & fix | `/lintFix [path]` | Auto-fixes lint and formatting issues, then reports |
| Format | `/format [path]` | Formats files with Prettier |
| Code review | `/codeReview [branch, commit or path]` | Reviews changes for bugs and standards compliance |
| Update layout | `/updateLayout` | Regenerates the "Repository layout" section of this file |
| Security audit | `/securityAudit [path]` | Audits the code for common security problems |
| TypeScript | `/typescript [path]` | Tightens loose types and removes unsafe assertions |
| Test | `/test [path]` | Runs the tests and reports failures and missing tests |

## Out of scope for AI agents

- Do not write secrets, tokens or `.env` values into any file.
- Do not change dependencies or lockfiles unless the task requires it.
- Do not edit generated files, or third-party code in `node_modules/` or `vendor/`.
- [Add any other forbidden actions.]
