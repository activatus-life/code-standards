# [Project Name]

> **NEVER COMMIT CODE.** Do not run `git commit`, `git push`, `git merge`, `git rebase` or `git stash`, and do not create, switch or delete branches. Make the changes, leave them uncommitted in the working tree, and tell the person what you changed. A person reviews and commits every change.

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

## Development workflow

- **Branches**: `<type>/<short-description>` in kebab-case, e.g. `feat/invoice-export`, `fix/login-redirect-loop`. Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`. Never work directly on `main`.
- **Commits**: Conventional Commits (`feat: add invoice export`). **People commit — AI agents never do.**
- **Pull requests**: [review and CI requirements]
- **Merging**: [merge strategy, e.g. squash and merge]

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `[VARIABLE_NAME]` | [Yes / No] | [What it is for] |

## Documentation

The project's docs are plain Markdown in `docs/`. **Read them before starting work** — `docs/index.md` first, then the scope and design docs for the area being changed. Read the files directly; do not start the docs site to read them.

| Folder | Holds |
| --- | --- |
| `docs/scope/` | What is being built, and what is not |
| `docs/design/` | How it is built |
| `docs/decisions/` | Why it is built that way — one file per decision |
| `docs/guides/` | How to run it, deploy it and fix it |

Do not edit `docsSite/` unless the task is about the docs viewer itself.

## Code standards

This project follows the Activatus Code Standards: [code standards site URL]

[If the project keeps a local copy, add: "A local copy is in `docs/standards/`."]

Follow these rules in every change:

- **Every function and component has a test file**, created in the same change. One test file tests one function or one component.
- **No file longer than 300 lines** (test files are exempt).
- **Names are full English words.** No shorthand such as `btn`, `e` or `acc`.
- **Always `const`.** Never `var`. Use `let` only when a value must be reassigned, with `// eslint-disable-next-line no-restricted-syntax -- <reason>` on the line above.
- **Arrow functions everywhere.** Never use the `function` keyword: `export const Button = () => {}`, not `export function Button() {}`.
- **No circular imports, ever.** A file never imports a file that imports it back. Inside a folder, import files directly — never through the folder's own `index.ts` — and never import a parent component from its sub-component.
- **Define before use.** A function or variable is written above the code that uses it.
- **A function does one thing.**
- **Functions, never classes.**
- **One parameter per function.** Use a single object when more than one value is needed.
- **Return early.** Never nest more than three levels deep.
- **No magic numbers or strings.** Use named constants.
- **No nested ternaries. No boolean flag parameters.**
- **No `any`, no non-null `!`, no `as` cast without a comment saying why.**
- **Named exports only**, except where a tool requires a default export.
- **Type names end in `Props` or `Type`.**
- **One component per file.** Server and client components live in separate files.
- **Component file order**: imports, component, variables, state, `useMemo` values, `useCallback` functions, effects, render. No inline functions in render.
- **Reusable functions live in a `utils/` folder** — global, feature or component level — one folder per function, with an `index.ts`.
- **Code file names are camelCase**; component files are PascalCase. **Anything that becomes a URL is kebab-case**: route folders and documentation files (`docs/scope/project-scope.md`). CSS variables are kebab-case too.
- **Lay out with flexbox first**, and split layouts into child components. Only use CSS grid when specifically asked.
- **Style with Tailwind.** Colours come from the global colour palette only — never a hard-coded or arbitrary colour.
- **Update the docs in the same change.** If a change makes a doc in `docs/` wrong, fix the doc. Record significant choices as a decision record in `docs/decisions/`.
- **Comments explain why, not what.** Never leave commented-out code.
- **Error messages say what happened and what to do.**

**Third-party code is exempt.** Code in `node_modules/` and `vendor/` belongs to someone else: do not lint it, do not reformat it, do not edit it to meet these rules.

**shadcn components are not third-party.** Code the shadcn CLI copies into the project is ours. Convert it to these standards in the same change that adds it — its own camelCase folder, one component per file, `types.ts`, `index.ts` and a test — keep only the parts that are used, and never put it in `vendor/`. **Do not change a component's props or behaviour** — only its styling. Components work identically in every Activatus project.

**Look before you build a component.** Check the project's `components/ui/`, then the Component Reference in the code standards, then other Activatus projects, then shadcn. Build to the props listed in the Component Reference; never invent new prop names for a component that is already listed. A component in `components/ui/` takes everything through props and never imports from features, services, stores or `app/`.

**Lint must pass before you finish.** Run `pnpm lint` and `pnpm test` before finishing any task, and fix every error by changing the code.

**Never switch a lint rule off to make an error go away.** Do not add `eslint-disable` comments, edit the ESLint config, or move files to hide them. The only exceptions are `let` and a type cast, each on a single line with a reason after ` -- `. If a rule seems impossible to satisfy, stop and ask.

When you report a lint error to the person, explain it in plain English: what is wrong, why it matters, and what you did to fix it.

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

- **Never commit code.** No `git commit`, `git push`, `git merge`, `git rebase` or `git stash`. Leave every change uncommitted for a person to review.
- Do not create, switch or delete branches.
- Do not write secrets, tokens or `.env` values into any file.
- Do not change dependencies or lockfiles unless the task requires it.
- Do not edit generated files, or third-party code in `node_modules/` or `vendor/`.
- [Add any other forbidden actions.]
