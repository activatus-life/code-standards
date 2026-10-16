import js from "@eslint/js";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import prettier from "eslint-config-prettier";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default [
  { ignores: ["dist/", "build/", "coverage/", "**/vendor/**"] },
  js.configs.recommended,
  comments.recommended,
  importX.recommended,
  unicorn.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      "@eslint-community/eslint-comments/require-description": "error",
      "func-style": ["error", "expression"],
      "max-depth": ["error", 3],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
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
        { selector: "ClassDeclaration", message: "Use functions, not classes." },
        { selector: "ClassExpression", message: "Use functions, not classes." },
        { selector: "VariableDeclarator > FunctionExpression", message: "Use an arrow function." },
        {
          selector: "VariableDeclaration[kind='let']",
          message:
            "Use const. If this value really must be reassigned, disable this rule on this line with a comment saying why.",
        },
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
      "import-x/no-cycle": "error",
      "import-x/no-default-export": "error",
      "no-use-before-define": "error",
      "unicorn/default-export-style": "off",
      "unicorn/filename-case": ["error", { cases: { camelCase: true, pascalCase: true } }],
      "unicorn/name-replacements": [
        "error",
        {
          // Dictionary words: see "Dictionary" in the Human-Readable Names standard.
          replacements: { docs: false, props: false, utils: false },
          // Third-party names, allowed only exactly as they are.
          allowList: { ref: true, params: true, searchParams: true },
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
