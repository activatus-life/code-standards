---
sidebar_position: 8
---

# Agent Skills

A skill is a reusable instruction file an agent runs when you type `/lint`, `/format`, `/codeReview`. Every Activatus repository provides the same [standard set](/Standards/agentSpecs#standard-skills), copied from the [Templates page](/templates#skills). This page is the standard they are written to.

Skills are shared, versioned, and executed with real tool access. A vague one wastes a run; a wrong one edits files it was never meant to touch. They get the same review as any other code.

## Where skills live

One canonical copy, one mirror:

| Path | Role |
| --- | --- |
| `.agents/skills/*.md` | **Canonical.** Portable location any compatible agent reads. The only copy you edit. |
| `.claude/commands/*.md` | Claude Code mirror, exposed as `/name`. |

Keep the mirror identical to the canonical copy — edit the skill in `.agents/skills/`, then copy it across.

:::note[Why two locations rather than one format]

`.claude/commands/` is Claude Code's older flat-file layout; its newer equivalent is a directory per skill (`.claude/skills/<name>/SKILL.md`). Activatus stays on flat files because the same file has to serve `.agents/skills/` for non-Claude agents, and a flat `.md` is the only shape both read. Revisit this if bundled resources (`scripts/`, `references/`) are ever needed — that is what the directory format buys.

:::

## Frontmatter

Every skill starts with YAML frontmatter. Without it the agent falls back to guessing from the first line of the body.

```markdown
---
name: lint
description: Run all linters in check-only mode and report issues
argument-hint: "[path]"
allowed-tools: Read, Glob, Grep, Bash(pnpm lint:*), Bash(eslint:*)
---

Run all configured linters and report issues without modifying any files.
```

| Field | Required | Purpose |
| --- | --- | --- |
| `name` | Yes | The invocation name, in camelCase. Must match the filename. |
| `description` | Yes | One line, **under 60 characters**. How an agent decides to use it. |
| `argument-hint` | If it takes arguments | Shown during autocomplete. |
| `allowed-tools` | Strongly encouraged | The tools the skill may use. See below. |
| `model` | No | Pin only for genuinely mechanical skills. |
| `disable-model-invocation` | No | Set when a skill must only ever be run by a human. |

Quote any `argument-hint` that starts with `[`, or YAML parses it as a list:

```yaml
argument-hint: "[path]" # string
argument-hint: [path] # a one-element array — wrong
```

## `allowed-tools` is the contract

Prose like "this skill is read-only" is a request. `allowed-tools` is the enforcement. Whatever a skill's body promises not to do, the allowlist should make impossible:

| The skill says | So the allowlist omits |
| --- | --- |
| "Do NOT make file changes" | `Edit`, `Write` |
| "Do NOT auto-fix" | `Edit`, `Write` |
| "Do NOT stage or commit" | every `Bash(git …)` |
| "Do NOT push" | `Bash(git push:*)` |

Three rules follow from this:

1. **Every command the body tells the agent to run must be allowlisted.** A body that says `eslint $ARGUMENTS` under an allowlist of only `Bash(pnpm exec eslint:*)` blocks itself halfway through. List each form the body actually uses.
2. **Grant the narrowest set that still works.** `Bash(pnpm lint:*), Bash(eslint:*)` over a bare `Bash`.
3. **Never grant `git commit` or `git push`.** [Agents never commit code](/Standards/agentSpecs#agents-never-commit-code), so no skill is allowed to.

Be honest about the limit: patterns gate the command, not its flags. `Bash(eslint:*)` still permits `eslint --fix`. The allowlist reliably prevents a skill from reaching for a whole *category* of tool; keep the prose instruction as well for anything finer.

## Write for the agent, not the user

A skill body is the agent's instructions. Write directives, not a description of what the user is about to experience.

```markdown
<!-- Good — tells the agent what to do -->

Run each applicable linter in check-only mode and report the findings grouped by file.

<!-- Bad — tells the user what will happen -->

This command will check your code and give you a nice report.
```

## Structure

- **Number the steps.** Agents follow ordered lists more reliably than prose paragraphs.

- **Indent sub-steps by three spaces**, not two. An ordered item's content offset is three characters (`1. `), and at two spaces CommonMark — and Prettier — will lift the bullets out into a separate list and break the numbering.

  ```markdown
  2. Run each applicable linter:
     - ESLint: `eslint $ARGUMENTS`
     - Stylelint: `stylelint "**/*.{css,scss}"`
  3. Collect the warnings.
  ```

- **State the contract explicitly**, in the body as well as the frontmatter — `Do NOT stage or commit`, `Do NOT push`.

- **Say what to do when a prerequisite is missing.** Naming the fallback is what stops an agent from quietly substituting a worse one.

## Prefer the project's own scripts

Respect the project's own scripts. `pnpm lint` picks up workspace configuration that a bare `eslint .` at the root will miss, and in a monorepo the bare form is simply wrong.

## Checklist

Before merging a skill:

- [ ]  `name` matches the filename
- [ ]  `description` is one line, under 60 characters
- [ ]  `argument-hint` present if it takes arguments, and quoted if it starts with `[`
- [ ]  `allowed-tools` omits everything the body promises not to do
- [ ]  `allowed-tools` includes every command the body does invoke
- [ ]  Body is written as instructions to the agent
- [ ]  Sub-steps indented three spaces
- [ ]  Prettier leaves the file unchanged
- [ ]  `.claude/commands/` mirror matches `.agents/skills/`
