import js from "@eslint/js";
import { recommended as eslintCommentsRecommended } from "@eslint-community/eslint-plugin-eslint-comments/configs";
import prettier from "eslint-config-prettier";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

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
		files: ["**/*.config.{js,mjs}"],
		rules: { "import-x/no-default-export": "off" },
	},
	prettier,
];

export default config;
