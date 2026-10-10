# 🦘 Activatus Code Standards

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

## 🚀 Get it running

You'll need **Node 20+** and **pnpm**.

```bash
pnpm install
pnpm start
```

That fires up the site locally with hot reload. Easy as.

| Command | What it does |
| --- | --- |
| `pnpm start` | 🔥 Dev server with hot reload |
| `pnpm build` | 📦 Builds the static site into `build/` |
| `pnpm serve` | 👀 Serves the built site so you can check it |
| `pnpm typecheck` | 🔍 Runs TypeScript over the site config |

> 🔎 **Search only works on the built site.** Run `pnpm build` then `pnpm serve` if you want to test it. It won't show up in `pnpm start`, so don't go thinking you've broken it.

> 🐌 **Install carking it on a slow connection?** One of the packages is a big unit. Run `pnpm install --fetch-timeout 600000` and go put the kettle on.

---

## 📚 What's in the box

| Section | What you'll find |
| --- | --- |
| 📋 **Templates** | Ready-to-copy `AGENTS.md`, ESLint, Prettier, Stylelint and friends |
| 🧭 **Guides** | Setting up a new project, dragging an old one up to scratch, and how design becomes code |
| 📏 **Standards** | Readable code, linting, formatting, styling, commits, the tech stack and AI agent rules |
| 🏗️ **Structure** | Folders, components, naming, imports and API routes |
| 🧩 **Template Components** | The standard component library, listed out |

---

## ⚡ The rules, at pub-yarn speed

The full detail's on the site. This is the version you'd tell someone over a schooner.

### ✍️ Writing code

- 📄 **No file over 300 lines.** If it's longer, it's doing two jobs. Split it. (Test files get a leave pass.)
- 🗣️ **Names are real English words.** `button`, not `btn`. `error`, not `e`. We're not paying by the letter.
- 🎯 **A function does one thing.** If you need the word "and" to describe it, it's two functions.
- 🧪 **Every function and component gets a test file.** One test file, one thing tested. No test, not finished.
- 🚫 **Functions, never classes.** Not even a little one.
- 📦 **One parameter per function.** Need more? Pass an object, so the call explains itself.
- 🚪 **Return early.** Deal with the dodgy cases up top instead of nesting four `if`s deep like a set of Russian dolls.
- 🔢 **No magic numbers.** `MAX_RETRY_ATTEMPTS`, not a random `3` sitting there like it owns the place.
- 🏷️ **Type names end in `Props` or `Type`.** So you can tell what you're looking at.
- 💬 **Comments explain why, not what.** And no commented-out code. Git remembers, you don't have to.

### 🎨 Styling

- 🌬️ **Tailwind for everything.**
- 📐 **Flexbox first.** Split layouts into child components. Only use CSS grid if someone specifically asks for it.
- 🎨 **Colours come from the global palette. Full stop.** No hard-coded hex, no one-off values. If the colour's not in the palette, it's not in the build.

### 🗂️ Structure

- 🐫 **Files are camelCase.** Components are PascalCase (`Button.tsx`) inside a camelCase folder (`button/`). CSS variables are the one exception: kebab-case.
- 🧰 **Reusable functions live in `utils/`.** Global, feature or component level, one folder per function, with an `index.ts` so imports stay tidy.
- 🧱 **Components follow the same order every time.** Imports, component, variables, state, effects, render. No inline functions in the render.
- 🔀 **Server and client code live in separate files.** The server one wraps the client one.

---

## 📋 Just want the files?

Fair enough. Head to the **Templates** page on the site, or grab them straight from [`static/templates/`](static/templates):

```text
static/templates/
├── AGENTS.md               # 🤖 Context file for AI agents
├── eslint/                 # 🚨 Four flavours: base, typescript, react, nextjs
├── stylelint/              # 💅 CSS and SCSS
├── prettier.config.js      # ✨ Formatting
├── globals.css             # 🎨 Tailwind + starter colour palette
├── .editorconfig           # ⌨️ Editor whitespace rules
├── .nvmrc / .envrc         # 🟢 Node version switching
└── .commitlintrc.json      # 📝 Commit message rules
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
│   ├── img/                # 🖼️ Logo and favicon
│   └── templates/          # 📋 The copy-paste files
├── src/css/custom.css      # 🎨 Site theme overrides
├── docusaurus.config.ts    # ⚙️ Site config
└── sidebars.ts             # 📑 Sidebar (builds itself from docs/)
```

Built with [Docusaurus](https://docusaurus.io). The sidebar generates itself from the folders, so there's no menu file to forget about.

---

## ✏️ Changing a standard

Reckon a rule's wrong, or there's one missing? Good. Standards that never change are standards nobody reads.

1. 🌿 **Branch off `main`.**
2. 📝 **Edit or add a Markdown file in `docs/`.** Name it in camelCase (`namingConventions.md`, not `naming-conventions.md`). Yes, we follow our own rules here.
3. 📋 **Changing a config?** Edit the file in `static/templates/` and the matching page in `docs/Standards/` so the two don't drift apart.
4. 🔨 **Run `pnpm build`.** It fails on broken links, so you'll know quick smart if you've stuffed one.
5. 🚀 **Open a pull request** and say why the change makes life better.

A good rule of thumb: if you can't explain the rule to a new starter in one sentence, it's not ready.

---

## 🚧 Before this goes live

- [ ] 🌐 **Set the real site URL.** `docusaurus.config.ts` still has a placeholder (`code-standards.example.com`). Swap it for the real domain before deploying.
- [ ] 🖼️ **Swap in the real logo.** `static/img/logo.svg` is a stand-in.
- [ ] 🔗 **Update the standards link in the `AGENTS.md` template** once the domain's sorted.

---

## 💚 The short version

Write code the next person can read. Test it. Keep it small. Follow the pattern.

Do that and we'll all get home on time.
