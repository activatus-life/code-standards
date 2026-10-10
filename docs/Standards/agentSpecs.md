---
sidebar_position: 7
sidebar_label: "AGENTS.md"
---

# AGENTS.md Specifications

Every Activatus repository must have an `AGENTS.md` in its root. This file gives AI coding agents (Claude Code, Copilot, Cursor, etc.) the context they need to work effectively without repeated explanation.

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
| Development workflow | Branch naming, commit format, PR requirements, merge strategy |
| Environment variables | All required and optional env vars with descriptions |
| Code standards | Link to these standards and the rules agents must follow in every change |
| Available skills | Table of the agent skills the project provides |
| Out of scope for AI agents | Explicit list of forbidden agent actions |

## Standard skills

These are the standard skills a project provides. Each is a file in `.agents/skills/` (mirrored to `.claude/commands/` for Claude Code), written to the [agent skills standard](/Standards/agentSkills):

| Skill | Invocation | What it does |
| --- | --- | --- |
| Lint | `/lint [path]` | Runs ESLint (and Stylelint if configured) in check-only mode; reports all issues grouped by file |
| Lint & fix | `/lint-fix [path]` | Runs ESLint + Stylelint `--fix`, then Prettier; reports what changed |
| Format | `/format [path]` | Runs Prettier in write mode; reports reformatted files |
| Code review | `/code-review [ref]` | Reviews branch diff for correctness, security, types, and standards compliance. Accepts a PR URL, commit SHA, or file path |
| Update layout | `/update-layout` | Regenerates the "Repository layout" section (and "Workspace packages" in monorepos) from the current state of the repo |
| Commit | `/commit [hint]` | Inspects the staged diff, infers a [Conventional Commits](/Standards/conventionalCommits) message, and commits after your approval |
| Security audit | `/security-audit [target]` | Audits the repository, the code, and a deployed URL against the OWASP Top 10:2025 and CWE Top 25. Accepts a path, URL, or base ref |
| TypeScript | `/typescript [path]` | Tightens loose types and removes the assertions they force. Accepts a file path |
| Test | `/test [path]` | Runs the test suite and reports failures grouped by cause, and a failing test from one that never ran |

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
| Run `/update-layout` after structural changes | Let the directory tree go stale |
