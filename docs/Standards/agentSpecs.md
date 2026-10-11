---
sidebar_position: 7
sidebar_label: "AGENTS.md"
---

# AGENTS.md Specifications

Every Activatus repository must have an `AGENTS.md` in its root. This file gives AI coding agents (Claude Code, Copilot, Cursor, etc.) the context they need to work effectively without repeated explanation.

## Agents never commit code

**An AI agent never commits.** It does not run `git commit`, `git push`, `git merge`, `git rebase` or `git stash`, and it does not create, switch or delete branches.

The agent makes the changes, leaves them uncommitted in the working tree, and says what it changed. A person reviews the changes and commits them.

Every `AGENTS.md` states this at the very top and again under "Out of scope for AI agents". The [template](/templates#agents) already does.

## Template

Start from the [AGENTS.md template](/templates#agents) and replace every `[placeholder]`.

## Required sections

Every `AGENTS.md` must include these sections. Monorepos (`pnpm-workspace.yaml`, Turborepo, Nx, etc.) also require a **Workspace packages** table listing each package, its path and a one-line description.

| Section | Purpose |
| --- | --- |
| Project overview | One paragraph: what it does, who uses it, why it exists |
| Repository layout | Directory tree at depth 2 |
| Tech stack | Language, runtime, framework, database, infra (with versions) |
| Essential commands | Install, dev, build, test, lint, type-check |
| Development workflow | [Branch naming](/Standards/branchNaming), commit format, PR requirements, merge strategy |
| Environment variables | All required and optional env vars with descriptions |
| Documentation | Where the project's docs are, and the instruction to read them before starting work |
| Code standards | Link to these standards and the rules agents must follow in every change |
| Available skills | Table of the agent skills the project provides |
| Out of scope for AI agents | Explicit list of forbidden agent actions — always including "never commit code" |

## Standard skills

Every project provides these eight skills. **The files are ready to copy from the [Templates page](/templates#skills)** — copy them into `.agents/skills/`, and again into `.claude/commands/` for Claude Code. They are written to the [agent skills standard](/Standards/agentSkills).

| Skill | Invocation | What it does |
| --- | --- | --- |
| Lint | `/lint [path]` | Runs ESLint (and Stylelint if configured) in check-only mode; reports all issues grouped by file |
| Lint & fix | `/lintFix [path]` | Runs ESLint and Stylelint in fix mode, then Prettier; reports what changed and what is left |
| Format | `/format [path]` | Runs Prettier in write mode; reports reformatted files |
| Code review | `/codeReview [branch, commit or path]` | Reviews changes for correctness, security, types, tests and standards compliance. Report only |
| Update layout | `/updateLayout` | Regenerates the "Repository layout" section of `AGENTS.md` (and "Workspace packages" in monorepos) |
| Security audit | `/securityAudit [path]` | Audits dependencies and code for secrets, missing access control, unvalidated input and injection. Report only |
| TypeScript | `/typescript [path]` | Tightens loose types and removes `any`, `!` and unexplained `as` |
| Test | `/test [path]` | Runs the test suite; reports failures grouped by cause, tests that never ran, and files missing a test |

Skill files are named in camelCase like every other file (`lintFix.md`), so the invocation is camelCase too (`/lintFix`).

No skill commits code — see [Agents never commit code](#agents-never-commit-code).

### Skill locations

Skills are stored in two locations so they work with different tooling:

| Path | Used by |
| --- | --- |
| `.agents/skills/` | General agent discovery convention |
| `.claude/commands/` | Claude Code slash command system (mirror) |

## Writing guidelines

| Do | Don't |
| --- | --- |
| Use concrete commands (`pnpm test`) | Use vague instructions ("run the tests") |
| State constraints explicitly ("do not push to `main`") | Assume the agent knows your branching policy |
| Include version numbers in the tech stack | Leave versions ambiguous |
| Keep it under ~300 lines | Write a novel — agents have context limits |
| Run `/updateLayout` after structural changes | Let the directory tree go stale |
