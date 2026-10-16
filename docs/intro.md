---
slug: /
sidebar_position: 1
sidebar_label: "Introduction"
---

# Activatus Code Standards

This site documents the shared code standards used across all Activatus projects. Every project applies the same linting, formatting, structure and naming rules, so moving between codebases never means relearning the basics.

## What's included

| Standard             | Config                                         | Purpose                                                                                         |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Human-Readable Names | [Naming rule](/Standards/human-readable-names) | Every name is whole, readable words — variables, props, form fields, files, folders, everything |
| Readable Code        | [Readability rules](/Standards/readable-code)  | File length, naming, single-purpose functions and tests                                         |
| Documentation        | [Docs standard](/Standards/documentation)      | How project docs are written and shown at `/docs`                                               |
| ESLint               | [`eslint.config.mjs`](/Standards/eslint)       | Linting rules for JS/TS/React/Next.js                                                           |
| Fixing Lint Errors   | [Error guide](/Standards/lint-errors)          | What each lint error means and how to fix it                                                    |
| Prettier             | [`prettier.config.js`](/Standards/prettier)    | Code formatting                                                                                 |
| Stylelint            | [`stylelint.config.mjs`](/Standards/stylelint) | Linting rules for CSS/SCSS/CSS Modules                                                          |
| EditorConfig         | [`.editorconfig`](/Standards/editorconfig)     | Editor-level whitespace rules                                                                   |
| direnv + nvm         | [`.envrc` / `.nvmrc`](/Standards/direnv)       | Automatic Node version switching on `cd`                                                        |
| Conventional Commits | [Commit spec](/Standards/conventional-commits) | Commit message format and tooling                                                               |
| Branch Naming        | [Branch names](/Standards/branch-naming)       | `type/short-description` branch names                                                           |
| AGENTS.md            | [`AGENTS.md`](/Standards/agent-specs)          | AI agent context and agent skills                                                               |
| CSS Styling          | [Styling guide](/Standards/styling)            | Tailwind CSS, flexbox-first layout and global colour variables                                  |
| Tech Stack           | [Tech stack](/Standards/tech-stack)            | The frameworks, libraries and versions we build on                                              |

Project layout is covered under **Structure**: [folder structure](/Structure/folder-structure), [component organization](/Structure/component-organization), [naming conventions](/Structure/naming-conventions), [import organization](/Structure/import-organization) and [API routes](/Structure/api-routes).

## Ontology

The [Ontology](/ontology) is the shared vocabulary for code: what each code word means. Each project adds its own product words in `docs/product/ontology.md`. Read both first.

## Version History

The [Version History](/version-history) lists what changed in each version, and what a project has to do about it. Updating a project? Read only the versions newer than the one in its `AGENTS.md`.

## For AI agents: you were pointed here

A person has told you to follow the Activatus Code Standards. **Follow [Setup](/Guides/setup) first.** It installs the standards as the `@activatus/code-standards` package, checks which version the project is on, agrees with the person which standards apply, and sets them up. It covers new projects, projects on an older version, and projects that have never followed the standards.

After setup, follow every agreed standard in every change. Read a page when the work reaches its topic: [Styling](/Standards/styling) before writing styles, [Docs](/Standards/documentation) before writing docs, and so on. The ones to read first are the [Ontology](/ontology), [Human-Readable Names](/Standards/human-readable-names), [Readable Code](/Standards/readable-code), [Folder Structure](/Structure/folder-structure) and [Component Organization](/Structure/component-organization).

**If anything here is unclear, ask the person.** Do not guess, and do not invent a rule.
