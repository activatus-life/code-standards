---
sidebar_position: 1.5
sidebar_label: "Fixing Lint Errors"
---

# Fixing Lint Errors

When `pnpm lint` reports an error, find the rule name at the end of the line in the tables below. Each row says what the error means in plain English and how to fix it.

```text
src/userService.ts
  12:3  error  Dependency cycle detected  import-x/no-cycle
  │            │                          └── the rule name — look this up below
  │            └── the message
  └── line 12, column 3
```

## The golden rule

**Fix the code. Never switch the rule off to make the error go away.**

A lint error means the code breaks a standard. The fix is always to change the code. Do not add `eslint-disable` comments, do not delete rules from the config, and do not move files into `vendor/` to hide them.

There are exactly two rules that may be switched off for one line, and both need a comment saying why — see [the only allowed exceptions](#the-only-allowed-exceptions).

This applies to everyone, **including AI agents**. An agent's work is not finished while `pnpm lint` reports errors.

---

## Imports

| Rule | What you will see | What it means | How to fix it |
| --- | --- | --- | --- |
| `import-x/no-cycle` | `Dependency cycle detected` | Two files import each other, directly or through other files. One will load before the other is ready | Move the part both files need into a **third file** that both import. If the cycle goes through an `index.ts`, import the file directly instead. See [Import safety](/Structure/import-organization#import-safety) |
| `import-x/no-unresolved` | `Unable to resolve path to module '…'` | The file being imported does not exist at that path | Check the spelling and the path. If the file was renamed or moved, update the import |
| `import-x/no-default-export` | `Prefer named exports` | The file uses `export default` | Change to a named export: `export const formatCurrency = …` |
| `@typescript-eslint/consistent-type-imports` | `All imports in the declaration are only used as types. Use import type` | A type is imported like a value | Change `import { UserType }` to `import type { UserType }` |

## Order and variables

| Rule | What you will see | What it means | How to fix it |
| --- | --- | --- | --- |
| `no-use-before-define` | `'formatReport' was used before it was defined` | Something is used above the line that creates it | Move the definition **above** the code that uses it |
| `no-restricted-syntax` | `Use const. If this value really must be reassigned…` | A variable is declared with `let` | Change `let` to `const`. If the value really must change, see [the allowed exceptions](#the-only-allowed-exceptions) |
| `no-var` | `Unexpected var, use let or const instead` | A variable is declared with `var` | Change `var` to `const` |
| `prefer-const` | `'total' is never reassigned. Use 'const' instead` | A `let` variable never changes | Change `let` to `const` |
| `no-magic-numbers` | `No magic number: 3` | A bare number is used in the logic | Give it a name: `const MAXIMUM_RETRY_ATTEMPTS = 3;` |
| `unicorn/name-replacements` | ``The variable `btn` should be named `button` `` | A name is shorthand | Rename it to the full English word |
| `unicorn/no-top-level-side-effects` | `Do not use top-level side effects in exported modules` | The file runs code as it loads | Put the code inside a function and export the function |

## Functions

| Rule | What you will see | What it means | How to fix it |
| --- | --- | --- | --- |
| `func-style` | `Expected a function expression` | The `function` keyword was used | Rewrite as an arrow function: `const name = () => { … };` |
| `prefer-arrow-callback` | `Unexpected function expression` | A callback uses the `function` keyword | Rewrite the callback as an arrow function |
| `no-restricted-syntax` | `Use an arrow function` | `const name = function () {}` was used | Rewrite as `const name = () => {}` |
| `no-restricted-syntax` | `Use a single object parameter when a function needs more than one value` | A function has more than one parameter | Take one object instead: `({ name, emailAddress }: CreateUserProperties) =>` |
| `no-restricted-syntax` | `Use functions, not classes` | A `class` was used | Rewrite it as functions |
| `max-depth` | `Blocks are nested too deeply (4). Maximum allowed is 3` | `if`s and loops are nested more than three deep | Return early for the error cases, or move the inner part into its own function |
| `no-nested-ternary` | `Do not nest ternary expressions` | A `? :` sits inside another `? :` | Use an `if`, or move it into its own function |

## Files

| Rule | What you will see | What it means | How to fix it |
| --- | --- | --- | --- |
| `max-lines` | `File has too many lines (312). Maximum allowed is 300` | The file is over 300 lines | Split it: move functions to `utilities/`, sub-components to their own folders, types to `types.ts` |
| `unicorn/filename-case` | `Filename is not in camel case or pascal case` | The file name is in the wrong case | Rename it: camelCase for code files, PascalCase for component files |

## Types

| Rule | What you will see | What it means | How to fix it |
| --- | --- | --- | --- |
| `@typescript-eslint/no-explicit-any` | `Unexpected any. Specify a different type` | `any` was used | Use the real type, or `unknown` and then check it |
| `@typescript-eslint/no-non-null-assertion` | `Forbidden non-null assertion` | `value!` was used | Check that the value exists first: `if (!value) { return; }` |
| `@typescript-eslint/consistent-type-assertions` | `Do not use any type assertions` | `value as SomeType` was used | Validate the value instead. If a cast is truly needed, see [the allowed exceptions](#the-only-allowed-exceptions) |
| `@typescript-eslint/naming-convention` | ``Interface name `User` must match the RegExp: /(Properties\|Type)$/u`` | A type name does not end in `Properties` or `Type` | Rename it: `UserType`, `ButtonProperties` |

## React

| Rule | What you will see | What it means | How to fix it |
| --- | --- | --- | --- |
| `react/jsx-no-bind` | `JSX props should not use arrow functions` | A function is written inside the JSX, or passed without `useCallback` | Declare it above with `useCallback` and pass it by name |
| `react/no-multi-comp` | `Declare only one React component per file` | The file has more than one component | Move the second component to its own folder |
| `react/function-component-definition` | An error naming this rule | A component is written with the `function` keyword | Rewrite it as an arrow function. `pnpm lint:fix` does this automatically |

## Comments

| Rule | What you will see | What it means | How to fix it |
| --- | --- | --- | --- |
| `@eslint-community/eslint-comments/require-description` | `Unexpected undescribed directive comment. Include descriptions to explain why the comment is necessary` | An `eslint-disable` comment has no reason | Add the reason after ` -- `. Better: remove the comment and fix the code |

---

## The only allowed exceptions

Two rules may be switched off for a single line. Both need the reason written after ` -- `, and ESLint rejects the comment without one.

### A variable that must be reassigned

Always use `const`. When a value genuinely has to change — a running total, a retry counter — use `let` and say why:

```ts
// eslint-disable-next-line no-restricted-syntax -- the running total is built up across the loop
let runningTotal = 0;
```

Before reaching for `let`, check whether `const` with `map`, `filter` or `reduce` does the job. It usually does.

### A type cast that cannot be avoided

```ts
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- the API returns untyped JSON; validated by parseUser below
const user = response.data as UserType;
```

Nothing else is switched off. If another rule seems impossible to satisfy, the code needs restructuring — ask before disabling it.

---

## Errors that stop ESLint running

| What you will see | What it means | How to fix it |
| --- | --- | --- |
| `typescript-eslint does not support TS 7.0` | The linter cannot run against TypeScript 7 yet | See the [TypeScript 7 note](/Standards/eslint#installation) on the ESLint page |
| `contextOrFilename.getFilename is not a function` | The React plugin cannot detect the React version | Set `settings.react.version` to the project's React version instead of `"detect"` |
| `Cannot find module '…'` | A lint package is not installed | Run the install commands on the [ESLint page](/Standards/eslint#installation) |

---

## How errors are caught

Lint runs in three places, so a broken standard is caught before it reaches `main`:

| Where | When | What happens on an error |
| --- | --- | --- |
| **AI agents** | Before finishing any task | The agent fixes the error. Its work is not done until `pnpm lint` passes |
| **Git hook** (`.husky/pre-commit`) | When a person commits | The commit is refused until the errors are fixed |
| **CI** | On every pull request | The pull request cannot be merged |
