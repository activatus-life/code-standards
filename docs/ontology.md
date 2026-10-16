---
sidebar_position: 1.5
sidebar_label: "Ontology"
---

# Ontology

> The words these standards use about code, and exactly what each one means.

**Status:** Decided · **Updated:** 2026-10-15

**This page is the source of truth for every word about code.** Every Activatus project uses these terms, with these meanings, in docs, code, prompts and reviews.

An ontology is a shared vocabulary. When a person or an agent says "component", "utils" or "Decision Doc", this page is what they mean. Nobody has to guess, and nobody invents a second word for the same thing.

## Code words and product words

This page only holds **code words**: how code is written, named, tested, documented and reviewed.

**Product words live in each project's own ontology**, in `docs/product/ontology.md`: the words for what that project builds and how its team plans the work. **Project-management words live there too**: project, feature, ticket, branch, commit, Pull Request, release. Every project defines those for itself. Launchpad's Draft Ticket, Pitch and UAT are product words, so they are in Launchpad's ontology, not here.

|              | Code words                                               | Product words                                       |
| ------------ | -------------------------------------------------------- | --------------------------------------------------- |
| **Kept in**  | This page                                                | The project's `docs/product/ontology.md`            |
| **Covers**   | Writing, naming, testing, documenting and reviewing code | What the project builds and how its work is planned |
| **Examples** | component, utils, Decision Doc, dictionary word          | Launchpad's Draft Ticket, Pitch, UAT                |

**A project's ontology pulls in this page. It never redefines a code word.** If a project's ontology gives a word on this page a different meaning, this page wins. Point the difference out so the project's ontology can be fixed.

## How to use this page

- **Read it before starting work on any Activatus project**, then read the project's own ontology.
- **Use the term on this page**, not a synonym: `utils`, never `helpers` or `utilities`.
- **If a term here has no definition, or you are not sure what is meant, ask.** Do not guess, and do not invent a new term.

### Writing a term

The words stay the same everywhere. Only the casing changes, to match where the term is written:

| Where                                          | Written as   | Example           |
| ---------------------------------------------- | ------------ | ----------------- |
| Database names, and the form used on this page | `snake_case` | `decision_doc`    |
| Code — variables and functions                 | camelCase    | `decisionDoc`     |
| Code — types and components                    | PascalCase   | `DecisionDocType` |
| Docs, prompts and UI                           | Title Case   | Decision Doc      |

---

## The terms

### Docs

| Term           | Means                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `decision`     | A choice made on purpose and written down, never left implied                                                                                          |
| `decision_doc` | One Markdown file that records one decision and why it was made. Every file in a project's `docs/` folder is one. See [Docs](/Standards/documentation) |
| `docs`         | A project's `docs/` folder: its Decision Docs, in the same standard folders in every project                                                           |
| `docs_site`    | The Docusaurus viewer in `docsSite/` that shows a project's docs at `/docs`. It only runs when `DOCS_URL` is set, which is never in production         |
| `ontology`     | A shared vocabulary: this page for code words, and the project's own for product words                                                                 |

### People and agents

| Term            | Means                                                                                                                                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `human`         | A person, as opposed to an agent                                                                                                                                                                                                              |
| `developer`     | A human who writes code                                                                                                                                                                                                                       |
| `agent`         | An AI that writes or checks code, such as Claude Code. It follows every standard a developer does                                                                                                                                             |
| `agent_spec`    | A project's `AGENTS.md` file: the first thing an agent reads, setting out how to work on that project. See [Agent Specs](/Standards/agent-specs)                                                                                              |
| `agent_harness` | Everything around an agent that runs it: the program it runs in (such as Claude Code), its instructions, the tools and permissions it has, and the rules it follows. The ontology says what words mean; the harness says how an agent behaves |
| `context`       | Everything an agent is given to read for its task: the agent spec, the docs and the code it is working on                                                                                                                                     |
| `tool`          | One action an agent is allowed to take, such as editing a file or running the tests. Tools come from the agent harness or an MCP server                                                                                                       |
| `model`         | The AI model an agent thinks with                                                                                                                                                                                                             |
| `mcp`           | Model Context Protocol: the standard way to connect an agent to outside tools and data, such as Linear or GitHub. An MCP server offers tools, and the agent calls them                                                                        |

### Code

| Term                                    | Means                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `component`                             | One piece of the user interface that does one job. Its file is PascalCase (`InvoiceTable.tsx`) inside a camelCase folder (`invoiceTable/`). See [Component Organization](/Structure/component-organization)                                                                                                                                                                             |
| `design_system_component`               | A standard component that every project builds the same way, with the same name, variants and props, such as Button or Card. Each one is listed on the [Design System Components](/design-system-components) page and lives in `components/ui/`. It takes everything through props and imports nothing from the project, so it can be copied into another project unchanged             |
| `shared_component`                      | A component this project uses on more than one page, built from Design System Components. It lives in `components/shared/`                                                                                                                                                                                                                                                              |
| `page_component`                        | A component used by one page, or by a few pages in one section. It lives in a `components/` folder beside that page, or in the section's route group. See [Where components live](/Structure/folder-structure#-where-components-live)                                                                                                                                                   |
| `props`                                 | The values a component takes. `props` is a [dictionary word](/Standards/human-readable-names#dictionary). Their type is named after the component and ends in `Props`: `ButtonProps`                                                                                                                                                                                                    |
| `type`                                  | A TypeScript type or interface. Its name ends in `Props` or `Type`                                                                                                                                                                                                                                                                                                                      |
| `dependency`                            | Something the code relies on but does not define itself: a package it installs, or the functions handed into a function as its `dependencies`. How tickets wait on each other is not a dependency here: each project names that itself, such as Launchpad's `blocked_by`                                                                                                                |
| `utils`                                 | Reusable functions that are not components, such as `formatCurrency`. They live in a `utils/` folder: global, for one section, or for one component. Each function has its own folder with its test file and an `index.ts`. `utils` is a [dictionary word](/Standards/human-readable-names#dictionary). Never `helpers` or `utilities`. See [Utils](/Structure/folder-structure#-utils) |
| `services`                              | The business logic: what the app does, its rules and operations. Pages, API routes and server actions stay thin and call into `services/`. See [utils, services and lib](/Structure/folder-structure#utils-services-and-lib)                                                                                                                                                            |
| `lib`                                   | Code that connects the app to something outside it, such as integration clients in `lib/integrations/stripe/`, and app-wide setup: permissions, middleware, validation, constants, errors and shared types                                                                                                                                                                              |
| `route`                                 | A web address in the app, such as `/account-settings` or `/api/calendar-events`, and the folder or file that creates it. Route folders are kebab-case, because their names become the URL. In Next.js, routes are the folders under `app/`. See [API Routes](/Structure/api-routes)                                                                                                     |
| `server_component` / `client_component` | A component that runs on the server, and one that runs in the browser. They live in separate files, and the server one wraps the client one                                                                                                                                                                                                                                             |
| `test_file`                             | The file that tests one function or component, named after it: `formatCurrency.test.ts`. Every function and component has one                                                                                                                                                                                                                                                           |
| `dictionary`                            | The list of short names that are words, not abbreviations: `id`, `docs`, `props`, `utils`, `url` and the rest. A short name not in the [Dictionary](/Standards/human-readable-names#dictionary) is written out in full. A new word is added to the Dictionary before it is used                                                                                                         |
| `third_party_names`                     | Names that come from someone else's code — a package, a framework or an outside service — such as React's `ref`, Next.js's `params` or shadcn/ui's `cn`. They are used exactly as they are, because renaming them breaks the code. The naming rule is only for names we write. See [Third-party names](/Standards/human-readable-names#third-party-names)                               |
| `third_party_code`                      | Code we did not write: `node_modules/`, and anything copied into `vendor/`. It is never linted, reformatted or renamed                                                                                                                                                                                                                                                                  |
| `global_palette`                        | The colours defined in `app/globals.css`. Every colour in a project comes from it. See [Styling](/Standards/styling)                                                                                                                                                                                                                                                                    |

### Checks

| Term         | Means                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lint_error` | A broken rule the linter reports. Fix the code; never switch the rule off without a comment saying why. See [Lint Errors](/Standards/lint-errors) |

---

## Key distinctions

These are the terms most easily confused. The **Not** column is the word we do not use.

| Term                                        | Means                                                                                                                                                   | Not                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **Decision / Decision Doc**                 | The choice itself vs the file that records it                                                                                                           |                        |
| **Docs / Docs Site**                        | The Markdown files vs the viewer that shows them                                                                                                        |                        |
| **Props**                                   | The values a component takes                                                                                                                            | `properties`           |
| **Utils**                                   | Reusable functions                                                                                                                                      | `helpers`, `utilities` |
| **Dictionary Word / Third-Party Name**      | A short name we chose to keep vs a name someone else chose for us                                                                                       |                        |
| **Design System / Shared / Page Component** | The same in every project (`components/ui/`) vs used on several pages of this project (`components/shared/`) vs used by one page or section (beside it) |                        |

---

## Changing the ontology

**This page is the one place code words are kept.** Change them here, never in a project's ontology.

- **Adding a term**: add it to the right group above. If it could be confused with another term, add a row to [Key distinctions](#key-distinctions).
- **Removing a term**: say what to use instead, in the same change.
- **A product word that every project uses** — not just one — can move here. Agree it first, then remove it from each project's ontology.
- **Either way**, update the date at the top of this page.
