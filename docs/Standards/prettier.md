---
sidebar_position: 2
sidebar_label: "Prettier"
---

# Prettier Configuration

A single shared Prettier config keeps formatting consistent and eliminates "style" discussion in code review.

## Installation

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

## Usage

Create `prettier.config.mjs` in your project root:

```js title="prettier.config.mjs"
/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
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
	plugins: ["prettier-plugin-tailwindcss"],
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
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
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
- **A project with no Tailwind** (a plain Node.js service) removes the `plugins` and `tailwindStylesheet` lines.

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
