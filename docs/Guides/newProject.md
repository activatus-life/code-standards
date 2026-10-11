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
pnpm add -D prettier
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

### 3. Configure Stylelint

For projects with hand-written CSS or SCSS, install Stylelint and create `stylelint.config.mjs`. See the [Stylelint page](/Standards/stylelint) for the full file contents.

### 4. Add EditorConfig

Copy the standard `.editorconfig` to your project root. See the [EditorConfig page](/Standards/editorconfig) for the full file contents.

### 5. Set the Node version

Add `.nvmrc` and `.envrc` so the right Node version is selected on `cd`. See the [direnv + nvm page](/Standards/direnv).

### 6. Create AGENTS.md

Copy the [AGENTS.md template](/templates#agents) to the project root and replace every `[placeholder]`.

### 7. Add the agent skills

Copy the eight [standard skill files](/templates#skills) into `.agents/skills/`, and again into `.claude/commands/`.

### 8. Set up the docs

Copy the [`docs/` templates](/templates#document-templates) and the [`docsSite/` viewer](/templates#docs-site) into the project root, add the `/docs` route, and set `DOCS_URL` in `.env.local`. Follow [Setting it up](/Standards/documentation#-setting-it-up) on the Documentation page.

Write the [project scope](/Standards/documentation#-the-flow) before any code.

### 9. Add commit message checks

Install Commitlint and the Husky hook. See [Enforcing commit messages](/Standards/conventionalCommits#enforcing-commit-messages).

### 10. Add CI checks

```yaml
- name: Lint
  run: pnpm lint

- name: Format check
  run: pnpm format:check
```
