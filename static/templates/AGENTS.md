# [Project Name]

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

## Development workflow

- **Branches**: [branch naming pattern, e.g. `feature/short-description`]
- **Commits**: Conventional Commits (`feat: add invoice export`)
- **Pull requests**: [review and CI requirements]
- **Merging**: [merge strategy, e.g. squash and merge]

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `[VARIABLE_NAME]` | [Yes / No] | [What it is for] |

## Code standards

This project follows the Activatus Code Standards: [code standards site URL]

[If the project keeps a local copy, add: "A local copy is in `docs/standards/`."]

Follow these rules in every change:

- **Every function and component has a test file**, created in the same change. One test file tests one function or one component.
- **No file longer than 300 lines** (test files are exempt).
- **Names are full English words.** No shorthand such as `btn`, `e` or `acc`.
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
- **File names are camelCase**; component files are PascalCase; CSS variables are kebab-case.
- **Lay out with flexbox first**, and split layouts into child components. Only use CSS grid when specifically asked.
- **Style with Tailwind.** Colours come from the global colour palette only — never a hard-coded or arbitrary colour.
- **Comments explain why, not what.** Never leave commented-out code.
- **Error messages say what happened and what to do.**

Run `pnpm lint` and `pnpm test` before finishing any task.

## Available skills

| Skill | Invocation | What it does |
| --- | --- | --- |
| [Skill name] | `/[name]` | [What it does] |

## Out of scope for AI agents

- Do not push to `main` or force-push any branch.
- Do not commit secrets, tokens or `.env` files.
- Do not change dependencies or lockfiles unless the task requires it.
- Do not edit generated files.
- [Add any other forbidden actions.]
