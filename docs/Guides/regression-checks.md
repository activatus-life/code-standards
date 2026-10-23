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
5. **Take the baseline from the live production site**, before the refactor starts:

   ```bash
   VISUAL_PRODUCTION_URL=https://example.com pnpm test:visual:update
   ```

   Commit `tests/visual/baseline/`.

## Running it

```bash
pnpm test:visual
```

It builds the project and starts the production build on port 3100, then measures it against the baseline. **It rebuilds on every run**, so a stale build is never measured. Run it at the end of every refactor stage.

## Rules

- **The baseline comes from the live production site**, never from the branch being tested. A baseline taken from the branch would only prove the branch matches itself.
- **It runs against a production build**, on its own port, never against `pnpm dev`.
- **An agent never updates the baseline without the person's yes.** A failing check means something visible changed. Find out what, and fix the code. Updating the baseline to make it pass hides the change.
- **The test files are frozen** for the whole refactor: an agent never edits them to make a check pass.

## The blind spot

**A frozen clock only samples fixed moments.** The check measures each scroll stop after moving the clock on by the same amount every time. A change to the timing between those moments, such as an animation that now runs slower but ends in the same place, passes. When a refactor touches animation timing, check those parts by eye as well.
