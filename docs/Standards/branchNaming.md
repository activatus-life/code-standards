---
sidebar_position: 6.5
---

# Branch Naming

Every branch name says what kind of work it holds and what the work is.

## Format

```text
<type>/<short-description>
```

```text
feat/invoice-export
fix/login-redirect-loop
docs/update-readme
```

## Rules

- **Start with a type**, followed by a slash. The types are the same as [Conventional Commits](/Standards/conventionalCommits#type-reference).
- **Describe the work in two to five words**, in lower-case kebab-case. Branch names are the one place besides CSS variables and route folders where we use kebab-case — it is the Git convention, and it is safe on every operating system.
- **Use full English words**, the same as in code: `fix/button-alignment`, not `fix/btn-align`.
- **One piece of work per branch.** If the description needs the word "and", it is two branches.
- **Never work directly on `main`.**

## Types

| Type | Use for | Example |
| --- | --- | --- |
| `feat` | A new feature | `feat/invoice-export` |
| `fix` | A bug fix | `fix/login-redirect-loop` |
| `docs` | Documentation only | `docs/update-readme` |
| `refactor` | Restructuring with no behaviour change | `refactor/split-user-service` |
| `test` | Adding or correcting tests | `test/invoice-total-rounding` |
| `chore` | Maintenance, dependencies, tooling | `chore/upgrade-next` |

## Examples

```text
✅ Good
feat/hero-question-rail
fix/checkout-total-rounding
chore/upgrade-tailwind

❌ Bad
hero                         # No type, and too vague
feature/HeroQuestionRail     # Not a standard type, and not kebab-case
fix/btn                      # Shorthand
toms-branch                  # Says nothing about the work
feat/invoices-and-login-fix  # Two pieces of work
```

## Ticket numbers

When the work has a ticket, put the ticket number after the type:

```text
feat/ACT-142-invoice-export
```

## AI agents

AI agents **never commit code**, so they do not create branches to commit to either. A person creates the branch, reviews the agent's changes, and commits them. See [AGENTS.md](/Standards/agentSpecs#agents-never-commit-code).
