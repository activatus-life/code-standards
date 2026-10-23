---
sidebar_position: 1
sidebar_label: "ESLint"
---

# ESLint Configuration

Every project lints with ESLint using a flat config (`eslint.config.mjs`) in the project root. Start from the config below that matches the project:

| Config                                   | Use when                    |
| ---------------------------------------- | --------------------------- |
| [Base](#base-javascript--nodejs)         | Plain JS / Node.js projects |
| [TypeScript](#typescript)                | TypeScript projects         |
| [React + TypeScript](#react--typescript) | React + TypeScript projects |
| [Next.js](#nextjs)                       | Next.js projects            |

Each config builds on the one above it — React adds to TypeScript, which adds to Base.

## Installation

:::warning[ESLint 10.4 or later]

**The config needs ESLint 10.4 or later.** `eslint-plugin-unicorn` 78, which provides the naming rules, requires it. A project on ESLint 9 must upgrade first:

```bash
pnpm add -D eslint@latest @eslint/js@latest
```

:::

:::note[eslint-plugin-react on ESLint 10]

`eslint-plugin-react` 7.37 officially supports ESLint only up to 9.7, and on ESLint 10 it crashes when it tries to detect the React version by itself. The React and Next.js configs below avoid this by setting the version: `settings: { react: { version: "19.0" } }`. **Keep that setting.** A project on a React version other than 19 sets the number in `eslint.overrides.mjs`, `{ settings: { react: { version: "19.2" } } }`, never in `eslint.config.mjs`. pnpm warns about the unmet peer dependency on install; that warning is expected.

:::

```bash
pnpm add -D eslint @eslint/js globals \
  @eslint-community/eslint-plugin-eslint-comments \
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

Create `eslint.config.mjs` in your project root. Each config passes its own rules, so it lints clean the moment it is copied in. The code standards repo checks this with `pnpm check:eslint-templates` whenever a config changes.

### Base (JavaScript / Node.js)

```js title="eslint.config.mjs"
import js from "@eslint/js";
import { recommended as eslintCommentsRecommended } from "@eslint-community/eslint-plugin-eslint-comments/configs";
import prettier from "eslint-config-prettier";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

import { projectOverrides } from "./eslint.overrides.mjs";

// Code patterns that are errors in every file.
const RESTRICTED_SYNTAX = [
	{
		selector: "ClassDeclaration",
		message: "Use functions, not classes.",
	},
	{
		selector: "ClassExpression",
		message: "Use functions, not classes.",
	},
	{
		selector: "VariableDeclarator > FunctionExpression",
		message: "Use an arrow function.",
	},
	{
		selector: "VariableDeclaration[kind='let']",
		message:
			"Use const. If this value really must be reassigned, disable this rule on this line with a comment saying why.",
	},
];

// Functions take one parameter: a single object when they need more than one value.
const SINGLE_OBJECT_PARAMETER = [
	{
		selector: "FunctionDeclaration[params.length>1]",
		message:
			"Use a single object parameter when a function needs more than one value.",
	},
	{
		selector:
			"VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)[params.length>1]",
		message:
			"Use a single object parameter when a function needs more than one value.",
	},
];

// Deeper than this, return early instead.
const MAXIMUM_NESTING_DEPTH = 3;

const config = [
	{
		ignores: [
			"dist/",
			"build/",
			"coverage/",
			// The docs viewer is the standard template, with its own packages and build.
			"docsSite/",
			"**/vendor/**",
		],
	},
	js.configs.recommended,
	eslintCommentsRecommended,
	importX.recommended,
	unicorn.configs.recommended,
	{
		languageOptions: { globals: { ...globals.node } },
		rules: {
			"@eslint-community/eslint-comments/require-description":
				"error",
			"func-style": ["error", "expression"],
			"max-depth": ["error", MAXIMUM_NESTING_DEPTH],
			"max-lines": [
				"error",
				{ max: 300, skipBlankLines: true, skipComments: true },
			],
			"no-nested-ternary": "error",
			"no-var": "error",
			"prefer-arrow-callback": "error",
			"prefer-const": "error",
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
				...RESTRICTED_SYNTAX,
				...SINGLE_OBJECT_PARAMETER,
			],
			"import-x/no-cycle": "error",
			"import-x/no-default-export": "error",
			"no-use-before-define": "error",
			"unicorn/default-export-style": "off",
			"unicorn/filename-case": [
				"error",
				{ cases: { camelCase: true, pascalCase: true } },
			],
			"unicorn/name-replacements": [
				"error",
				{
					// Dictionary words: see "Dictionary" in the Human-Readable Names standard.
					replacements: {
						docs: false,
						lib: false,
						props: false,
						ref: false,
						repo: false,
						utils: false,
					},
					// Third-party names, allowed only exactly as they are.
					allowList: { params: true, searchParams: true },
				},
			],
		},
	},
	{
		files: ["**/*.test.{js,mjs}"],
		rules: { "max-lines": "off", "no-magic-numbers": "off" },
	},
	{
		// The seven constants files are data, not logic, so they can be long.
		files: ["lib/constants/{routes,strings,numbers,noData,animation,artwork,classNames}.{js,mjs}"],
		rules: { "max-lines": "off" },
	},
	{
		files: ["**/*.config.{js,mjs}"],
		rules: { "import-x/no-default-export": "off" },
	},
	// This project's own changes: see eslint.overrides.mjs.
	...projectOverrides,
	prettier,
];

export default config;
```

### TypeScript

```js title="eslint.config.mjs"
import js from "@eslint/js";
import { recommended as eslintCommentsRecommended } from "@eslint-community/eslint-plugin-eslint-comments/configs";
import prettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import { configs as typescript } from "typescript-eslint";

import { projectOverrides } from "./eslint.overrides.mjs";

// Code patterns that are errors in every file.
const RESTRICTED_SYNTAX = [
	{
		selector: "ClassDeclaration",
		message: "Use functions, not classes.",
	},
	{
		selector: "ClassExpression",
		message: "Use functions, not classes.",
	},
	{
		selector: "VariableDeclarator > FunctionExpression",
		message: "Use an arrow function.",
	},
	{
		selector: "VariableDeclaration[kind='let']",
		message:
			"Use const. If this value really must be reassigned, disable this rule on this line with a comment saying why.",
	},
];

// Functions take one parameter: a single object when they need more than one value.
const SINGLE_OBJECT_PARAMETER = [
	{
		selector: "FunctionDeclaration[params.length>1]",
		message:
			"Use a single object parameter when a function needs more than one value.",
	},
	{
		selector:
			"VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)[params.length>1]",
		message:
			"Use a single object parameter when a function needs more than one value.",
	},
];

// Deeper than this, return early instead.
const MAXIMUM_NESTING_DEPTH = 3;

// Type a value where it is declared. Story files are the exception: see below.
const NO_SATISFIES = {
	selector: "TSSatisfiesExpression",
	message:
		"Type a value where it is declared, not with satisfies afterwards.",
};

const config = [
	{
		ignores: [
			"dist/",
			"build/",
			"coverage/",
			// The docs viewer is the standard template, with its own packages and build.
			"docsSite/",
			"**/vendor/**",
		],
	},
	js.configs.recommended,
	eslintCommentsRecommended,
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
			"@eslint-community/eslint-comments/require-description":
				"error",
			"func-style": ["error", "expression"],
			"max-depth": ["error", MAXIMUM_NESTING_DEPTH],
			"max-lines": [
				"error",
				{ max: 300, skipBlankLines: true, skipComments: true },
			],
			"no-nested-ternary": "error",
			"no-var": "error",
			"prefer-arrow-callback": "error",
			"prefer-const": "error",
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
				NO_SATISFIES,
				...RESTRICTED_SYNTAX,
				...SINGLE_OBJECT_PARAMETER,
			],
			"import-x/no-cycle": "error",
			"import-x/no-default-export": "error",
			"no-use-before-define": "error",
			"unicorn/default-export-style": "off",
			"unicorn/filename-case": [
				"error",
				{ cases: { camelCase: true, pascalCase: true } },
			],
			"unicorn/name-replacements": [
				"error",
				{
					// Dictionary words: see "Dictionary" in the Human-Readable Names standard.
					replacements: {
						docs: false,
						lib: false,
						props: false,
						ref: false,
						repo: false,
						utils: false,
					},
					// Third-party names, allowed only exactly as they are.
					allowList: { params: true, searchParams: true },
				},
			],
		},
	},
	{
		files: ["**/*.{ts,tsx}"],
		rules: {
			"no-undef": "off",
			"no-magic-numbers": "off",
			"no-use-before-define": "off",
			"@typescript-eslint/consistent-type-assertions": [
				"error",
				{ assertionStyle: "never" },
			],
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
			"@typescript-eslint/no-use-before-define": "error",
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
		// The seven constants files are data, not logic, so they can be long.
		files: ["lib/constants/{routes,strings,numbers,noData,animation,artwork,classNames}.ts"],
		rules: { "max-lines": "off" },
	},
	{
		files: ["**/*.config.{js,mjs,ts}", "**/*.stories.tsx"],
		rules: { "import-x/no-default-export": "off" },
	},
	{
		files: ["**/*.config.{js,mjs,ts}"],
		rules: { "unicorn/no-top-level-side-effects": "off" },
	},
	{
		// Storybook's own docs type stories with `satisfies Meta<typeof Component>`, so story files may use it.
		files: ["**/*.stories.{ts,tsx}"],
		rules: {
			"no-restricted-syntax": [
				"error",
				...RESTRICTED_SYNTAX,
				...SINGLE_OBJECT_PARAMETER,
			],
		},
	},
	// This project's own changes: see eslint.overrides.mjs.
	...projectOverrides,
	prettier,
];

export default config;
```

TypeScript files are checked by the compiler, so `no-undef` is off for them. The Node globals still earn their place: your `eslint.config.mjs`, build scripts and any remaining `.js` files are linted with `no-undef` on.

### React + TypeScript

Start from the [TypeScript](#typescript) config and make five changes:

```js title="eslint.config.mjs"
import js from "@eslint/js";
import { recommended as eslintCommentsRecommended } from "@eslint-community/eslint-plugin-eslint-comments/configs";
import prettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import { configs as typescript } from "typescript-eslint";

import { projectOverrides } from "./eslint.overrides.mjs";

// Code patterns that are errors in every file.
const RESTRICTED_SYNTAX = [
	{
		selector: "ClassDeclaration",
		message: "Use functions, not classes.",
	},
	{
		selector: "ClassExpression",
		message: "Use functions, not classes.",
	},
	{
		selector: "VariableDeclarator > FunctionExpression",
		message: "Use an arrow function.",
	},
	{
		selector: "VariableDeclaration[kind='let']",
		message:
			"Use const. If this value really must be reassigned, disable this rule on this line with a comment saying why.",
	},
];

// Functions take one parameter: a single object when they need more than one value.
const SINGLE_OBJECT_PARAMETER = [
	{
		selector: "FunctionDeclaration[params.length>1]",
		message:
			"Use a single object parameter when a function needs more than one value.",
	},
	{
		selector:
			"VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)[params.length>1]",
		message:
			"Use a single object parameter when a function needs more than one value.",
	},
];

// Deeper than this, return early instead.
const MAXIMUM_NESTING_DEPTH = 3;

// Type a value where it is declared. Story files are the exception: see below.
const NO_SATISFIES = {
	selector: "TSSatisfiesExpression",
	message:
		"Type a value where it is declared, not with satisfies afterwards.",
};

const config = [
	{
		ignores: [
			"dist/",
			"build/",
			"coverage/",
			// The docs viewer is the standard template, with its own packages and build.
			"docsSite/",
			"**/vendor/**",
		],
	},
	js.configs.recommended,
	eslintCommentsRecommended,
	importX.recommended,
	importX.typescript,
	unicorn.configs.recommended,
	...typescript.recommended,
	react.configs.flat.recommended,
	react.configs.flat["jsx-runtime"],
	reactHooks.configs.flat.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		settings: {
			// Keep this. eslint-plugin-react crashes on ESLint 10 if it has to detect the version itself.
			// A project on another React version sets settings.react.version
			// in eslint.overrides.mjs, never here.
			react: { version: "19.0" },
			"import-x/resolver-next": [createTypeScriptImportResolver()],
		},
		rules: {
			"@eslint-community/eslint-comments/require-description":
				"error",
			"func-style": ["error", "expression"],
			"max-depth": ["error", MAXIMUM_NESTING_DEPTH],
			"max-lines": [
				"error",
				{ max: 300, skipBlankLines: true, skipComments: true },
			],
			"no-nested-ternary": "error",
			"no-var": "error",
			"prefer-arrow-callback": "error",
			"prefer-const": "error",
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
				NO_SATISFIES,
				...RESTRICTED_SYNTAX,
				...SINGLE_OBJECT_PARAMETER,
			],
			"import-x/no-cycle": "error",
			"import-x/no-default-export": "error",
			"no-use-before-define": "error",
			"unicorn/default-export-style": "off",
			"unicorn/filename-case": [
				"error",
				{ cases: { camelCase: true, pascalCase: true } },
			],
			"unicorn/name-replacements": [
				"error",
				{
					// Dictionary words: see "Dictionary" in the Human-Readable Names standard.
					replacements: {
						docs: false,
						lib: false,
						props: false,
						ref: false,
						repo: false,
						utils: false,
					},
					// Third-party names, allowed only exactly as they are.
					allowList: { params: true, searchParams: true },
				},
			],
			"react/function-component-definition": [
				"error",
				{
					namedComponents: "arrow-function",
					unnamedComponents: "arrow-function",
				},
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
			"no-use-before-define": "off",
			"@typescript-eslint/consistent-type-assertions": [
				"error",
				{ assertionStyle: "never" },
			],
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
			"@typescript-eslint/no-use-before-define": "error",
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
		// The seven constants files are data, not logic, so they can be long.
		files: ["lib/constants/{routes,strings,numbers,noData,animation,artwork,classNames}.ts"],
		rules: { "max-lines": "off" },
	},
	{
		files: ["**/*.config.{js,mjs,ts}", "**/*.stories.tsx"],
		rules: { "import-x/no-default-export": "off" },
	},
	{
		files: ["**/*.config.{js,mjs,ts}"],
		rules: { "unicorn/no-top-level-side-effects": "off" },
	},
	{
		// Storybook's own docs type stories with `satisfies Meta<typeof Component>`, so story files may use it.
		files: ["**/*.stories.{ts,tsx}"],
		rules: {
			"no-restricted-syntax": [
				"error",
				...RESTRICTED_SYNTAX,
				...SINGLE_OBJECT_PARAMETER,
			],
		},
	},
	// This project's own changes: see eslint.overrides.mjs.
	...projectOverrides,
	prettier,
];

export default config;
```

:::caution[Pin the React version]

Keep `settings.react.version` set rather than `"detect"`; change the number in `eslint.overrides.mjs`. On ESLint 10, `eslint-plugin-react` 7 crashes while detecting the version (`contextOrFilename.getFilename is not a function`).

:::

### Next.js

`eslint-config-next` already brings the React, React Hooks and TypeScript rules, so it replaces the `js` and `typescript-eslint` presets rather than adding to them. Default exports are allowed in the files where Next.js requires them (`page.tsx`, `layout.tsx` and so on). Route handlers in `app/**/route.ts` may take two parameters, because Next.js calls them as `(request, context)`:

```js title="eslint.config.mjs"
import { recommended as eslintCommentsRecommended } from "@eslint-community/eslint-plugin-eslint-comments/configs";
import prettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

import { projectOverrides } from "./eslint.overrides.mjs";

// Code patterns that are errors in every file.
const RESTRICTED_SYNTAX = [
	{
		selector: "ClassDeclaration",
		message: "Use functions, not classes.",
	},
	{
		selector: "ClassExpression",
		message: "Use functions, not classes.",
	},
	{
		selector: "VariableDeclarator > FunctionExpression",
		message: "Use an arrow function.",
	},
	{
		selector: "VariableDeclaration[kind='let']",
		message:
			"Use const. If this value really must be reassigned, disable this rule on this line with a comment saying why.",
	},
];

// Functions take one parameter: a single object when they need more than one value.
// Route handlers are the exception: see below.
const SINGLE_OBJECT_PARAMETER = [
	{
		selector: "FunctionDeclaration[params.length>1]",
		message:
			"Use a single object parameter when a function needs more than one value.",
	},
	{
		selector:
			"VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)[params.length>1]",
		message:
			"Use a single object parameter when a function needs more than one value.",
	},
];

// Deeper than this, return early instead.
const MAXIMUM_NESTING_DEPTH = 3;

// Type a value where it is declared. Story files are the exception: see below.
const NO_SATISFIES = {
	selector: "TSSatisfiesExpression",
	message:
		"Type a value where it is declared, not with satisfies afterwards.",
};

const config = [
	{
		ignores: [
			".next/",
			"out/",
			"build/",
			"coverage/",
			"next-env.d.ts",
			// The docs viewer is the standard template, with its own packages and build.
			"docsSite/",
			"**/vendor/**",
		],
	},
	...nextVitals,
	...nextTypescript,
	eslintCommentsRecommended,
	importX.recommended,
	importX.typescript,
	unicorn.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		settings: {
			// Keep this. eslint-plugin-react crashes on ESLint 10 if it has to detect the version itself.
			// A project on another React version sets settings.react.version
			// in eslint.overrides.mjs, never here.
			react: { version: "19.0" },
			"import-x/resolver-next": [createTypeScriptImportResolver()],
		},
		rules: {
			"@eslint-community/eslint-comments/require-description":
				"error",
			"func-style": ["error", "expression"],
			"max-depth": ["error", MAXIMUM_NESTING_DEPTH],
			"max-lines": [
				"error",
				{ max: 300, skipBlankLines: true, skipComments: true },
			],
			"no-nested-ternary": "error",
			"no-var": "error",
			"prefer-arrow-callback": "error",
			"prefer-const": "error",
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
				NO_SATISFIES,
				...RESTRICTED_SYNTAX,
				...SINGLE_OBJECT_PARAMETER,
			],
			"import-x/no-cycle": "error",
			"import-x/no-default-export": "error",
			"no-use-before-define": "error",
			"unicorn/default-export-style": "off",
			"unicorn/filename-case": [
				"error",
				{ cases: { camelCase: true, pascalCase: true } },
			],
			"unicorn/name-replacements": [
				"error",
				{
					// Dictionary words: see "Dictionary" in the Human-Readable Names standard.
					replacements: {
						docs: false,
						lib: false,
						props: false,
						ref: false,
						repo: false,
						utils: false,
					},
					// Third-party names, allowed only exactly as they are.
					allowList: { params: true, searchParams: true },
				},
			],
			"react/function-component-definition": [
				"error",
				{
					namedComponents: "arrow-function",
					unnamedComponents: "arrow-function",
				},
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
			"no-use-before-define": "off",
			"@typescript-eslint/consistent-type-assertions": [
				"error",
				{ assertionStyle: "never" },
			],
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
			"@typescript-eslint/no-use-before-define": "error",
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
		// The seven constants files are data, not logic, so they can be long.
		files: ["lib/constants/{routes,strings,numbers,noData,animation,artwork,classNames}.ts"],
		rules: { "max-lines": "off" },
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
	{
		// Storybook's own docs type stories with `satisfies Meta<typeof Component>`, so story files may use it.
		files: ["**/*.stories.{ts,tsx}"],
		rules: {
			"no-restricted-syntax": [
				"error",
				...RESTRICTED_SYNTAX,
				...SINGLE_OBJECT_PARAMETER,
			],
		},
	},
	{
		// Next.js calls a route handler with two values, (request, context), so route.ts files may take two parameters.
		files: ["app/**/route.ts"],
		rules: {
			"no-restricted-syntax": [
				"error",
				NO_SATISFIES,
				...RESTRICTED_SYNTAX,
			],
		},
	},
	// This project's own changes: see eslint.overrides.mjs.
	...projectOverrides,
	prettier,
];

export default config;
```

Next.js genuinely runs in both environments — client components in the browser, route handlers, server components and `next.config.js` in Node — so both sets of globals apply.

:::tip[Declare globals, do not disable the rule]

Use the `globals` package rather than turning `no-undef` off or hand-writing a globals list. A hand-written list is a snapshot of what one project happened to use on one day, and the next runtime API added to Node is missing from it — which is exactly how a project ends up with `fetch` declared but `AbortController` not.

:::

### Project-specific overrides

**Never change `eslint.config.mjs`.** It is copied from the standards unchanged, so an update can copy the new version straight over it. A project's own rule changes live in `eslint.overrides.mjs`, which the config reads just before `prettier`. Copy it from `static/templates/eslint.overrides.mjs`: it starts empty.

**A change needs the person's yes first.** The standards are the project's base, so an agent never switches off, loosens or changes a rule on its own. Ask, then:

1. Record it in `docs/development/coding-standards.md`, under "Details": the standard's number and name, what is different, why, and the date.
2. Add it to `eslint.overrides.mjs`, with a comment naming the standard's number.

```js title="eslint.overrides.mjs"
export const projectOverrides = [
	{
		files: ["scripts/**/*.mjs"],
		rules: {
			// Standard 6: scripts print to the terminal.
			"no-console": "off",
		},
	},
];
```

A rule change in `eslint.overrides.mjs` with no matching entry in `coding-standards.md` is a mistake: the codeReview skill flags it. The only changes made without asking are the single-line `let` and type-cast exceptions: see [the only allowed exceptions](/docs/Standards/lint-errors#the-only-allowed-exceptions).

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

| Plugin                                            | Purpose                                                         |
| ------------------------------------------------- | --------------------------------------------------------------- |
| `@eslint/js`                                      | ESLint core recommended rules                                   |
| `@eslint-community/eslint-plugin-eslint-comments` | Requires every `eslint-disable` comment to give a reason        |
| `eslint-plugin-import-x`                          | Import checks: unresolved paths, duplicates, no default exports |
| `eslint-plugin-unicorn`                           | Opinionated JS best-practice rules                              |
| `eslint-config-prettier`                          | Disables rules that conflict with Prettier                      |
| `typescript-eslint`                               | TypeScript-specific rules (TypeScript configs only)             |
| `eslint-plugin-react`                             | React-specific rules (React configs only)                       |
| `eslint-plugin-react-hooks`                       | Hooks rules (React configs only)                                |

## Third-party code is exempt

**The standards apply to code we write. They do not apply to packages we pull in.**

| Code                                              | Linted?                              |
| ------------------------------------------------- | ------------------------------------ |
| Our own code                                      | ✅ Yes — every rule applies          |
| `node_modules/`                                   | ❌ No — ESLint ignores it by default |
| `vendor/` (third-party code copied into the repo) | ❌ No — ignored by the config        |
| Build output (`dist/`, `build/`, `.next/`)        | ❌ No — ignored by the config        |

Third-party code that is copied into the repository lives in a `vendor/` folder, at any level. The configs ignore `**/vendor/**`, so it is never linted.

- **Do not fix lint errors in third-party code.** It is not ours, and the fix would be lost on the next update.
- **Do not rename or restructure it** to match our naming or folder rules.
- **Do not add `eslint-disable` comments to it.** Put it in `vendor/` instead.

### Copied-in code we maintain is ours

`vendor/` is only for third-party code we **do not change** — code that is replaced wholesale when the package updates.

Code that is copied into the project and then **owned and edited by us** is our code, and every standard applies to it. The main case is **shadcn/ui**: the CLI copies component source into the project, and from then on it is ours. It is converted to our standards and lives in `components/ui/`, never in `vendor/`. See [Adding a shadcn component](/docs/Guides/component-library-workflow#adding-a-shadcn-component).

| Code                                                      | Ours?   | Follows the standards?                     |
| --------------------------------------------------------- | ------- | ------------------------------------------ |
| A package installed with `pnpm add`                       | No      | No                                         |
| Third-party code copied in and left untouched (`vendor/`) | No      | No                                         |
| shadcn components added with the CLI                      | **Yes** | **Yes — convert them when they are added** |
| Code generated once and then edited by us                 | **Yes** | **Yes**                                    |

If a vendored package lives somewhere else and cannot be moved, add its path to the `ignores` list at the top of the config.

## Key rule decisions

Most of these enforce the [Readable Code](/docs/Standards/readable-code) rules. For what each error means and how to fix it, see [Fixing Lint Errors](/docs/Standards/lint-errors).

### `func-style`, `prefer-arrow-callback`: arrow functions everywhere

Every function is an arrow function. See [Readable Code](/docs/Standards/readable-code#arrow-functions-everywhere).

- `func-style: expression` rejects `function name() {}` declarations.
- `prefer-arrow-callback` rejects `function` callbacks.
- `no-restricted-syntax` rejects `const name = function () {}`.
- `react/function-component-definition` requires components to be arrow functions (React configs).
- `unicorn/default-export-style` is switched off. It demands `export default function`, which contradicts this rule in the Next.js files that need a default export.

### `no-restricted-syntax`, `prefer-const`, `no-var`: always `const`

Variables are declared with `const`. `let` is an error unless the line carries a disable comment with a reason; `var` is never allowed. See [Readable Code](/docs/Standards/readable-code#always-const).

### `@eslint-community/eslint-comments/require-description`

Every `eslint-disable` comment must say why, after `--`. A rule is never switched off silently. See [the only allowed exceptions](/docs/Standards/lint-errors#the-only-allowed-exceptions).

### `max-lines: 300`

No file is longer than 300 lines, not counting blank lines and comments. Test files are exempt, and so are the seven constants files in `lib/constants/` (`routes.ts`, `strings.ts`, `numbers.ts`, `noData.ts`, `animation.ts`, `artwork.ts` and `classNames.ts`), which hold data only. See [Readable Code](/docs/Standards/readable-code#no-file-longer-than-300-lines).

### `max-depth: 3`

Blocks nest at most three levels deep. Return early instead. The configs name it `MAXIMUM_NESTING_DEPTH`, because they follow their own `no-magic-numbers` rule. See [Readable Code](/docs/Standards/readable-code#return-early-nest-shallow).

### `no-nested-ternary`

A ternary inside a ternary is an error. See [Readable Code](/docs/Standards/readable-code#no-nested-ternaries).

### `no-magic-numbers`

Numbers other than `-1`, `0` and `1` must be named constants. Test files are exempt. TypeScript files use `@typescript-eslint/no-magic-numbers`, which understands enums and numeric literal types. See [Readable Code](/docs/Standards/readable-code#no-magic-numbers-or-strings).

### `no-restricted-syntax`: no classes, one parameter

These are banned by syntax, along with `function` expressions (above):

- **Class declarations and class expressions.** See [Readable Code](/docs/Standards/readable-code#functions-never-classes).
- **Functions you define with more than one parameter.** Use a single object parameter. Inline callbacks whose signature is set by someone else — `array.reduce((total, item) => …)`, event handlers — are not affected. See [Readable Code](/docs/Standards/readable-code#one-parameter-always-an-object-for-more).

The configs keep the one-parameter selectors in their own `SINGLE_OBJECT_PARAMETER` list, so a file that must take more than one parameter can switch off just those. The Next.js config does this for route handlers in `app/**/route.ts`, which Next.js calls as `(request, context)`.

### `import-x/no-cycle`: no circular imports

A file may never import a file that imports it back, directly or through a chain of other files. See [Import safety](/docs/Structure/import-organization#import-safety).

### `no-use-before-define`

A function or variable is defined above the code that uses it. TypeScript files use `@typescript-eslint/no-use-before-define`. See [Import safety](/docs/Structure/import-organization#import-safety).

### `import-x/no-default-export`

Named exports only. Default exports are allowed where a tool requires them: config files, Storybook stories and Next.js route files. See [Readable Code](/docs/Standards/readable-code#named-exports-only).

### Import order is not linted

There is deliberately no import-**order** rule (circular imports are a different matter — see above). Follow the [Import Organization](/docs/Structure/import-organization) pattern for consistency, but ESLint will not complain about it.

### `unicorn/filename-case: camelCase or PascalCase`

The plugin's default is kebab-case, which contradicts our [naming conventions](/docs/Structure/naming-conventions). Files are camelCase (`formatDate.ts`), and component files are PascalCase (`UserProfile.tsx`).

### `unicorn/name-replacements: error`

Names are full English words: `btn` must be `button`, `e` must be `error` or `event`, `acc` must be `accumulator`. `docs`, `lib`, `props`, `ref`, `repo` and `utils` are allowed because they are on the [dictionary](/docs/Standards/human-readable-names#dictionary) list. Only three names owned by React and Next.js are allowed exactly as they are — `ref`, `params` and `searchParams` — and our own names built from them are still flagged (`inputRef` must be `inputReference`). See [Human-Readable Names](/docs/Standards/human-readable-names). (Before `eslint-plugin-unicorn` 77 this rule was called `unicorn/prevent-abbreviations`.)

### `@typescript-eslint/no-explicit-any: error`

`any` defeats the type system. Use `unknown` and narrow with guards instead.

### `@typescript-eslint/no-non-null-assertion: error`

The `!` operator tells the compiler a value exists without checking. Check it instead.

### `no-restricted-syntax`: type first, never `satisfies`

A value gets its type where it is declared: `const config: ConfigType = { … }`. `satisfies` attaches the type afterwards, so it is an error in the TypeScript, React and Next.js configs, except in story files (`*.stories.{ts,tsx}`), which follow Storybook's docs. The rule lists live in `RESTRICTED_SYNTAX` and `NO_SATISFIES` at the top of each config, so story files use every other restriction without repeating it. See [Type first, never `satisfies`](/docs/Standards/readable-code#type-first-never-satisfies).

### `@typescript-eslint/consistent-type-assertions: never`

`as` casts are errors (`as const` is still allowed). When a cast is genuinely needed, disable the rule on that line **with the reason** — which is exactly the comment the [standard](/docs/Standards/readable-code#no-any-no--no-unexplained-as) requires:

```ts
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- the API returns untyped JSON; validated by parseUser below
const user = response.data as UserType;
```

### `@typescript-eslint/naming-convention`: `Props` or `Type` suffix

Every interface and type alias ends in `Props` or `Type`. See [Naming Conventions](/docs/Structure/naming-conventions#types--interfaces).

### `@typescript-eslint/consistent-type-imports: error`

Type-only imports use `import type { Foo }` or inline `import { type Foo }`. This produces cleaner transpiled output and avoids accidental value imports.

### `react/jsx-no-bind: error`

No inline functions in render. A function passed as a JSX prop must be wrapped in `useCallback`, so it is not recreated on every render. See [Writing a component](/docs/Structure/component-organization#-writing-a-component).

### `react/no-multi-comp: error`

One component per file. See [Readable Code](/docs/Standards/readable-code#one-component-per-file).
