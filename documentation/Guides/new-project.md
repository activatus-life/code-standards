---
sidebar_position: 2
sidebar_label: "New Project Setup"
---

# Setting Up a New Project

Follow these steps to apply the standards to a new project. Every file mentioned below can be copied from the [Templates](/templates) page.

### 1. Configure ESLint

Install ESLint and its plugins, then create `eslint.config.mjs` in the project root. The [ESLint page](/Standards/eslint) has the install commands and the full config for plain JS, TypeScript, React and Next.js projects.

Add scripts to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### 2. Configure Prettier

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

Create `prettier.config.js` in the project root. See the [Prettier page](/Standards/prettier) for the full file contents.

Add scripts to `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### 3. Add the global stylesheet

Copy the [global stylesheet](/templates#globalscss) to `app/globals.css` and replace the example colours with the project's palette. See [CSS Styling](/Standards/styling#-colours-always-come-from-global-variables).

### 4. Configure Stylelint

For projects with hand-written CSS or SCSS, install Stylelint and create `stylelint.config.mjs`. See the [Stylelint page](/Standards/stylelint) for the full file contents.

### 5. Add EditorConfig

Copy the standard `.editorconfig` to your project root. See the [EditorConfig page](/Standards/editorconfig) for the full file contents.

### 6. Set the Node version

Add `.nvmrc` and `.envrc` so the right Node version is selected on `cd`. See the [direnv + nvm page](/Standards/direnv).

### 7. Create AGENTS.md

Copy the [AGENTS.md template](/templates#agents) to the project root and replace every `[placeholder]`.

### 8. Add the agent skills

Copy the eight [standard skill files](/templates#skills) into `.agents/skills/`, and again into `.claude/commands/`.

### 9. Set up the docs

Copy the [`documentation/` templates](/templates#document-templates) and the [`documentationSite/` viewer](/templates#documentation-site) into the project root, add the `/documentation` route, and set `DOCUMENTATION_URL` in `.env.local`. Follow [Setting it up](/Standards/documentation#-setting-it-up) on the Documentation page.

Every doc starts as `Not started`. Fill in the `pitch/` and `scope/` docs before any code.

### 10. Add commit message checks

Install Commitlint and the two Husky hooks: one checks the commit message, the other runs `pnpm lint` so code that breaks the standards cannot be committed. See [Enforcing commit messages](/Standards/conventional-commits#enforcing-commit-messages).

### 11. Add CI checks

```yaml
- name: Lint
  run: pnpm lint

- name: Format check
  run: pnpm format:check
```
