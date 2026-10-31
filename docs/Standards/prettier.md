---
sidebar_position: 2
sidebar_label: "Prettier"
---

# Prettier Configuration

A single shared Prettier config keeps formatting consistent and eliminates "style" discussion in code review.

## Installation

```bash
pnpm add -D prettier @ianvs/prettier-plugin-sort-imports prettier-plugin-tailwindcss
```

## Usage

Create `prettier.config.mjs` in your project root:

```js title="prettier.config.mjs"
/** @type {import("prettier").Config & import("@ianvs/prettier-plugin-sort-imports").PluginConfig & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
	// Short lines, so code reads well on a phone.
	printWidth: 70,
	// Tabs indent. A tab counts as 2 characters towards the line width.
	useTabs: true,
	tabWidth: 2,
	singleQuote: false,
	trailingComma: "all",
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: "always",
	semi: true,
	endOfLine: "lf",
	// The Tailwind plugin must stay last.
	plugins: [
		"@ianvs/prettier-plugin-sort-imports",
		"prettier-plugin-tailwindcss",
	],
	// Node's own modules, packages, the project's @/ aliases, then
	// ../ and ./, with a blank line between groups. Side-effect
	// imports, such as CSS, never move.
	importOrder: [
		"<BUILTIN_MODULES>",
		"",
		"<THIRD_PARTY_MODULES>",
		"",
		"^@/",
		"",
		"^[.][.]/",
		"",
		"^[.]/",
	],
	tailwindStylesheet: "./app/globals.css",
	overrides: [
		{
			// YAML does not allow tabs, and Markdown reads a tab as four spaces.
			files: ["*.md", "*.mdx", "*.yml", "*.yaml"],
			options: { useTabs: false },
		},
	],
};

export default config;
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "format": "git ls-files -z --cached --others --exclude-standard | xargs -0 prettier --write --ignore-unknown --no-error-on-unmatched-pattern",
    "format:check": "git ls-files -z --cached --others --exclude-standard | xargs -0 prettier --check --ignore-unknown --no-error-on-unmatched-pattern"
  }
}
```

**Do not shorten these to `prettier --write .` and `prettier --check .`** The long form is deliberate: git lists the files, so every git ignore rule applies. See [What Prettier skips](#what-prettier-skips).

## What Prettier skips

Both scripts work on the same list of files: every file git tracks, plus every new file git has not been told to ignore. **Never narrow them to changed files**: a badly formatted file nobody touched still fails CI.

**Why git lists the files.** On its own, Prettier reads only the project's `.gitignore` and `.prettierignore`. It does not read `.git/info/exclude` or a person's global git ignore, such as `~/.config/git/ignore`. Files a person keeps out of git that way, such as `.claude/settings.local.json`, would be checked by `prettier --check .` and rewritten by `prettier --write .`, so `format:check` failed on that one machine while CI passed. `git ls-files --exclude-standard` applies every git ignore rule, so those files never reach Prettier. `--no-error-on-unmatched-pattern` stops a file deleted but not yet committed from causing an error.

**Where each kind of file is ignored:**

| File                                                                      | Where it goes                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| One person's local tool files, such as `.claude/settings.local.json`      | That person's `.git/info/exclude` or global git ignore. Never `.prettierignore` |
| Files the whole project keeps out of git, such as `build/`                | `.gitignore`                                                                    |
| Files in git that Prettier must not format, such as `pnpm-workspace.yaml` | `.prettierignore`, shared by the whole project                                  |
| `AGENTS.md`, `.agents/skills/` and `.claude/commands/`                    | `.prettierignore`, shared by the whole project                                  |

pnpm rewrites `pnpm-workspace.yaml` in its own style on every install, so it always goes in `.prettierignore`. So do `AGENTS.md` and the agent skills: they are copied from the standards, and `pnpm standards:check` compares them word for word, so a Prettier rewrite would fail it. The template has all four: copy `static/templates/.prettierignore`.

```text title=".prettierignore"
pnpm-workspace.yaml
AGENTS.md
.agents/skills/
.claude/commands/
```

## Tailwind class sorting

The config includes [`prettier-plugin-tailwindcss`](https://github.com/tailwindlabs/prettier-plugin-tailwindcss), the official Tailwind plugin. It sorts the classes in every `className` into one standard order when the file is formatted, so the same classes are always written the same way:

```tsx
// Before formatting
<button className="text-white px-8 hover:bg-brand-primary-hover rounded-md bg-brand-primary py-4 flex">

// After formatting
<button className="flex rounded-md bg-brand-primary px-8 py-4 text-white hover:bg-brand-primary-hover">
```

- **It is part of the standard**, not a project extra. Every project that uses Tailwind has it.
- **`tailwindStylesheet` points at the project's global stylesheet**, so the plugin knows the project's own colours. Change the path if `globals.css` lives somewhere else.
- **A project with no Tailwind** (a plain Node.js service) removes `prettier-plugin-tailwindcss` from `plugins`, and the `tailwindStylesheet` line.

## Import sorting {#import-sorting}

The config includes [`@ianvs/prettier-plugin-sort-imports`](https://github.com/IanVS/prettier-plugin-sort-imports). It sorts the imports of every file when the file is formatted, so **nobody sorts imports by hand, and agents never reorder them themselves**: `pnpm format`, or saving in the editor, does it.

```tsx
"use client";

import { readFileSync } from "node:fs";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui";
import { r, s } from "@/lib/constants";

import { formatDate } from "../utils/formatDate";

import type { SampleProps } from "./Sample.types";

import "./sample.css";
```

- **The groups, in order:** Node's own modules (`node:fs`), packages, the project's `@/` aliases, parent folders (`../`), then the same folder (`./`). Each group is alphabetical, with a blank line between groups.
- **Directives such as `"use client"` stay at the top.**
- **Side-effect imports never move**, such as `import "./globals.css";`, because the order they load in can matter. The plugin sorts the imports above and below one separately. **Put them after every other import**, so the rest sort as one block. Never add a setting that moves them.
- **Type imports stay on their own line**, `import type { CardProps } from "./Card.types";`. Leave `importOrderTypeScriptVersion` unset: setting it to 4.5 or above merges type imports into value imports.
- **`prettier-plugin-tailwindcss` stays last in `plugins`.** The Tailwind plugin needs that to work beside other plugins.
- **Switching it on reorders the imports in most files.** Do it in a commit of its own, with nothing else in it, so the reordering never hides a real change in a review.

## Settings reference

| Option            | Value      | Rationale                                                                                                   |
| ----------------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| `printWidth`      | `70`       | Short lines read well on a phone, where a lot of code is reviewed                                           |
| `tabWidth`        | `2`        | How many characters a tab counts as towards the line width; matches `.editorconfig`                         |
| `useTabs`         | `true`     | Tabs indent code: each person sees the width they like, and files are smaller. Markdown and YAML use spaces |
| `singleQuote`     | `false`    | Double quotes are standard in JSX and HTML; one style for all                                               |
| `trailingComma`   | `"all"`    | Cleaner diffs when adding items to the end of a list                                                        |
| `bracketSpacing`  | `true`     | `{ foo }` is more readable than `{foo}`                                                                     |
| `bracketSameLine` | `false`    | Closing `>` on its own line for JSX                                                                         |
| `arrowParens`     | `"always"` | `(x) => x` is consistent whether 0, 1, or many params                                                       |
| `semi`            | `true`     | Explicit semicolons avoid ASI footguns                                                                      |
| `endOfLine`       | `"lf"`     | Unix line endings everywhere; matches `.editorconfig`                                                       |

## Editor integration

### VS Code

Install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension, then add to your workspace settings:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

### JetBrains IDEs

Go to **Settings → Languages & Frameworks → JavaScript → Prettier** and enable "Run on save".
