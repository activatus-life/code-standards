---
sidebar_position: 5
sidebar_label: "Stylelint"
---

# Stylelint Configuration

Components are styled with [Tailwind CSS](/Standards/styling), and Stylelint lints the CSS that is still written by hand — `globals.css` and any CSS Modules. Start from the config below that matches the project:

| Config                                  | Use when                                  |
| --------------------------------------- | ----------------------------------------- |
| [Plain CSS](#plain-css-and-css-modules) | Plain CSS and CSS Modules (`.module.css`) |
| [SCSS](#scss)                           | SCSS / Sass                               |

## Installation

```bash
pnpm add -D stylelint stylelint-config-standard stylelint-config-recess-order
```

For SCSS projects, install `stylelint-config-standard-scss` in place of `stylelint-config-standard`:

```bash
pnpm add -D stylelint stylelint-config-standard-scss stylelint-config-recess-order
```

## Usage

Create `stylelint.config.mjs` in your project root:

### Plain CSS and CSS Modules

```js title="stylelint.config.mjs"
/** @type {import("stylelint").Config} */
export default {
  ignoreFiles: ["**/vendor/**"],
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order",
  ],
  rules: {
    "selector-max-id": 0,
    "property-no-vendor-prefix": true,
    "color-function-notation": "modern",
    "import-notation": "string",
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "theme",
          "utility",
          "variant",
          "custom-variant",
          "source",
          "plugin",
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.module.css"],
      rules: {
        "color-named": "never",
        "color-no-hex": true,
        "selector-class-pattern": [
          "^[a-z][a-zA-Z0-9]*$",
          { message: "Expected class selector to be camelCase" },
        ],
      },
    },
  ],
};
```

### SCSS

```js title="stylelint.config.mjs"
/** @type {import("stylelint").Config} */
export default {
  ignoreFiles: ["**/vendor/**"],
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recess-order",
  ],
  rules: {
    "selector-max-id": 0,
    "property-no-vendor-prefix": true,
    "color-function-notation": "modern",
  },
};
```

### Project-specific overrides

Add to the `rules` block:

```js
export default {
  // ...
  rules: {
    // ...
    // project-specific overrides
    "selector-max-type": 3,
  },
};
```

Add a lint script to `package.json`:

```json
{
  "scripts": {
    "lint:css": "stylelint \"**/*.{css,scss}\"",
    "lint:css:fix": "stylelint \"**/*.{css,scss}\" --fix"
  }
}
```

## Extended configs

| Config                           | Used by                   | Purpose                                  |
| -------------------------------- | ------------------------- | ---------------------------------------- |
| `stylelint-config-standard`      | Plain CSS and CSS Modules | Stylelint's recommended modern CSS rules |
| `stylelint-config-standard-scss` | SCSS                      | Standard rules + SCSS-specific rules     |
| `stylelint-config-recess-order`  | all                       | Enforces Bootstrap/RECESS property order |

## Property order

Properties are sorted using the [RECESS order](https://github.com/stordahl/stylelint-config-recess-order) (the same order used by Bootstrap). The broad grouping:

1. Positioning (`position`, `top`, `z-index`, …)
2. Box model (`display`, `width`, `margin`, `padding`, …)
3. Typography (`font`, `line-height`, `color`, …)
4. Visual (`background`, `border`, `opacity`, …)
5. Misc (`transition`, `animation`, …)

## Key rule decisions

### `selector-max-id: 0`

ID selectors create specificity that is nearly impossible to override without escalating to `!important`. Use classes instead.

### `property-no-vendor-prefix: true`

Vendor prefixes should be added by **Autoprefixer** in the build pipeline, not written by hand. Hand-written prefixes become stale as browser support improves. Configure Autoprefixer with a Browserslist query instead.

### `color-function-notation: "modern"`

Enforces `rgb(255 0 0 / 50%)` instead of `rgba(255, 0, 0, 0.5)`. The modern syntax is part of CSS Color Level 4 and is supported in all modern browsers.

### `ignoreFiles`: third-party code is exempt

CSS in a `vendor/` folder is not ours, so it is not linted. See [Third-party code is exempt](/Standards/eslint#third-party-code-is-exempt).

### Tailwind: `import-notation: "string"` and `at-rule-no-unknown`

`stylelint-config-standard` rejects `@import "tailwindcss"` and does not know Tailwind's at-rules. These two settings allow the import and the `@theme`, `@utility`, `@variant`, `@custom-variant`, `@source` and `@plugin` at-rules.

### Custom properties: kebab-case

`stylelint-config-standard` requires CSS variables to be kebab-case (`--color-brand-primary`). See [CSS Styling](/Standards/styling#css-variables).

### CSS Modules: `color-named: never` and `color-no-hex`

Colours come from the [global colour variables](/Standards/styling#-colours-always-come-from-global-variables). A CSS Module may not contain `white` or `#3b82f6` — it references `var(--color-white)` or `var(--color-brand-primary)`. Colour values are only written in `globals.css`.

### CSS Modules: `selector-class-pattern: camelCase`

CSS Modules are consumed in JavaScript as `styles.myClass`. Kebab-case names require bracket notation (`styles["my-class"]`), which is easy to mistype. camelCase names allow dot notation and are consistent with JavaScript naming conventions.

### SCSS: `scss/load-no-partial-leading-underscore`

Leading underscores on `@import` paths are a Sass 1.x convention for marking partials. With `@use` and `@forward` (the modern Sass module system), the underscore is handled automatically — including it manually in `@use` paths is an error. `stylelint-config-standard-scss` enforces this.

## Editor integration

### VS Code

Install the [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) extension, then add to workspace settings:

```json
{
  "stylelint.validate": ["css", "scss"],
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit"
  }
}
```

### JetBrains IDEs

Go to **Settings → Languages & Frameworks → Style Sheets → Stylelint** and enable it.
