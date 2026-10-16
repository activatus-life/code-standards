---
sidebar_position: 6.5
---

# Branch Naming

Every branch name says which ticket it is for, or, when there is no ticket, what kind of work it holds.

## Every task has a ticket

**Work starts from a ticket**, such as a Linear issue. The branch is named after the ticket, so the ticket, the branch and the Pull Request link up on their own.

```text
<TICKET-ID>-<short-title>
```

```text
ACT-14-invoice-export
ACT-142-login-redirect-loop
ACT-87-never-commit-rule
```

- **Start with the ticket id**, exactly as the ticket tracker writes it: `ACT-14`. Linear and GitHub find the ticket from it and link the branch and its Pull Request.
- **Then the ticket's title, shortened to two to five words**, in lower-case kebab-case.
- **No type in front.** The kind of work (`feat`, `fix`, `docs`…) goes in each [commit message](/Standards/conventional-commits) instead.
- **One ticket per branch.**

## Work without a ticket

Work with no ticket is the exception: a quick fix to the README, or tidying up the tooling. Name the branch after the kind of work and what it is:

```text
<type>/<short-description>
```

```text
docs/update-readme
chore/upgrade-next
fix/login-redirect-loop
```

The types are the same as [Conventional Commits](/Standards/conventional-commits#type-reference):

| Type       | Use for                                | Example                       |
| ---------- | -------------------------------------- | ----------------------------- |
| `feat`     | A new feature                          | `feat/invoice-export`         |
| `fix`      | A bug fix                              | `fix/login-redirect-loop`     |
| `docs`     | Documentation only                     | `docs/update-readme`          |
| `refactor` | Restructuring with no behaviour change | `refactor/split-user-service` |
| `test`     | Adding or correcting tests             | `test/invoice-total-rounding` |
| `chore`    | Maintenance, dependencies, tooling     | `chore/upgrade-next`          |

If the work turns out to be bigger than a quick fix, make a ticket for it and use the ticket branch name instead.

## Rules for both

- **Use full English words**, the same as in code: `ACT-14-button-alignment`, not `ACT-14-btn-align`.
- **Lower-case kebab-case** after the ticket id or type. It is the Git convention, and safe on every operating system.
- **One piece of work per branch.** If the description needs the word "and", it is two branches.
- **Never work directly on `main`.**

## Examples

```text
✅ Good
ACT-14-invoice-export
ACT-142-checkout-total-rounding
chore/upgrade-tailwind

❌ Bad
feat/ACT-14-invoice-export   # No type in front of a ticket id
invoice-export               # Has a ticket, but no ticket id
feature/hero-question-rail   # "feature" is not a type; use feat
ACT-14-btn                   # Shorthand
toms-branch                  # Says nothing about the work
ACT-14-invoices-and-login    # Two pieces of work
```

## AI agents

By default, AI agents **never commit code**, so they do not create branches to commit to either. A person creates the branch, reviews the agent's changes, and commits them. A project can choose otherwise. See [AGENTS.md](/Standards/agent-specs#agents-never-commit-code).
