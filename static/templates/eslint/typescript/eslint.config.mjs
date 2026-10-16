import js from "@eslint/js";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import prettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import { configs as typescript } from "typescript-eslint";

export default [
	{ ignores: ["dist/", "build/", "coverage/", "**/vendor/**"] },
	js.configs.recommended,
	comments.recommended,
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
			"max-depth": ["error", 3],
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
		files: ["**/*.config.{js,mjs,ts}", "**/*.stories.tsx"],
		rules: { "import-x/no-default-export": "off" },
	},
	{
		files: ["**/*.config.{js,mjs,ts}"],
		rules: { "unicorn/no-top-level-side-effects": "off" },
	},
	prettier,
];
