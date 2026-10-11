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
| Readable Code | [Readability rules](/Standards/readableCode) | File length, naming, single-purpose functions and tests |
| Documentation | [Docs standard](/Standards/documentation) | How project docs are written and shown at `/docs` |
| ESLint | [`eslint.config.mjs`](/Standards/eslint) | Linting rules for JS/TS/React/Next.js |
| Prettier | [`prettier.config.js`](/Standards/prettier) | Code formatting |
| Stylelint | [`stylelint.config.mjs`](/Standards/stylelint) | Linting rules for CSS/SCSS/CSS Modules |
| EditorConfig | [`.editorconfig`](/Standards/editorconfig) | Editor-level whitespace rules |
| direnv + nvm | [`.envrc` / `.nvmrc`](/Standards/direnv) | Automatic Node version switching on `cd` |
| Conventional Commits | [Commit spec](/Standards/conventionalCommits) | Commit message format and tooling |
| Branch Naming | [Branch names](/Standards/branchNaming) | `type/short-description` branch names |
| AGENTS.md | [`AGENTS.md`](/Standards/agentSpecs) | AI agent context and agent skills |
| CSS Styling | [Styling guide](/Standards/styling) | Tailwind CSS, flexbox-first layout and global colour variables |
| Tech Stack | [Tech stack](/Standards/techStack) | The frameworks, libraries and versions we build on |

Project layout is covered under **Structure**: [folder structure](/Structure/folderStructure), [component organization](/Structure/componentOrganization), [naming conventions](/Structure/namingConventions), [import organization](/Structure/importOrganization) and [API routes](/Structure/apiRoutes).

## Quick start

Every config file is ready to copy from the [Templates](/templates) page.

Starting a new project? Follow the [New Project Setup](/Guides/newProject) guide.

Bringing an existing codebase up to standard? Follow [Migrating an Existing Project](/Guides/migrating), which stages the work so each pull request stays reviewable.
