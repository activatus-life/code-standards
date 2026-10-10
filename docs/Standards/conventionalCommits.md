---
sidebar_position: 6
---

# Conventional Commits

All Activatus repositories follow the [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages. This gives us machine-readable history, automatic changelogs, and a shared vocabulary for what a commit does.

## Format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

The first line (header) must not exceed **72 characters**. Everything else is optional.

## Quick examples

```text
feat(auth): add magic-link login flow
fix(api): handle null response from payment provider
docs: clarify AGENTS.md authoring guide
refactor(ui): extract Button into shared component library
chore(deps): bump eslint-config to v0.2.0
feat!: drop support for Node 18
```

## Type reference

| Type | When to use |
| --- | --- |
| `feat` | A new feature visible to users or API consumers |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting or whitespace — no logic change |
| `refactor` | Code restructuring with no feature or bug change |
| `perf` | A performance improvement |
| `test` | Adding or correcting tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD pipeline changes |
| `chore` | Maintenance that doesn't fit elsewhere |
| `revert` | Reverts a previous commit |

## Scope

The scope is optional and goes in parentheses after the type. It names the part of the codebase the commit touches:

```text
feat(auth): ...
fix(checkout): ...
refactor(ui/button): ...
```

Use lowercase, kebab-case names. If a commit spans many areas, omit the scope rather than writing a vague one.

## Description

- Imperative, present tense: **"add"** not "added" or "adds"
- No capital letter at the start
- No period at the end
- Describes *what* the commit does, not *how*

```text
✓  feat: add dark mode toggle
✗  feat: Added dark mode toggle.
✗  feat: dark mode
```

## Body

The body explains the *why* behind a change — context that won't be obvious from the diff. Wrap at 72 characters.

```text
fix(api): retry on transient 503 from payments provider

The payments API returns a 503 during brief maintenance windows.
Previously this caused checkout to fail immediately. Now we retry
up to 3 times with exponential back-off before surfacing an error.
```

## Breaking changes

Signal a breaking change in one of two ways:

**Inline `!` after the type** (for the header only):

```text
feat!: remove deprecated /v1/users endpoint
```

**`BREAKING CHANGE:` footer** (required when a body explains the break):

```text
feat(api)!: require explicit content-type header on all requests

BREAKING CHANGE: requests without a Content-Type header now return
400. Previously the API defaulted to application/json.
```

A breaking change bumps the **major** version in SemVer (`1.0.0` → `2.0.0`).

## Versioning implications

When using [Changesets](https://github.com/changesets/changesets) or a changelog tool that understands Conventional Commits:

| Commit type | SemVer bump |
| --- | --- |
| `fix`, `perf` | patch (`1.0.0` → `1.0.1`) |
| `feat` | minor (`1.0.0` → `1.1.0`) |
| Any with `!` or `BREAKING CHANGE` | major (`1.0.0` → `2.0.0`) |
| All others (`docs`, `chore`, `ci`, …) | none |

## Multi-commit PRs

Each commit in a PR should be independently meaningful and deployable. Prefer:

```text
feat(auth): scaffold magic-link token model
feat(auth): add magic-link send endpoint
feat(auth): add magic-link verify endpoint
test(auth): add integration tests for magic-link flow
docs(auth): document magic-link API in AGENTS.md
```

Over a single `feat(auth): implement magic-link` that touches everything at once. Granular commits make `git bisect` and revert effective.

## The `/commit` skill

The `/commit` agent skill (documented in [AGENTS.md specs](/Standards/agentSpecs)) automates this workflow:

1. Inspects the staged diff
2. Infers the correct type, scope, and description
3. Proposes a commit message for your review
4. Commits only after you confirm

```text
/commit
/commit auth module
```

The skill will never push or amend — it only creates a new local commit.

## Enforcing commit messages

Projects use [Commitlint](https://commitlint.io) with [Husky](https://typicode.github.io/husky/) to enforce the format locally. After `pnpm install`, every commit runs the `commit-msg` hook:

```text
pnpm exec commitlint --edit "$1"
```

The configuration is in `.commitlintrc.json`:

```json
{
  "extends": ["@commitlint/config-conventional"]
}
```
