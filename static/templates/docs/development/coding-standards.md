# Development — Coding Standards

> Which coding standards this project follows, and where it differs from them.

**Status:** Decided · **Updated:** [YYYY-MM-DD]

## Decision

This project follows the Activatus Code Standards, installed as the `@activatus/code-standards` package. The person agreed which standards apply during setup (steps 3 and 4 of `docs/Guides/setup.md` in the package).

## Why

Every Activatus project follows the same standards, so people and agents can move between projects without relearning the basics. Recording each difference here keeps it visible, and stops the next update from undoing it.

## Details

[For each standard this project skips or changes, at setup or later, one line: its number and name from the setup list, "skipped" or "changed", why, and the date the person agreed. For example: "7. Prettier — skipped: the project uses Biome for formatting (2026-10-23)." An exception for only some files names them in backticks after "for": "4. Every function and component has a test file — changed for `app/api/**`: legacy routes, tested when replaced (2026-10-27)." Start no other line here with a number: `pnpm standards:check` reads every numbered line as an exception. Every rule in `eslint.overrides.mjs` has an entry here. If nothing differs, write "No differences".]

- Working with the agent: GitHub repo [link or None]; Linear project [project or None]; status circles [yes or no]; ask before every commit and push [yes or no]; told about decisions [yes or no] ([YYYY-MM-DD]).

## Components for the standards

[Props-only components this project keeps in `components/ui/` that are not in the Design System Components list yet, each with its props, to be added in the next release of the standards. If there are none, write "None".]

## Unfinished changes

[Changes from a code standards version that are not done yet, each with its version and number, what is left, and where it is being done. For example: "Version 2, change 4: the standard ESLint config is not switched on yet. Being done in ACT-120." If there are none, write "None", with no note after it: a note after "None" reads as an unfinished change.]

## Related

- [Writing Docs](../overview/writing-docs.md)
