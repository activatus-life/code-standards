---
sidebar_position: 0.5
---

# Documentation

Every project documents itself the same way, so a developer or an AI agent can open any Activatus project and find what they need in the same place.

This is the docs framework from Launchpad. It is used for Launchpad itself and for every other project.

## How it works

| Part           | What it is                                        | Where it lives                                     |
| -------------- | ------------------------------------------------- | -------------------------------------------------- |
| **The docs**   | Plain Markdown files. Every one is a Decision Doc | `docs/` in the project root                        |
| **The viewer** | A Docusaurus site that displays those files       | `docsSite/` in the project root                    |
| **The route**  | The docs appear at `/docs` in the running project | Switched on by the `DOCS_URL` environment variable |

The docs are written once, as Markdown, and read two ways:

- **AI agents** read the files in `docs/` directly. No build, no server.
- **People** browse them at `/docs`, with a menu, search and page contents — the same layout as this site.

---

## 📜 Every file is a Decision Doc

**Every file in `docs/` is a Decision Doc.** There is no separate `decisions/` folder.

A design system is a decision. A scope is a decision. A database choice is a decision. Each doc states one decision and why it was made, so anyone — or any agent — can trace the work back to the reason for it, and never has to invent a product decision to unblock themselves.

- **Tickets own the _what_.** "Build GitHub authentication."
- **Decision Docs own the _why_.** "Developers are our audience and we must sync directly to their repositories."

See the [Ontology](/docs/ontology#key-distinctions) for the terms.

---

## 📁 The folders

Every project has the same folders. The folder is the menu group.

### Reusable folders

These are the same in every project:

| Folder          | Holds decisions about                        | Files                                                                                                                                                                                                                                 |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `overview/`     | What the project is and how to read its docs | `what-is-it`, `how-it-works`, `writing-docs`                                                                                                                                                                                          |
| `ai/`           | Agents, models and what they may do          | `agent-harness`, `agents`, `architecture`, `context`, `model-routing`, `models`, `retrieval`, `tools`                                                                                                                                 |
| `architecture/` | How the system is built                      | `authentication`, `backend`, `background-jobs`, `backups`, `caching`, `ci-cd`, `disaster-recovery`, `environments`, `frontend`, `hosting`, `observability`, `realtime`, `search`, `services`, `state-management`, `storage`, `system` |
| `business/`     | The customer and the money                   | `buying-trigger`, `customer`, `customer-value`, `defensibility`, `growth`, `pricing`, `revenue-model`, `unit-economics`                                                                                                               |
| `data/`         | What is stored and how                       | `analytics`, `audit`, `database`, `indexing`, `migrations`, `model`, `retention`, `schema`                                                                                                                                            |
| `deployment/`   | Getting work to production                   | `approval`, `live-verification`, `process`, `rollback`                                                                                                                                                                                |
| `design/`       | How it looks and behaves                     | `design-system`, `errors`, `feedback`, `interactions`, `layout`, `navigation`, `principles`, `responsive`                                                                                                                             |
| `development/`  | How code is written and merged               | `branching`, `code-quality`, `coding-standards`, `commits`, `merge-strategy`, `process`, `pull-requests`                                                                                                                              |
| `experience/`   | What using it should feel like               | `accessibility`, `aha-moment`, `anti-experience`, `friction`, `outcomes`, `principles`, `retention`, `sharing`                                                                                                                        |
| `pitch/`        | Why the product should exist                 | `alternatives`, `assumptions`, `audience`, `concept`, `differentiators`, `outcomes`, `problem`, `product-market-fit`, `success-criteria`, `validation`, `value-proposition`, `vision`                                                 |
| `scope/`        | What is in, out and later                    | `core`, `exclusions`, `future`, `launch`, `post-launch`, `priorities`, `quality-bar`                                                                                                                                                  |
| `security/`     | Keeping it safe                              | `audit`, `data-access`, `logging`, `privacy`, `secrets`, `threat-model`                                                                                                                                                               |
| `testing/`      | How it is tested                             | `end-to-end`, `integration`, `regression`, `security`, `strategy`, `test-data`, `unit`                                                                                                                                                |
| `uat/`          | Checking we built the right thing            | `checks`, `strategy`                                                                                                                                                                                                                  |
| `users/`        | Who uses it and what they may do             | `permissions`, `roles`, `user-types`                                                                                                                                                                                                  |
| `workflows/`    | How work moves                               | `assignment`, `bugfix`, `dependencies`, `deployment`, `development`, `planning`, `review`, `uat`                                                                                                                                      |

### Product-specific folders

Decisions that only make sense for this one product go in their own folders:

| Folder                                   | Holds                                                |
| ---------------------------------------- | ---------------------------------------------------- |
| `product/`                               | What this product is and how its main parts work     |
| `integrations/`                          | One file per outside service the product connects to |
| `user-flows/`                            | One file per User Flow                               |
| _A folder for the product's own subject_ | For example, Launchpad has `tickets/`                |

### Which folder?

Before placing a doc in a reusable folder, ask: **would this topic make sense as a standard decision category for a completely different software product?**

- **Yes** → a reusable folder.
- **No** → a product-specific folder.

Keep these pairs distinct:

- **Authentication** (_who are you?_) belongs in `architecture/authentication.md`. **Permissions** (_what are you allowed to do?_) belong in `users/permissions.md`.
- `data/model.md` is the conceptual model, `data/database.md` is the technology and strategy, and `data/schema.md` is the concrete structure.

### Every file exists from the start

**A new project starts with every reusable file already in place**, each marked `Status: Not started`. Copy the [doc templates](/docs/templates#document-templates).

- When a decision is made, **write it into the matching file**.
- **Create a new file** only when a topic has no home.

A `Not started` file is a visible gap: it shows a decision that has not been made yet.

---

## 📄 The doc format

Every doc has the same shape:

```md
# <Group> — <Menu item>

> One line: what this doc decides.

**Status:** Not started | Under evaluation | Current plan | Decided · **Updated:** YYYY-MM-DD

## Decision

## Why

## Details (optional)

## Alternatives considered (optional)

## Current implementation (only when the code differs)

## Related

## Retro Feedback (added as tasks complete)
```

### Status

| Status               | Means                                                                      |
| -------------------- | -------------------------------------------------------------------------- |
| **Not started**      | A template waiting for its first decision                                  |
| **Under evaluation** | Not decided. The options are recorded                                      |
| **Current plan**     | The direction we are working to. It may change                             |
| **Decided**          | An intentional current decision. Change it only with a Decision Doc update |

### Sections

| Section                   | Holds                                                                            |
| ------------------------- | -------------------------------------------------------------------------------- |
| `Decision`                | What was decided                                                                 |
| `Why`                     | The reasons                                                                      |
| `Details`                 | Anything needed to act on the decision                                           |
| `Alternatives considered` | What was rejected, and why                                                       |
| `Current implementation`  | Only when the code differs from the decision: describe the gap                   |
| `Related`                 | Links to related docs                                                            |
| `Retro Feedback`          | What went well and what did not, added as tasks linked to this doc are completed |

**A doc states the decision, not the code.** When the code does not match yet, the gap goes under `Current implementation`.

### When a decision changes

Update the doc, change the **Updated** date, and add a `## History` entry: what changed, why, when, and which work was affected. Keep the original decision and its reason in the history.

---

## 🧭 One file, one menu item, one route

The docs menu is built straight from the `docs/` folder, so every doc is in the menu and nothing else is.

| Rule                                                          | Example                                             |
| ------------------------------------------------------------- | --------------------------------------------------- |
| **The folder is the menu group**                              | `scope/` shows as **Scope**                         |
| **The title after the `—` is the menu item**                  | `# Scope — Future` shows as **Future**              |
| **The file name is that title in kebab-case**                 | `# Scope — Future` lives in `scope/future.md`       |
| **The route is the folder plus the file name**, without `.md` | `scope/future.md` is served at `/docs/scope/future` |

- **Overview comes first** in the menu. Every other group is in alphabetical order, and items are alphabetical within their group.
- **Link between docs with relative `.md` paths** — `[Future](../scope/future.md)`. The link works in the file and on the site.
- **Folder and file names are kebab-case**, because they become the route. See [Naming Conventions](/docs/Structure/naming-conventions#when-to-use-kebab-case).

The viewer does this automatically. There is no menu file to maintain.

---

## ✍️ Rules for writing

- **Use the [Ontology](/docs/ontology).** Use its terms for code, and the project's own ontology for product words.
- **One decision per file.**
- **Plain Markdown (`.md`).** No JSX or imports, so every file reads the same for an agent as it does on the page.
- **One `# Heading` per file**, at the top, in the form `# Group — Menu item`.
- **Draw diagrams with Mermaid** in a ` ```mermaid ` code block, so the diagram is text and stays in the file.
- **Write for someone who has never seen the project.** Full sentences, full English words, no shorthand.

### Not finished until the docs are updated

**A change is not finished until the docs match it.** If a change makes a doc wrong, the doc is fixed in the same change — the same rule as [test files](/docs/Standards/readable-code#every-function-and-component-has-a-test-file).

This applies to everyone writing code, **including AI agents**. An agent that changes how something works updates the Decision Doc that describes it.

---

## 🌐 The `/docs` route

The docs appear at `/docs` inside the running project — `http://localhost:3000/docs` — in the same layout as this site.

They are switched on by one environment variable:

| `DOCS_URL`                    | What happens at `/docs`          |
| ----------------------------- | -------------------------------- |
| Set (`http://localhost:3001`) | The docs are shown               |
| Not set                       | `404` — the route does not exist |

### ⛔ Never in production

**`DOCS_URL` is never set in production.** With it unset, the project has no `/docs` route at all, so internal docs cannot be reached on a live site.

- Set it in `.env.local` for local development.
- Set it on a staging or preview environment only if the team wants the docs there.
- **Do not add it to the production environment.**

The docs site also sets `noIndex`, so search engines are told not to index it wherever it is running.

### What goes in Git

**The docs are committed. They are not published.** Committing a file to the repository and serving it on the live site are two different things.

| Item                                                                 | In Git?      | Why                                                                                                                                    |
| -------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/`                                                              | ✅ Committed | It is the team's shared record. Developers and AI agents on every machine need it, and it changes in the same pull request as the code |
| `docsSite/` config files                                             | ✅ Committed | So everyone gets the same viewer                                                                                                       |
| `docsSite/node_modules/`, `docsSite/build/`, `docsSite/.docusaurus/` | ❌ Ignored   | Installed and generated files. The `docsSite/.gitignore` from the template covers them                                                 |
| `.env.local` (holds `DOCS_URL`)                                      | ❌ Ignored   | Local settings are never committed                                                                                                     |

**Never add `docs/` to `.gitignore`.** Ignored docs exist on one machine only: the rest of the team, and every agent working from a fresh copy of the repo, would have none.

Nothing in `docs/` is shipped with the app. The build only includes files the app imports, and the app never imports from `docs/`.

:::caution[Public repositories]

Anyone who can read the repository can read its docs. Keep internal projects in a **private** repository.

:::

### How the route is wired

The project's `next.config.mjs` forwards `/docs` to the docs site, but only when `DOCS_URL` is set:

```js title="next.config.mjs"
const DOCS_URL = process.env.DOCS_URL;

/** @type {import("next").NextConfig} */
const nextConfig = {
  async rewrites() {
    // The docs are only served when DOCS_URL is set. It is never set in production.
    if (!DOCS_URL) {
      return [];
    }

    return [
      { source: "/docs", destination: `${DOCS_URL}/docs/` },
      {
        source: "/docs/:path*",
        destination: `${DOCS_URL}/docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

---

## 🚀 Setting it up

1. **Copy the docs.** Copy the [`docs/` templates](/docs/templates#document-templates) into the project's `docs/` folder. Rename `overview/what-is-it.md` after the project (`what-is-launchpad.md`) and update its title.

2. **Copy the viewer.** Copy the [`docsSite/` template](/docs/templates#docs-site) into the project root. Rename `package.json.txt` to `package.json` and `gitignore.txt` to `.gitignore`, set `PROJECT_NAME` in `docusaurus.config.mjs`, and point the home redirect in `src/pages/index.tsx` at the renamed overview file.

3. **Add the route.** Add the rewrite above to `next.config.mjs`.

4. **Add the scripts** to the project's `package.json`:

   ```json
   {
     "scripts": {
       "docs:install": "pnpm --dir docsSite install",
       "docs:dev": "pnpm --dir docsSite start",
       "docs:build": "pnpm --dir docsSite build"
     }
   }
   ```

5. **Set the variable** in `.env.local`:

   ```text
   DOCS_URL=http://localhost:3001
   ```

6. **Run it:**

   ```bash
   pnpm docs:install   # Once
   pnpm docs:dev       # Starts the docs site on port 3001
   pnpm dev            # Starts the project on port 3000
   ```

   Open `http://localhost:3000/docs`.

:::caution[Do not name the script `docs`]

`pnpm docs` is a built-in pnpm command, so a script called `docs` never runs. Use `docs:dev`.

:::

---

## 🤖 For AI agents

- **Read `docs/` before starting work.** Start with the three `overview/` docs, then the docs for the area being changed.
- **Read the files directly.** Do not start the docs site to read them.
- **Check the Status.** `Decided` is settled. `Current plan` may change. `Under evaluation` and `Not started` are **not decisions** — do not treat them as one, and do not invent one. Ask.
- **Update the docs in the same change** as the code, and change the **Updated** date.
- **Write into the matching file.** Create a new file only when a topic has no home, in kebab-case, using the [doc format](#-the-doc-format).
- **Do not edit anything in `docsSite/`** unless the task is about the docs viewer itself.
