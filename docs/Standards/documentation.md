---
sidebar_position: 0.5
---

# Documentation

Every project documents itself the same way, so a developer or an AI agent can open any Activatus project and find what they need in the same place.

## How it works

| Part | What it is | Where it lives |
| --- | --- | --- |
| **The docs** | Plain Markdown files | `docs/` in the project root |
| **The viewer** | A Docusaurus site that displays those files | `docsSite/` in the project root |
| **The route** | The docs appear at `/docs` in the running project | Switched on by the `DOCS_URL` environment variable |

The docs are written once, as Markdown, and read two ways:

- **AI agents** read the files in `docs/` directly. No build, no server.
- **People** browse them at `/docs`, with a sidebar, search and page contents — the same layout as this site.

---

## 📁 Where docs live

```text
project-root/
├── docs/                        # The docs: plain Markdown
│   ├── index.md                 # Overview — the front page at /docs
│   ├── scope/                   # What is being built, and what is not
│   │   └── project-scope.md
│   ├── design/                  # How it is built
│   │   └── system-design.md
│   ├── decisions/               # Why it is built that way — one file per decision
│   │   └── use-tailwind-for-styling.md
│   ├── guides/                  # How to run it, deploy it and fix it
│   │   └── running-locally.md
│   └── standards/               # Local copy of the code standards (optional)
└── docsSite/                    # The viewer: Docusaurus config only, no content
    ├── docusaurus.config.ts
    ├── sidebars.ts
    └── package.json
```

| Folder | Holds | When it is written |
| --- | --- | --- |
| `docs/scope/` | Goals, users, requirements, what is in and out of scope | Before any code |
| `docs/design/` | How the system works: the parts, the data, the key flows | Before building a feature |
| `docs/decisions/` | One page per significant decision: what was chosen, why, and what was rejected | When the decision is made |
| `docs/guides/` | Step-by-step instructions: run locally, deploy, fix common problems | Before the work ships |
| `docs/standards/` | A local copy of these standards. Only when the project keeps its standards locally instead of reading them from this site | Once, at setup |

**`docs/` holds only Markdown.** The Docusaurus config, its dependencies and its build output all stay in `docsSite/`, so the docs folder is clean for an agent to read.

---

## 🌐 The `/docs` route

The docs appear at `/docs` inside the running project — `http://localhost:3000/docs` — in the same layout as this site.

They are switched on by one environment variable:

| `DOCS_URL` | What happens at `/docs` |
| --- | --- |
| Set (`http://localhost:3001`) | The docs are shown |
| Not set | `404` — the route does not exist |

### ⛔ Never in production

**`DOCS_URL` is never set in production.** With it unset, the project has no `/docs` route at all, so internal docs cannot be reached on a live site.

- Set it in `.env.local` for local development.
- Set it on a staging or preview environment only if the team wants the docs there.
- **Do not add it to the production environment.**

The docs site also sets `noIndex`, so search engines are told not to index it wherever it is running.

### What goes in Git

**The docs are committed. They are not published.** Committing a file to the repository and serving it on the live site are two different things.

| Item | In Git? | Why |
| --- | --- | --- |
| `docs/` | ✅ Committed | It is the team's shared record. Developers and AI agents on every machine need it, and it changes in the same pull request as the code |
| `docsSite/` config files | ✅ Committed | So everyone gets the same viewer |
| `docsSite/node_modules/`, `docsSite/build/`, `docsSite/.docusaurus/` | ❌ Ignored | Installed and generated files. The `docsSite/.gitignore` from the template covers them |
| `.env.local` (holds `DOCS_URL`) | ❌ Ignored | Local settings are never committed |

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
      { source: "/docs/:path*", destination: `${DOCS_URL}/docs/:path*` },
    ];
  },
};

export default nextConfig;
```

---

## 🚀 Setting it up

1. **Copy the viewer.** Copy the [`docsSite/` template](/templates#docs-site) into the project root. Rename `gitignore.txt` to `.gitignore`, and set `PROJECT_NAME` in `docusaurus.config.ts`.

2. **Copy the document templates.** Copy the [`docs/` templates](/templates#document-templates) into the project's `docs/` folder.

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

## 🧭 Routing and layout

Routing and the sidebar come from the folder structure. There is no menu file to maintain.

| File | URL | Sidebar |
| --- | --- | --- |
| `docs/index.md` | `/docs` | Overview |
| `docs/scope/project-scope.md` | `/docs/scope/project-scope` | Scope → Project Scope |
| `docs/decisions/use-tailwind-for-styling.md` | `/docs/decisions/use-tailwind-for-styling` | Decisions → Use Tailwind for Styling |

- **The URL is the file path.** Move the file and the URL moves with it. This is why doc files are named in kebab-case.
- **The sidebar label is the page's `# Heading`.**
- **Each folder has a `_category_.json`** that sets its sidebar label and order. They come with the templates.
- **The layout is the stock Docusaurus theme**, the same as this site. Do not restyle it per project — `docsSite/src/css/custom.css` stays empty.

---

## ✍️ Writing a doc

### Start from a template

Every type of doc has a template with the same headings. Copy it — do not invent a layout.

| Doc | Template | Copy to |
| --- | --- | --- |
| Overview | [`index.md`](/templates#doc-index) | `docs/index.md` |
| Project scope | [`project-scope.md`](/templates#doc-scope) | `docs/scope/` |
| System design | [`system-design.md`](/templates#doc-design) | `docs/design/` |
| Decision record | [`decision-record.md`](/templates#doc-decision) | `docs/decisions/`, renamed after the decision |
| Guide | [`guide.md`](/templates#doc-guide) | `docs/guides/`, renamed after the task |

### Rules

- **File names are kebab-case**: `project-scope.md`, not `projectScope.md`. The file name becomes the page's URL, and URLs are lower-case words joined by hyphens.
- **One topic per file.** A decision record covers one decision. A guide covers one task.
- **Plain Markdown (`.md`).** No JSX or imports, so every file reads the same for an agent as it does on the page.
- **One `# Heading` per file**, at the top. It becomes the page title and the sidebar label.
- **Draw diagrams with Mermaid** in a ` ```mermaid ` code block, so the diagram is text and stays in the file.
- **Link to other docs with a relative path** — `[scope](../scope/project-scope.md)` — so the link works in the file and on the site.
- **Write for someone who has never seen the project.** Full sentences, full English words, no shorthand.

### Status

Every doc starts with a status, so a reader knows whether to trust it:

```md
---
status: current
lastReviewed: 2026-10-11
---
```

| Status | Meaning |
| --- | --- |
| `draft` | Still being written. Do not rely on it |
| `current` | Correct as of `lastReviewed` |
| `superseded` | Replaced. Say what replaced it at the top of the page |

Never delete a superseded decision record — mark it `superseded` and link to the one that replaced it. The history is the point.

---

## 🔁 The flow

Docs are written at set points in the work, not at the end.

| When | What gets written | Where |
| --- | --- | --- |
| Before any code | The scope: what is being built and what is not | `docs/scope/` |
| Before building a feature | The design: how it will work | `docs/design/` |
| When a significant choice is made | A decision record | `docs/decisions/` |
| Before the work ships | The guides: run, deploy, fix | `docs/guides/` |
| With every change | Whichever doc the change makes wrong | The same pull request as the code |

### Not finished until the docs are updated

**A change is not finished until the docs match it.** If a change makes a doc wrong, the doc is fixed in the same change — the same rule as [test files](/Standards/readable-code#every-function-and-component-has-a-test-file).

This applies to everyone writing code, **including AI agents**. An agent that changes how something works updates the doc that describes it, and creates a decision record when it makes a significant choice.

---

## 🤖 For AI agents

- **Read `docs/` before starting work.** Start with `docs/index.md`, then the scope and design docs for the area being changed.
- **Read the files directly.** Do not start the docs site to read them.
- **Update the docs in the same change** as the code. Set `lastReviewed` to today's date on any doc you change.
- **Use the templates** for new docs, and name files in kebab-case (`project-scope.md`).
- **Do not edit anything in `docsSite/`** unless the task is about the docs viewer itself.
