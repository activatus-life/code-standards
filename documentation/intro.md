---
slug: /
sidebar_position: 1
sidebar_label: "Introduction"
---

# Activatus Code Standards

This site documents the shared code standards used across all Activatus projects. Every project applies the same linting, formatting, structure and naming rules, so moving between codebases never means relearning the basics.

## What's included

| Standard | Config | Purpose |
| --- | --- | --- |
| Human-Readable Names | [Naming rule](/Standards/human-readable-names) | Every name is whole, readable words — variables, props, form fields, files, folders, everything |
| Readable Code | [Readability rules](/Standards/readable-code) | File length, naming, single-purpose functions and tests |
| Documentation | [Docs standard](/Standards/documentation) | How project docs are written and shown at `/documentation` |
| ESLint | [`eslint.config.mjs`](/Standards/eslint) | Linting rules for JS/TS/React/Next.js |
| Fixing Lint Errors | [Error guide](/Standards/lint-errors) | What each lint error means and how to fix it |
| Prettier | [`prettier.config.js`](/Standards/prettier) | Code formatting |
| Stylelint | [`stylelint.config.mjs`](/Standards/stylelint) | Linting rules for CSS/SCSS/CSS Modules |
| EditorConfig | [`.editorconfig`](/Standards/editorconfig) | Editor-level whitespace rules |
| direnv + nvm | [`.envrc` / `.nvmrc`](/Standards/direnv) | Automatic Node version switching on `cd` |
| Conventional Commits | [Commit spec](/Standards/conventional-commits) | Commit message format and tooling |
| Branch Naming | [Branch names](/Standards/branch-naming) | `type/short-description` branch names |
| AGENTS.md | [`AGENTS.md`](/Standards/agent-specs) | AI agent context and agent skills |
| CSS Styling | [Styling guide](/Standards/styling) | Tailwind CSS, flexbox-first layout and global colour variables |
| Tech Stack | [Tech stack](/Standards/tech-stack) | The frameworks, libraries and versions we build on |

Project layout is covered under **Structure**: [folder structure](/Structure/folder-structure), [component organization](/Structure/component-organization), [naming conventions](/Structure/naming-conventions), [import organization](/Structure/import-organization) and [API routes](/Structure/api-routes).

## Ontology

The [Ontology](/ontology) is the shared vocabulary every Activatus project uses: what each term means, and the terms we do not use. Read it first.

## Quick start

Every config file is ready to copy from the [Templates](/templates) page.

Starting a new project? Follow the [New Project Setup](/Guides/new-project) guide.

Bringing an existing codebase up to standard? Follow [Migrating an Existing Project](/Guides/migrating), which stages the work so each pull request stays reviewable.
