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
