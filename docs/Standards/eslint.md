---
sidebar_position: 1
sidebar_label: "ESLint"
---

# ESLint Configuration

Every project lints with ESLint using a flat config (`eslint.config.mjs`) in the project root. Start from the config below that matches the project:

| Config | Use when |
| --- | --- |
| [Base](#base-javascript--nodejs) | Plain JS / Node.js projects |
| [TypeScript](#typescript) | TypeScript projects |
| [React + TypeScript](#react--typescript) | React + TypeScript projects |
| [Next.js](#nextjs) | Next.js projects |

Each config builds on the one above it — React adds to TypeScript, which adds to Base.

## Installation

```bash
pnpm add -D eslint @eslint/js globals \
  eslint-config-prettier \
  eslint-plugin-import-x \
  eslint-plugin-unicorn
```

For TypeScript projects also install:

```bash
pnpm add -D typescript-eslint eslint-import-resolver-typescript
```

For React projects:

```bash
pnpm add -D eslint-plugin-react eslint-plugin-react-hooks
```

For Next.js projects:

```bash
pnpm add -D eslint-config-next
```

:::caution[TypeScript 7 and typescript-eslint]

`typescript-eslint` 8 does not run against TypeScript 7.0 — ESLint stops with `typescript-eslint does not support TS 7.0`. Until it does, linting needs the TypeScript 6 API available alongside TypeScript 7. See [running side by side with TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0) and the [typescript-eslint tracking issue](https://github.com/typescript-eslint/typescript-eslint/issues/10940).

:::

## Usage

Create `eslint.config.mjs` in your project root.

### Base (JavaScript / Node.js)

```js title="eslint.config.mjs"
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default [
  { ignores: ["dist/", "build/", "coverage/", "**/vendor/**"] },
  js.configs.recommended,
  importX.recommended,
  unicorn.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      "max-depth": ["error", 3],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "no-nested-ternary": "error",
      "no-magic-numbers": [
        "error",
        {
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
        },
      ],
      "no-restricted-syntax": [
        "error",
        { selector: "ClassDeclaration", message: "Use functions, not classes." },
        { selector: "ClassExpression", message: "Use functions, not classes." },
        {
          selector: "FunctionDeclaration[params.length>1]",
          message: "Use a single object parameter when a function needs more than one value.",
        },
        {
          selector:
            "VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)[params.length>1]",
          message: "Use a single object parameter when a function needs more than one value.",
        },
      ],
      "import-x/no-default-export": "error",
      "unicorn/filename-case": ["error", { cases: { camelCase: true, pascalCase: true } }],
      "unicorn/name-replacements": [
        "error",
        { replacements: { props: false, ref: false, params: false, utils: false } },
      ],
    },
  },
  {
    files: ["**/*.test.{js,mjs}"],
    rules: { "max-lines": "off", "no-magic-numbers": "off" },
  },
  {
    files: ["**/*.config.{js,mjs}"],
    rules: { "import-x/no-default-export": "off" },
  },
  prettier,
];
```

### TypeScript

```js title="eslint.config.mjs"
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import { configs as typescript } from "typescript-eslint";

export default [
  { ignores: ["dist/", "build/", "coverage/", "**/vendor/**"] },
  js.configs.recommended,
  importX.recommended,
  importX.typescript,
  unicorn.configs.recommended,
  ...typescript.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
    settings: {
      "import-x/resolver-next": [createTypeScriptImportResolver()],
    },
    rules: {
      "max-depth": ["error", 3],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "no-nested-ternary": "error",
      "no-magic-numbers": [
        "error",
        {
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
        },
      ],
      "no-restricted-syntax": [
        "error",
        { selector: "ClassDeclaration", message: "Use functions, not classes." },
        { selector: "ClassExpression", message: "Use functions, not classes." },
        {
          selector: "FunctionDeclaration[params.length>1]",
          message: "Use a single object parameter when a function needs more than one value.",
        },
        {
          selector:
            "VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)[params.length>1]",
          message: "Use a single object parameter when a function needs more than one value.",
        },
      ],
      "import-x/no-default-export": "error",
      "unicorn/filename-case": ["error", { cases: { camelCase: true, pascalCase: true } }],
      "unicorn/name-replacements": [
        "error",
        { replacements: { props: false, ref: false, params: false, utils: false } },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
      "no-magic-numbers": "off",
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["typeAlias", "interface"],
          format: ["PascalCase"],
          custom: { regex: "(Props|Type)$", match: true },
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    rules: {
      "max-lines": "off",
      "no-magic-numbers": "off",
      "@typescript-eslint/no-magic-numbers": "off",
    },
  },
  {
    files: ["**/*.config.{js,mjs,ts}", "**/*.stories.tsx"],
    rules: { "import-x/no-default-export": "off" },
  },
  {
    files: ["**/*.config.{js,mjs,ts}"],
    rules: { "unicorn/no-top-level-side-effects": "off" },
  },
  prettier,
];
```

TypeScript files are checked by the compiler, so `no-undef` is off for them. The Node globals still earn their place: your `eslint.config.mjs`, build scripts and any remaining `.js` files are linted with `no-undef` on.

### React + TypeScript

Start from the [TypeScript](#typescript) config and make five changes:

```js title="eslint.config.mjs"
// 1. Import the React plugins
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  // ...
  ...typescript.recommended,
  // 2. Add the React presets after the TypeScript preset
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  {
    // 3. Declare browser globals alongside the Node ones
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    settings: {
      // 4. Tell the React plugin which React version the project uses
      react: { version: "19.0" },
      "import-x/resolver-next": [createTypeScriptImportResolver()],
    },
    rules: {
      // ...
      // 5. Add the React rules
      "react/jsx-no-bind": "error",
      "react/no-multi-comp": "error",
    },
  },
  // ...
];
```

:::caution[Pin the React version]

Set `settings.react.version` to the project's React version rather than `"detect"`. On ESLint 10, `eslint-plugin-react` 7 crashes while detecting the version (`contextOrFilename.getFilename is not a function`).

:::

### Next.js

`eslint-config-next` already brings the React, React Hooks and TypeScript rules, so it replaces the `js` and `typescript-eslint` presets rather than adding to them. Default exports are allowed in the files where Next.js requires them (`page.tsx`, `layout.tsx` and so on):

```js title="eslint.config.mjs"
import prettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default [
  { ignores: [".next/", "out/", "build/", "coverage/", "next-env.d.ts", "**/vendor/**"] },
  ...nextVitals,
  ...nextTypescript,
  importX.recommended,
  importX.typescript,
  unicorn.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    settings: {
      react: { version: "19.0" },
      "import-x/resolver-next": [createTypeScriptImportResolver()],
    },
    rules: {
      "max-depth": ["error", 3],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "no-nested-ternary": "error",
      "no-magic-numbers": [
        "error",
        {
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
        },
      ],
      "no-restricted-syntax": [
        "error",
        { selector: "ClassDeclaration", message: "Use functions, not classes." },
        { selector: "ClassExpression", message: "Use functions, not classes." },
        {
          selector: "FunctionDeclaration[params.length>1]",
          message: "Use a single object parameter when a function needs more than one value.",
        },
        {
          selector:
            "VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)[params.length>1]",
          message: "Use a single object parameter when a function needs more than one value.",
        },
      ],
      "import-x/no-default-export": "error",
      "unicorn/filename-case": ["error", { cases: { camelCase: true, pascalCase: true } }],
      "unicorn/name-replacements": [
        "error",
        { replacements: { props: false, ref: false, params: false, utils: false } },
      ],
      "react/jsx-no-bind": "error",
      "react/no-multi-comp": "error",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
      "no-magic-numbers": "off",
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["typeAlias", "interface"],
          format: ["PascalCase"],
          custom: { regex: "(Props|Type)$", match: true },
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    rules: {
      "max-lines": "off",
      "no-magic-numbers": "off",
      "@typescript-eslint/no-magic-numbers": "off",
    },
  },
  {
    files: [
      "**/*.config.{js,mjs,ts}",
      "**/*.stories.tsx",
      "app/**/{page,layout,template,default,loading,error,global-error,not-found}.tsx",
    ],
    rules: { "import-x/no-default-export": "off" },
  },
  {
    files: ["**/*.config.{js,mjs,ts}"],
    rules: { "unicorn/no-top-level-side-effects": "off" },
  },
  prettier,
];
```

Next.js genuinely runs in both environments — client components in the browser, route handlers, server components and `next.config.js` in Node — so both sets of globals apply.

:::tip[Declare globals, do not disable the rule]

Use the `globals` package rather than turning `no-undef` off or hand-writing a globals list. A hand-written list is a snapshot of what one project happened to use on one day, and the next runtime API added to Node is missing from it — which is exactly how a project ends up with `fetch` declared but `AbortController` not.

:::

### Project-specific overrides

Add a block before `prettier` to add or override rules:

```js
export default [
  // ...
  {
    rules: {
      // project-specific overrides
      "no-console": "off",
    },
  },
  prettier,
];
```

Keep `prettier` last — it switches off every rule that would fight the formatter.

Add scripts to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## Plugins

| Plugin | Purpose |
| --- | --- |
| `@eslint/js` | ESLint core recommended rules |
| `eslint-plugin-import-x` | Import checks: unresolved paths, duplicates, no default exports |
| `eslint-plugin-unicorn` | Opinionated JS best-practice rules |
| `eslint-config-prettier` | Disables rules that conflict with Prettier |
| `typescript-eslint` | TypeScript-specific rules (TypeScript configs only) |
| `eslint-plugin-react` | React-specific rules (React configs only) |
| `eslint-plugin-react-hooks` | Hooks rules (React configs only) |

## Third-party code is exempt

**The standards apply to code we write. They do not apply to packages we pull in.**

| Code | Linted? |
| --- | --- |
| Our own code | ✅ Yes — every rule applies |
| `node_modules/` | ❌ No — ESLint ignores it by default |
| `vendor/` (third-party code copied into the repo) | ❌ No — ignored by the config |
| Build output (`dist/`, `build/`, `.next/`) | ❌ No — ignored by the config |

Third-party code that is copied into the repository lives in a `vendor/` folder, at any level. The configs ignore `**/vendor/**`, so it is never linted.

- **Do not fix lint errors in third-party code.** It is not ours, and the fix would be lost on the next update.
- **Do not rename or restructure it** to match our naming or folder rules.
- **Do not add `eslint-disable` comments to it.** Put it in `vendor/` instead.

If a vendored package lives somewhere else and cannot be moved, add its path to the `ignores` list at the top of the config.

## Key rule decisions

Most of these enforce the [Readable Code](/Standards/readableCode) rules.

### `max-lines: 300`

No file is longer than 300 lines, not counting blank lines and comments. Test files are exempt. See [Readable Code](/Standards/readableCode#no-file-longer-than-300-lines).

### `max-depth: 3`

Blocks nest at most three levels deep. Return early instead. See [Readable Code](/Standards/readableCode#return-early-nest-shallow).

### `no-nested-ternary`

A ternary inside a ternary is an error. See [Readable Code](/Standards/readableCode#no-nested-ternaries).

### `no-magic-numbers`

Numbers other than `-1`, `0` and `1` must be named constants. Test files are exempt. TypeScript files use `@typescript-eslint/no-magic-numbers`, which understands enums and numeric literal types. See [Readable Code](/Standards/readableCode#no-magic-numbers-or-strings).

### `no-restricted-syntax`: no classes, one parameter

Two things are banned by syntax:

- **Class declarations and class expressions.** See [Readable Code](/Standards/readableCode#functions-never-classes).
- **Functions you define with more than one parameter.** Use a single object parameter. Inline callbacks whose signature is set by someone else — `array.reduce((total, item) => …)`, event handlers — are not affected. See [Readable Code](/Standards/readableCode#one-parameter-always-an-object-for-more).

### `import-x/no-default-export`

Named exports only. Default exports are allowed where a tool requires them: config files, Storybook stories and Next.js route files. See [Readable Code](/Standards/readableCode#named-exports-only).

### Import order is not linted

There is deliberately no import-order rule. Follow the [Import Organization](/Structure/importOrganization) pattern for consistency, but ESLint will not complain about it.

### `unicorn/filename-case: camelCase or PascalCase`

The plugin's default is kebab-case, which contradicts our [naming conventions](/Structure/namingConventions). Files are camelCase (`dateHelpers.ts`), and component files are PascalCase (`UserProfile.tsx`).

### `unicorn/name-replacements: error`

Names are full English words: `btn` must be `button`, `e` must be `error` or `event`, `acc` must be `accumulator`. Four names are exempt — `props`, `ref` and `params` because they are React and Next.js idiom, and `utils` because it is our [standard folder name](/Structure/folderStructure#-utils). See [Readable Code](/Standards/readableCode#names-are-full-english-words). (Before `eslint-plugin-unicorn` 77 this rule was called `unicorn/prevent-abbreviations`.)

### `@typescript-eslint/no-explicit-any: error`

`any` defeats the type system. Use `unknown` and narrow with guards instead.

### `@typescript-eslint/no-non-null-assertion: error`

The `!` operator tells the compiler a value exists without checking. Check it instead.

### `@typescript-eslint/consistent-type-assertions: never`

`as` casts are errors (`as const` is still allowed). When a cast is genuinely needed, disable the rule on that line **with the reason** — which is exactly the comment the [standard](/Standards/readableCode#no-any-no--no-unexplained-as) requires:

```ts
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- the API returns untyped JSON; validated by parseUser below
const user = response.data as UserType;
```

### `@typescript-eslint/naming-convention`: `Props` or `Type` suffix

Every interface and type alias ends in `Props` or `Type`. See [Naming Conventions](/Structure/namingConventions#types--interfaces).

### `@typescript-eslint/consistent-type-imports: error`

Type-only imports use `import type { Foo }` or inline `import { type Foo }`. This produces cleaner transpiled output and avoids accidental value imports.

### `react/jsx-no-bind: error`

No inline functions in render. A function passed as a JSX prop must be wrapped in `useCallback`, so it is not recreated on every render. See [Writing a component](/Structure/componentOrganization#-writing-a-component).

### `react/no-multi-comp: error`

One component per file. See [Readable Code](/Standards/readableCode#one-component-per-file).
