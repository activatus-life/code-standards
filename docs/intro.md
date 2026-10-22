---
slug: /
sidebar_position: 1
sidebar_label: "Introduction"
---

# Activatus Code Standards

This site documents the shared code standards used across all Activatus projects. Every project applies the same linting, formatting, structure and naming rules, so moving between codebases never means relearning the basics.

## What's included

| Standard             | Config                                              | Purpose                                                                                         |
| -------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Human-Readable Names | [Naming rule](/docs/Standards/human-readable-names) | Every name is whole, readable words — variables, props, form fields, files, folders, everything |
| Readable Code        | [Readability rules](/docs/Standards/readable-code)  | File length, naming, single-purpose functions and tests                                         |
| Documentation        | [Docs standard](/docs/Standards/documentation)      | How project docs are written and shown at `/docs`                                               |
| ESLint               | [`eslint.config.mjs`](/docs/Standards/eslint)       | Linting rules for JS/TS/React/Next.js                                                           |
| Fixing Lint Errors   | [Error guide](/docs/Standards/lint-errors)          | What each lint error means and how to fix it                                                    |
| Prettier             | [`prettier.config.mjs`](/docs/Standards/prettier)   | Code formatting                                                                                 |
| Stylelint            | [`stylelint.config.mjs`](/docs/Standards/stylelint) | Linting rules for CSS/SCSS/CSS Modules                                                          |
| EditorConfig         | [`.editorconfig`](/docs/Standards/editorconfig)     | Editor-level whitespace rules                                                                   |
| direnv + nvm         | [`.envrc` / `.nvmrc`](/docs/Standards/direnv)       | Automatic Node version switching on `cd`                                                        |
| AGENTS.md            | [`AGENTS.md`](/docs/Standards/agent-specs)          | AI agent context and agent skills                                                               |
| Working with Agents  | [Optional](/docs/Standards/working-with-agents)     | GitHub repo, Linear project and status circles: all optional, offered during setup              |
| CSS Styling          | [Styling guide](/docs/Standards/styling)            | Tailwind CSS, flexbox-first layout and global colour variables                                  |
| Tech Stack           | [Tech stack](/docs/Standards/tech-stack)            | The frameworks, libraries and versions we build on                                              |

Project layout is covered under **Structure**: [folder structure](/docs/Structure/folder-structure), [component organization](/docs/Structure/component-organization), [naming conventions](/docs/Structure/naming-conventions), [import organization](/docs/Structure/import-organization) and [API routes](/docs/Structure/api-routes).

## Ontology

The [Ontology](/docs/ontology) is the shared vocabulary for code: what each code word means. Each project adds its own product words in `docs/product/ontology.md`. Read both first.

## Version History

The [Version History](/docs/version-history) lists what changed in each version, and what a project has to do about it. Updating a project? Read only the versions newer than the one in its `AGENTS.md`.

## For AI agents: you were pointed here

A person has told you to follow the Activatus Code Standards. **Follow [Setup](/docs/Guides/setup) first.** It installs the standards as the `@activatus/code-standards` package, checks which version the project is on, agrees with the person which standards apply, and sets them up. It covers new projects, projects on an older version, and projects that have never followed the standards.

After setup, follow every agreed standard in every change. Read a page when the work reaches its topic: [Styling](/docs/Standards/styling) before writing styles, [Docs](/docs/Standards/documentation) before writing docs, and so on. The ones to read first are the [Ontology](/docs/ontology), [Human-Readable Names](/docs/Standards/human-readable-names), [Readable Code](/docs/Standards/readable-code), [Folder Structure](/docs/Structure/folder-structure) and [Component Organization](/docs/Structure/component-organization).

**If anything here is unclear, ask the person.** Do not guess, and do not invent a rule.
