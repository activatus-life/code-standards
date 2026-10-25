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

// Give a value a real type instead. consistent-type-assertions always
// lets `as const` through, so it is banned here.
const NO_AS_CONST = {
	selector: "TSAsExpression[typeAnnotation.typeName.name='const']",
	message:
		"Give the value a real type where it is declared, not as const.",
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
				NO_AS_CONST,
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
				NO_AS_CONST,
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
