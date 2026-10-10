---
sidebar_position: 2
sidebar_label: "Prettier"
---

# Prettier Configuration

A single shared Prettier config keeps formatting consistent and eliminates "style" discussion in code review.

## Installation

```bash
pnpm add -D prettier
```

## Usage

Create `prettier.config.js` in your project root:

```js title="prettier.config.js"
/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  semi: true,
  endOfLine: "lf",
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

## Settings reference

| Option | Value | Rationale |
| --- | --- | --- |
| `printWidth` | `100` | Wider than 80 but avoids the illegibility of unconstrained lines |
| `tabWidth` | `2` | Standard for JS/TS; matches `.editorconfig` |
| `useTabs` | `false` | Spaces are consistent across all editors |
| `singleQuote` | `false` | Double quotes are standard in JSX and HTML; one style for all |
| `trailingComma` | `"all"` | Cleaner diffs when adding items to the end of a list |
| `bracketSpacing` | `true` | `{ foo }` is more readable than `{foo}` |
| `bracketSameLine` | `false` | Closing `>` on its own line for JSX |
| `arrowParens` | `"always"` | `(x) => x` is consistent whether 0, 1, or many params |
| `semi` | `true` | Explicit semicolons avoid ASI footguns |
| `endOfLine` | `"lf"` | Unix line endings everywhere; matches `.editorconfig` |

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
