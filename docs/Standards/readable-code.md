---
sidebar_position: 0
---

# Readable Code

Every file must be readable by a person who has never seen it before. Code is read far more often than it is written, so we optimise for the reader.

## The rules

| Rule                                                                                                | Enforced by                                                   |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [No file longer than 300 lines](#no-file-longer-than-300-lines)                                     | ESLint `max-lines` (test files exempt)                        |
| [Names are full English words](/Standards/human-readable-names) — everywhere, including form fields | ESLint for code names; code review and AI agents for the rest |
| [Arrow functions everywhere](#arrow-functions-everywhere)                                           | ESLint `func-style`, `prefer-arrow-callback`                  |
| [Always `const`](#always-const)                                                                     | ESLint `no-restricted-syntax`, `prefer-const`, `no-var`       |
| [A function does one thing](#a-function-does-one-thing)                                             | Code review                                                   |
| [Every function and component has a test file](#every-function-and-component-has-a-test-file)       | Developers and AI agents — not linted                         |
| [Functions, never classes](#functions-never-classes)                                                | ESLint `no-restricted-syntax`                                 |
| [Return early, nest shallow](#return-early-nest-shallow)                                            | ESLint `max-depth`                                            |
| [No magic numbers or strings](#no-magic-numbers-or-strings)                                         | ESLint `no-magic-numbers` (numbers), code review (strings)    |
| [One parameter; always an object for more](#one-parameter-always-an-object-for-more)                | ESLint `no-restricted-syntax`                                 |
| [No nested ternaries](#no-nested-ternaries)                                                         | ESLint `no-nested-ternary`                                    |
| [No boolean flag parameters](#no-boolean-flag-parameters)                                           | Code review                                                   |
| [Comments explain why, not what](#comments-explain-why-not-what)                                    | Code review                                                   |
| [No `any`, no `!`, no unexplained `as`](#no-any-no--no-unexplained-as)                              | ESLint `@typescript-eslint` rules                             |
| [One component per file](#one-component-per-file)                                                   | ESLint `react/no-multi-comp`                                  |
| [Named exports only](#named-exports-only)                                                           | ESLint `import-x/no-default-export`                           |
| [Type names say what they are](#type-names-say-what-they-are)                                       | ESLint `@typescript-eslint/naming-convention`                 |
| [Error messages say what happened and what to do](#error-messages-say-what-happened-and-what-to-do) | Code review                                                   |

See the [ESLint configuration](/Standards/eslint) for the rule setup, and [Fixing Lint Errors](/Standards/lint-errors) for what each error means and how to fix it.

---

## No file longer than 300 lines

A file over 300 lines is doing more than one job. Split it before it gets there:

- Move reusable functions into a [utils folder](/Structure/folder-structure#-utils)
- Move sub-components into [their own folders](/Structure/component-organization#nested-components)
- Move types into `types.ts`

Blank lines and comments do not count towards the limit. **Test files are exempt** — a thorough test file can run long.

---

## Names are full English words

**Every name in the project is made of whole, human-readable words** — not just variables, but folders, files, props, form fields, types, database columns, environment variables, everything.

This rule has its own page, because it applies everywhere: **[Human-Readable Names](/Standards/human-readable-names)**. Read it in full.

---

## Arrow functions everywhere

**Every function is an arrow function.** Components, utils, services, callbacks — all of them. Never use the `function` keyword.

One way of writing a function means nobody has to choose, and every file reads the same.

```tsx
// ✅ Good
export const Button = ({ label }: ButtonProps) => {
  return <button>{label}</button>;
};

export const formatCurrency = (amount: number) => {
  return CURRENCY_FORMATTER.format(amount);
};

export const getUsers = async () => {
  return database.users.findAll();
};
```

```tsx
// ❌ Bad
export function Button({ label }: ButtonProps) {
  return <button>{label}</button>;
}

export const formatCurrency = function (amount: number) {
  return CURRENCY_FORMATTER.format(amount);
};
```

Three things to know:

- **Define before use.** An arrow function is written above the code that uses it. This is [enforced](/Structure/import-organization#3-define-before-use), and it means a mistake fails straight away instead of being hidden.
- **Generic components need a trailing comma** in `.tsx` files, so the type parameter is not read as JSX: `const List = <ItemType,>({ items }: ListProps<ItemType>) => { … }`.
- **Next.js files that need a default export** take two lines:

  ```tsx title="app/users/page.tsx"
  const Page = () => {
    return <UserList />;
  };

  export default Page;
  ```

---

## Always `const`

**Declare every variable with `const`.** A `const` cannot be reassigned, so a reader knows its value is the same everywhere below. Never use `var`.

```ts
// ✅ Good
const orderTotal = orderItems.reduce(
  (runningTotal, orderItem) => runningTotal + orderItem.price,
  0,
);
const activeUsers = users.filter((user) => user.isActive);
```

```ts
// ❌ Bad
let orderTotal = 0;
for (const orderItem of orderItems) {
  orderTotal += orderItem.price;
}

var activeUsers = [];
```

### When `let` is genuinely needed

Sometimes a value really must change. Use `let`, and **add a comment that says so** — the same way a type cast needs one. Without the comment, ESLint rejects the `let`:

```ts
// eslint-disable-next-line no-restricted-syntax -- the retry count goes up on every failed attempt
let retryAttemptCount = 0;
```

The comment is the point: it tells the reader "yes, this one changes, and here is why". Before using `let`, check whether `map`, `filter` or `reduce` with `const` does the job.

---

## A function does one thing

If you need the word "and" to describe what a function does, it is two functions.

```ts
// ✅ Good — each function has one job
const validateEmailAddress = (emailAddress: string) => {
  return EMAIL_ADDRESS_PATTERN.test(emailAddress);
};

const saveUser = (user: UserType) => {
  return database.users.insert(user);
};

const sendWelcomeEmail = (user: UserType) => {
  return emailService.send({
    to: user.emailAddress,
    template: WELCOME_EMAIL_TEMPLATE,
  });
};
```

```ts
// ❌ Bad — validates, saves and sends an email
const handleUser = (user: UserType) => {
  if (!EMAIL_ADDRESS_PATTERN.test(user.emailAddress)) {
    throw new Error("Invalid email address");
  }
  database.users.insert(user);
  emailService.send({
    to: user.emailAddress,
    template: WELCOME_EMAIL_TEMPLATE,
  });
};
```

Small single-purpose functions are easy to name, easy to test and easy to reuse.

---

## Every function and component has a test file

Every function and every component has a test file that tests its functionality. ESLint does not check this — it is a rule for everyone writing code, **including AI agents such as Claude Code**: when you create a function or component, create its test file in the same change.

**One test file tests one thing.** A test file covers exactly one function or one component, and is named after it (`formatCurrency.test.ts`, `Button.test.tsx`). Never combine tests for several functions in one file.

The function and its test live together in their own folder:

```text
utils/
├── formatCurrency/
│   ├── formatCurrency.ts
│   ├── formatCurrency.test.ts
│   └── index.ts
└── index.ts
```

See [Utils](/Structure/folder-structure#-utils) for the folder layout and the `index.ts` files.

```ts title="utils/formatCurrency/formatCurrency.test.ts"
import { describe, expect, it } from "vitest";

import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("formats whole dollars with two decimal places", () => {
    expect(formatCurrency(5)).toBe("$5.00");
  });

  it("adds a thousands separator", () => {
    expect(formatCurrency(1250)).toBe("$1,250.00");
  });
});
```

Components keep their test beside the component file (`button/Button.tsx` and `button/Button.test.tsx`) — see [Component Organization](/Structure/component-organization).

---

## Functions, never classes

Write functions. Never use class definitions — not for components, not for services, not for utils.

```ts
// ✅ Good
export const createUserService = (database: DatabaseType) => {
  const findUserById = (userId: string) => {
    return database.users.find(userId);
  };

  return { findUserById };
};
```

```ts
// ❌ Bad
export class UserService {
  constructor(private database: DatabaseType) {}

  findUserById(userId: string) {
    return this.database.users.find(userId);
  }
}
```

---

## Return early, nest shallow

Deal with the error and empty cases first and return. The main logic then sits at the left edge of the function, not buried inside three `if`s. Never nest more than three levels deep.

```ts
// ✅ Good
const getDiscountedPrice = (order: OrderType) => {
  if (!order.customer) {
    return order.price;
  }

  if (!order.customer.isMember) {
    return order.price;
  }

  return order.price * MEMBER_DISCOUNT_MULTIPLIER;
};
```

```ts
// ❌ Bad
const getDiscountedPrice = (order: OrderType) => {
  if (order.customer) {
    if (order.customer.isMember) {
      return order.price * MEMBER_DISCOUNT_MULTIPLIER;
    } else {
      return order.price;
    }
  } else {
    return order.price;
  }
};
```

---

## No magic numbers or strings

A bare number or string in the middle of the logic tells the reader nothing. Give it a name.

```ts
// ✅ Good
const MAXIMUM_RETRY_ATTEMPTS = 3;
const ORDER_STATUS_SHIPPED = "shipped";

if (retryAttemptCount > MAXIMUM_RETRY_ATTEMPTS) {
  return;
}

if (order.status === ORDER_STATUS_SHIPPED) {
  sendShippingEmail(order);
}
```

```ts
// ❌ Bad
if (retryAttemptCount > 3) {
  return;
}

if (order.status === "shipped") {
  sendShippingEmail(order);
}
```

`-1`, `0` and `1` are allowed. See [Naming Conventions](/Structure/naming-conventions#constants) for how to name constants.

---

## One parameter; always an object for more

A function takes **one** parameter. When it needs more than one value, that parameter is an object, so every value is named where the function is called.

```ts
// ✅ Good — the call site explains itself
interface CreateUserProps {
  name: string;
  emailAddress: string;
  isAdministrator: boolean;
}

const createUser = ({
  name,
  emailAddress,
  isAdministrator,
}: CreateUserProps) => {
  // ...
};

createUser({
  name: "Sam Taylor",
  emailAddress: "sam@example.com",
  isAdministrator: false,
});
```

```ts
// ❌ Bad — what is false?
const createUser = (
  name: string,
  emailAddress: string,
  isAdministrator: boolean,
) => {
  // ...
};

createUser("Sam Taylor", "sam@example.com", false);
```

This applies to functions you define. Inline callbacks whose parameters are set by someone else are fine as they are — `orderItems.reduce((runningTotal, orderItem) => …)`, or a Next.js route handler.

---

## No nested ternaries

One ternary is fine. A ternary inside a ternary becomes an `if` or its own function.

```ts
// ✅ Good
const getStatusLabel = (order: OrderType) => {
  if (order.isCancelled) {
    return "Cancelled";
  }

  return order.isShipped ? "Shipped" : "Processing";
};
```

```ts
// ❌ Bad
const statusLabel = order.isCancelled
  ? "Cancelled"
  : order.isShipped
    ? "Shipped"
    : "Processing";
```

---

## No boolean flag parameters

A boolean that switches a function between two behaviours means it is two functions. Write both, and name them.

```ts
// ✅ Good
sendEmail({ user });
sendUrgentEmail({ user });
```

```ts
// ❌ Bad — the function does two different things
sendEmail({ user, isUrgent: true });
```

A boolean that is simply **data** — `isAdministrator` on a new user — is fine.

---

## Comments explain why, not what

The code already says what it does. A comment is for what the code cannot say: **why** it is written this way.

```ts
// ✅ Good — explains a decision the reader could not guess
// The payment provider rejects requests that arrive less than one second apart.
await waitMilliseconds(PAYMENT_PROVIDER_COOLDOWN_MILLISECONDS);
```

```ts
// ❌ Bad — repeats the code
// Wait for one second
await waitMilliseconds(1000);
```

- If a comment describes **what** the code does, rename things until the comment is not needed.
- **Never leave commented-out code.** Delete it — Git remembers.

---

## No `any`, no `!`, no unexplained `as`

All three switch the type checker off, so the reader can no longer trust the types.

| Avoid                             | Do instead                                                             |
| --------------------------------- | ---------------------------------------------------------------------- |
| `any`                             | `unknown`, then narrow it with a check                                 |
| `user!.name` (non-null assertion) | Check that `user` exists first                                         |
| `data as UserType` (type cast)    | Validate the data. If a cast is truly needed, add a comment saying why |

```ts
// ✅ Good
const getUserName = (user: UserType | undefined) => {
  if (!user) {
    return UNKNOWN_USER_NAME;
  }

  return user.name;
};
```

```ts
// ❌ Bad
const getUserName = (user: any) => {
  return user!.name as string;
};
```

`as const` is fine. See the [ESLint configuration](/Standards/eslint#typescript-eslintconsistent-type-assertions-never) for how to record the reason for a cast.

---

## One component per file

A file holds one component. A second component — however small — gets [its own folder](/Structure/component-organization#nested-components).

---

## Named exports only

Export things by name. A named export has the same name everywhere it is imported, so it can be searched for and renamed safely.

```ts
// ✅ Good
export const formatCurrency = (amount: number) => {
  // ...
};

import { formatCurrency } from "@/utils";
```

```ts
// ❌ Bad — every importer can call it something different
const formatCurrency = (amount: number) => {
  // ...
};

export default formatCurrency;

import format from "@/utils/formatCurrency";
```

The only default exports are the ones a tool demands: Next.js route files (`page.tsx`, `layout.tsx`), config files and Storybook stories.

---

## Type names say what they are

Every type name ends in **`Props`** or **`Type`**, so a reader can tell a type from a value at a glance.

| Suffix  | Use for                                                | Example                          |
| ------- | ------------------------------------------------------ | -------------------------------- |
| `Props` | The single object parameter of a component or function | `ButtonProps`, `CreateUserProps` |
| `Type`  | Everything else                                        | `UserType`, `OrderStatusType`    |

```ts
// ✅ Good
interface UserType {
  id: string;
  name: string;
}

type OrderStatusType = "processing" | "shipped" | "cancelled";

interface UserCardProps {
  user: UserType;
}
```

```ts
// ❌ Bad
interface User {}
type OrderStatus = "processing" | "shipped" | "cancelled";
interface UserCardData {}
```

Use a named type instead of a bare `string` wherever the value has a fixed set of options.

---

## Error messages say what happened and what to do

An error message is read by someone in the middle of a problem. Tell them what went wrong and how to fix it.

```ts
// ✅ Good
throw new Error(
  `Invoice total must be greater than zero, but received ${invoiceTotal}. Check the line item prices.`,
);
```

```ts
// ❌ Bad
throw new Error("Invalid input");
```
