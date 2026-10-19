# 🦘 Activatus Code Standards

## 👋 About Code Standards

**One way of doing things, written down, so nobody has to guess.**

This is the rulebook for how we write code at Activatus. It's a docs site, a pile of copy-paste config files, and a set of lint rules that'll dob you in before your reviewer has to.

The whole point: you should be able to wander into any Activatus project at 4pm on a Friday and know exactly where everything lives, like walking into a mate's shed and finding the 10mm socket first go.

---

## 🤔 Why this exists

Every team says they've got standards. Most of them live in one bloke's head and a Slack thread from 2022.

Ours live here. If it's not in this repo, it's not a standard, it's an opinion.

- 🧠 **Readable by humans.** If a new starter can't follow a file, the file's wrong, not the new starter.
- 🤖 **Readable by AI.** Claude Code and friends follow the same rules we do. No special treatment.
- 🚨 **Enforced by the linter where we can.** Rules that rely on everyone remembering are rules that get forgotten.

---

## 📦 Using it in a project

The standards ship as an npm package, published on npm (npmjs.com) and installed with pnpm, so an AI agent reads the exact version a project uses, straight from `node_modules`:

```bash
pnpm add -D @activatus/code-standards
```

Then tell your agent: **"Follow the Activatus Code Standards. Start with `node_modules/@activatus/code-standards/docs/Guides/setup.md`."** It prints a numbered list of the standards, you say which ones you don't want, and it sets up the rest. You never touch the terminal.

The package version is the standards version: `3.0.0` is version 3.

> 🔢 **Updating a project to newer standards?** Run `pnpm update @activatus/code-standards --latest`, then point the agent at the **[Version History](https://activatus-code-standards.vercel.app/docs/version-history)**: it reads only the versions newer than the project's, does exactly what each one says, and bumps the number. Cheaper than shouting the whole pub a round.

---

## 🚀 Get it running

You'll need **Node 20+** and **pnpm**.

```bash
pnpm install
pnpm start
pnpm serve
```

That fires up the site locally with hot reload. Easy as.

The live site is at **[activatus-code-standards.vercel.app](https://activatus-code-standards.vercel.app)**. That's the link to share.

| Command          | What it does                                 |
| ---------------- | -------------------------------------------- |
| `pnpm start`     | 🔥 Dev server with hot reload                |
| `pnpm build`     | 📦 Builds the static site into `build/`      |
| `pnpm serve`     | 👀 Serves the built site so you can check it |
| `pnpm typecheck` | 🔍 Runs TypeScript over the site config      |
| `pnpm format`    | ✨ Formats everything with Prettier          |

> 🔎 **Search only works on the built site.** Run `pnpm build` then `pnpm serve` if you want to test it. It won't show up in `pnpm start`, so don't go thinking you've broken it.

> 🐌 **Install carking it on a slow connection?** One of the packages is a big unit. Run `pnpm install --fetch-timeout 600000` and go put the kettle on.

---

## 📚 What's in the box

| Section                                                                                                      | What you'll find                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 📋 **Templates**                                                                                             | Ready-to-copy `AGENTS.md`, ESLint, Prettier, Stylelint and friends                                                                                    |
| 📖 **Ontology**                                                                                              | The code words we use and what each one means                                                                                                         |
| 🔢 **[Version History](https://activatus-code-standards.vercel.app/docs/version-history)**                   | What changed in each version, and what a project has to do about it. Updating a project? Read only the versions newer than the one in its `AGENTS.md` |
| 🧭 **Guides**                                                                                                | Setting up a new project, dragging an old one up to scratch, and how design becomes code                                                              |
| 📏 **Standards**                                                                                             | Readable code, linting, formatting, styling, the tech stack and AI agent rules                                                                        |
| 🏗️ **Structure**                                                                                             | Folders, components, naming, imports and API routes                                                                                                   |
| 🧩 **[Design System Components](https://activatus-code-standards.vercel.app/docs/design-system-components)** | Every standard component and its props, so each project builds them the same way                                                                      |

---

## ⚡ The rules, at pub-yarn speed

The full detail's on the site. This is the version you'd tell someone over a schooner.

### ✍️ Writing code

- 📄 **No file over 300 lines.** If it's longer, it's doing two jobs. Split it. (Test files get a leave pass.)
- 🗣️ **Every name is real English words.** Variables, props, form fields, types, files, folders, the lot. `button`, not `btn`. We're not paying by the letter. The one exception: names someone else owns, like Linear's `id` or Node's `cwd` option.
- 🔒 **Always `const`.** Need `let`? Fine, but leave a comment saying why, or the linter knocks it back.
- 🏹 **Arrow functions everywhere.** `const Button = () => {}`. The word `function` is clutter, so we don't use it.
- 🔄 **No circular imports. Ever.** If two files import each other, pull the shared bit into a third file.
- 🎯 **A function does one thing.** If you need the word "and" to describe it, it's two functions.
- 🧪 **Every function and component gets a test file.** One test file, one thing tested. No test, not finished.
- 🚫 **Functions, never classes.** Not even a little one.
- 📦 **One parameter per function.** Need more? Pass an object, so the call explains itself.
- 🚪 **Return early.** Deal with the dodgy cases up top instead of nesting four `if`s deep like a set of Russian dolls.
- 🔢 **No magic numbers.** `MAXIMUM_RETRY_ATTEMPTS`, not a random `3` sitting there like it owns the place.
- 🏷️ **Type names end in `Props` or `Type`.** So you can tell what you're looking at.
- 💬 **Comments explain why, not what.** And no commented-out code. Git remembers, you don't have to.

### 🎨 Styling

- 🌬️ **Tailwind for everything.**
- 📐 **Flexbox first.** Split layouts into child components. Only use CSS grid if someone specifically asks for it.
- 🎨 **Colours come from the global palette. Full stop.** No hard-coded hex, no one-off values. If the colour's not in the palette, it's not in the build.

### 📖 Docs

- 📝 **Docs are plain Markdown in `docs/`, and every file is a Decision Doc.** Same folders in every project. Agents read the files; humans browse them at `/docs`.
- 🔒 **`/docs` only exists when `DOCS_URL` is set.** It's never set in production, so the docs never leak onto a live site.
- ✅ **Not finished until the docs are updated.** Change how something works, fix the doc in the same change.

### 🤖 Workflow is the project's call

- 🧭 **Branches, commit messages, Pull Requests and whether AI agents may commit are up to each project.** Every team runs its work differently, so it goes in the project's own `AGENTS.md` and docs, not here. These standards are the base for the code itself.

### 📦 Third-party code

- 📦 **Third-party code is exempt.** Anything in `node_modules/` or `vendor/` isn't ours. Don't lint it, don't tidy it, leave it be.

### 🗂️ Structure

- 🐫 **Code files are camelCase.** Components are PascalCase (`Button.tsx`) inside a camelCase folder (`button/`).
- 🔗 **If it becomes a URL, it's kebab-case.** Route folders and doc files (`background-jobs.md`). CSS variables too.
- 🧰 **Reusable functions live in `utils/`.** Global, section or component level, one folder per function, with an `index.ts` so imports stay tidy.
- 📍 **Components live where they're used.** Design System Components in `components/ui/`, anything used on more than one page in `components/shared/`, and one-page components in that page's own `components/` folder. No feature folders.
- 🧱 **Components follow the same order every time.** Imports, component, variables, state, effects, render. No inline functions in the render.
- 🔀 **Server and client code live in separate files.** The server one wraps the client one.

---

## 📋 Just want the files?

Fair enough. Head to the **Templates** page on the site, or grab them straight from [`static/templates/`](https://github.com/activatus-life/code-standards/tree/main/static/templates):

```text
static/templates/
├── AGENTS.md               # 🤖 Context file for AI agents
├── skills/                 # 🛠️ Eight ready-made agent skills
├── docs/                   # 📖 The full set of Decision Doc templates, one per standard folder
├── docsSite/               # 🌐 Docusaurus viewer that shows docs/ at /docs
├── eslint/                 # 🚨 Four flavours: base, typescript, react, nextjs
├── stylelint/              # 💅 CSS and SCSS
├── prettier.config.mjs     # ✨ Formatting
├── globals.css             # 🎨 Tailwind + starter colour palette
├── .editorconfig           # ⌨️ Editor whitespace rules
└── .nvmrc / .envrc         # 🟢 Node version switching
```

Copy them. Don't retype them. The ESLint ones have been run against real code, so they actually work, which is more than you can say for most configs floating around the internet.

---

## 🗺️ Finding your way around this repo

```text
.
├── docs/                   # 📝 Every page on the site, as Markdown
│   ├── Guides/
│   ├── Standards/
│   └── Structure/
├── static/
│   ├── images/             # 🖼️ Logo and favicon
│   └── templates/          # 📋 The copy-paste files
├── src/css/custom.css      # 🎨 Site theme overrides
├── docusaurus.config.mjs   # ⚙️ Site config
└── sidebars.mjs            # 📑 Sidebar (builds itself from docs/)
```

Built with [Docusaurus](https://docusaurus.io). The sidebar generates itself from the folders, so there's no menu file to forget about.

---

## ✏️ Changing a standard

Reckon a rule's wrong, or there's one missing? Good. Standards that never change are standards nobody reads.

1. 🌿 **Branch off `main`**, named after the ticket (`ACT-14-update-eslint-page`), or `type/short-description` if there's no ticket (`docs/update-eslint-page`).
2. 📝 **Edit or add a Markdown file in `docs/`.** Name it in kebab-case (`naming-conventions.md`, not `namingConventions.md`), because the file name becomes the page's URL. Yes, we follow our own rules here.
3. 📋 **Changing a config?** Edit the file in `static/templates/` and the matching page in `docs/Standards/` so the two don't drift apart. For an ESLint config, run `pnpm check:eslint-templates`: it lints each config against itself and fails if the ESLint page shows an old copy. Add `--update-docs` to copy the configs onto the page.
4. 🔢 **Add a version** to `docs/version-history.md`: what changed, and what a project has to do about it. Bump the major version in `package.json` to match (version 3 is `3.0.0`), and publish it to npm (npmjs.com) once it's merged. We use pnpm for everything, so that's `pnpm publish`, which lands in the same npm registry as `npm publish`. Projects read only the new versions, so if it's not in there, nobody hears about it.
5. 🔨 **Run `pnpm build`.** It fails on broken links, so you'll know quick smart if you've stuffed one.
6. 🚀 **Open a pull request** and say why the change makes life better.

A good rule of thumb: if you can't explain the rule to a new starter in one sentence, it's not ready.

---

## 🚧 Before this goes live

- [ ] 🖼️ **Swap in the real logo.** `static/images/logo.svg` is a stand-in.

---

## 💚 The short version

Write code the next person can read. Test it. Keep it small. Follow the pattern.

Do that and we'll all get home on time.
