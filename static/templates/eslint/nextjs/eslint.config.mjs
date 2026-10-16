import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
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
  comments.recommended,
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
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
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
