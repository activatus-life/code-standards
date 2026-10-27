---
sidebar_position: 4
---

# Regression Checks for Refactors

A refactor that moves code around should change nothing a visitor can see. The regression check proves it: it measures every page before and after, and fails on any difference.

**It is optional.** Use it for large refactors that are meant to change nothing visible, such as Stages 4 to 6 of [Migrating an Existing Project](/docs/Guides/migrating). A normal feature change does not need it.

## What it checks

On each page in `tests/visual/visualPages.mjs`, at every half-screen scroll stop, in four sizes (desktop 1440×900, tablet 768×1024, mobile 390×844, and desktop with reduced motion):

| Measurement              | Must match the baseline to |
| ------------------------ | -------------------------- |
| Every element's box      | 1 pixel                    |
| Every element's opacity  | 0.02                       |
| The number of elements   | Exactly                    |
| The page height          | Exactly                    |
| A screenshot of the stop | 0.5% of pixels             |

So every run sees the same thing, the page clock is frozen and moved on by hand, finite CSS animations are finished, and images are decoded before measuring.

## Setting it up

1. **Install Playwright:**

   ```bash
   pnpm add -D @playwright/test
   pnpm exec playwright install chromium
   ```

2. **Copy `static/templates/tests/visual/`** to `tests/visual/` in the project, and list the pages to check in `visualPages.mjs`.
3. **Add the scripts** to `package.json`:

   ```json
   {
   	"scripts": {
   		"test:visual": "playwright test --config tests/visual/playwright.config.mjs",
   		"test:visual:update": "VISUAL_UPDATE=true playwright test --config tests/visual/playwright.config.mjs --update-snapshots"
   	}
   }
   ```

4. **Freeze the test files.** Add `tests/visual/` to `.prettierignore`, and add this line to the project's `AGENTS.md`, outside the code standards section: "Never edit `tests/visual/` or update its baseline without the person's yes."
5. **Take the baseline before the refactor starts, from the last known-good page.** That is the live production site, unless the branch's page has already changed from production for another reason, such as a redesign not yet live. Then it is the branch's last commit before the refactor: build that commit in a separate worktree, serve it, and point the baseline at it.

   ```bash
   # From production
   VISUAL_PRODUCTION_URL=https://example.com pnpm test:visual:update

   # From the last commit before the refactor: build and serve it in its
   # own worktree, then point the baseline at it
   git worktree add ../before-refactor <commit>
   VISUAL_PRODUCTION_URL=http://localhost:3200 pnpm test:visual:update
   ```

   Commit `tests/visual/baseline/`, and **record where it came from** in `docs/testing/regression.md`: the production URL, or the commit and the date.

## Running it

```bash
pnpm test:visual
```

It builds the project and starts the production build on port 3100, then measures it against the baseline. **It rebuilds on every run**, so a stale build is never measured. Run it at the end of every refactor stage.

## Rules

- **The baseline comes from the last known-good page**, never from the branch being tested: the live production site, or the branch's last commit before the refactor when its page has already changed from production. A baseline taken from the branch under test would only prove the branch matches itself.
- **It runs against a production build**, on its own port, never against `pnpm dev`.
- **An agent never updates the baseline without the person's yes.** A failing check means something visible changed. Find out what, and fix the code. Updating the baseline to make it pass hides the change.
- **The test files are frozen** for the whole refactor: an agent never edits them to make a check pass.
- **Record a check only after it has run.** `docs/testing/regression.md` says what was decided, and gets the baseline's source and each result only once they exist. Never write a URL, commit, date or "passed" for a check that has not happened yet.
- **A code standards update that changes only types may still be applied to a frozen test**, such as replacing `as const` with a real type, with the person's yes. A copy of the template takes the new template whole; a project's own test takes just the typing change. Nothing the test does may change, and the check must still pass against the **existing** baseline, never a new one: passing proves nothing changed.

## Comparing two local servers instead

A project that skips Playwright can still compare the page before and after: run the last known-good commit and the branch side by side, each with `next dev` on its own port, and compare their rendered HTML or screenshots.

- **Export the old commit to its own folder**, such as with `git worktree add ../before-refactor <commit>`.
- **Copy `node_modules` into it. Never symlink it.** Turbopack refuses a `node_modules` that points outside the project folder. On macOS, `cp -Rc node_modules ../before-refactor/` makes a copy-on-write clone in seconds that takes almost no extra disk space.
- **Record what was compared, and the result, only once it has run**, the same as the Playwright check.

## The blind spot

**A frozen clock only samples fixed moments.** The check measures each scroll stop after moving the clock on by the same amount every time. A change to the timing between those moments, such as an animation that now runs slower but ends in the same place, passes. When a refactor touches animation timing, check those parts by eye as well.
