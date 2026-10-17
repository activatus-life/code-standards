---
sidebar_position: 2
---

# Component Organization

Each component should be self-contained with all related files in its own folder.

## ✅ Recommended Component Structure

```text
components/
└── button/                        # camelCase folder
    ├── Button.tsx                 # Component implementation
    ├── Button.test.tsx            # Unit tests
    ├── Button.stories.tsx         # Storybook stories
    ├── utils/                     # Functions used only by this component
    │   ├── getButtonLabel/
    │   │   ├── getButtonLabel.ts
    │   │   ├── getButtonLabel.test.ts
    │   │   └── index.ts
    │   └── index.ts               # Exports every function
    ├── types.ts                   # Component types
    └── index.ts                   # Public API export
```

## Benefits

- **Co-located related files** - Everything for one component in one place
- **Easy to move/delete** - Just drag the folder
- **Clear boundaries** - Know exactly where code lives
- **Simple to understand** - New developers can navigate quickly

---

## 📄 `index.ts` Pattern

The `index.ts` file defines the component's public API and makes imports cleaner.

### Example

```typescript
// components/button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./types";
```

### Usage

```typescript
// Clean import from component folder
import { Button } from "@/components/ui/button";

// Instead of:
import { Button } from "@/components/ui/button/Button";
```

## Export Guidelines

- ✅ **Export public API only** - What users of the component need
- ✅ **Re-export types** - Convenience for TypeScript users
- ✅ **Keep imports clean** - Simple, predictable import paths
- ✅ **Document public exports** - Comments for exported items

---

## File Breakdown

### 📝 `Component.tsx`

The main component implementation with JSX and logic.

```typescript
// Button.tsx
import type { ButtonProps } from './types';

export const Button = ({ children, variant, size, ...buttonProps }: ButtonProps) => {
  return (
    <button className={`button button-${variant}`} {...buttonProps}>
      {children}
    </button>
  );
};
```

### 🧪 `Component.test.tsx`

Unit tests using Vitest & Testing Library.

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### 📖 `Component.stories.tsx`

Storybook stories for documentation and visual testing. Written the way [Storybook's docs](https://storybook.js.org/docs/writing-stories) write them, with `satisfies Meta<typeof Component>`: it is the one place `satisfies` is allowed. See [Type first, never `satisfies`](/Standards/readable-code#type-first-never-satisfies).

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { variant: "primary" },
} satisfies Meta<typeof Button>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};
```

### 📋 `types.ts`

TypeScript type definitions.

```typescript
// types.ts
export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}
```

### 📦 `index.ts`

Public API exports - the barrel file.

```typescript
// index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./types";
```

---

## 🧱 Writing a component

Every component file is laid out in the same order, so a reader always knows where to look.

| #   | Section               | Rule                                                                                                                                                                                                                |
| --- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Imports               | Ordered per [Import Organization](/Structure/import-organization)                                                                                                                                                   |
| 2   | Component             | The component is the first thing in the file after the imports. Always an [arrow function](/Standards/readable-code#arrow-functions-everywhere) — [never a class](/Standards/readable-code#functions-never-classes) |
| 3   | Variable declarations | Plain values worked out from props                                                                                                                                                                                  |
| 4   | State declarations    | `useState`, `useReducer`, `useRef`                                                                                                                                                                                  |
| 5   | Calculated values     | Wrapped in `useMemo`                                                                                                                                                                                                |
| 6   | Nested functions      | Only functions that need the component's state or props, wrapped in `useCallback`                                                                                                                                   |
| 7   | Effects               | `useEffect`                                                                                                                                                                                                         |
| 8   | Render logic          | The `return`. No inline functions                                                                                                                                                                                   |

### Example

```tsx title="UserListClient.tsx"
"use client";

// 1. Imports
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { UserListClientProps } from "./types";
import { UserListItem } from "./userListItem";
import { filterUsersByName } from "./utils";

// 2. The component is the first thing in the file
export const UserListClient = ({
  users,
  onUserSelect,
}: UserListClientProps) => {
  // 3. Variable declarations
  const totalUserCount = users.length;

  // 4. State declarations
  const [searchText, setSearchText] = useState("");

  // 5. Calculated values, wrapped in useMemo
  const visibleUsers = useMemo(
    () => filterUsersByName({ users, searchText }),
    [users, searchText],
  );

  // 6. Nested functions, wrapped in useCallback
  const handleSearchTextChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    },
    [],
  );

  // 7. Effects
  useEffect(() => {
    document.title = `${visibleUsers.length} of ${totalUserCount} users`;
  }, [visibleUsers.length, totalUserCount]);

  // 8. Render logic — no inline functions
  return (
    <section className="bg-surface text-text">
      <input value={searchText} onChange={handleSearchTextChange} />
      <ul>
        {visibleUsers.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            onUserSelect={onUserSelect}
          />
        ))}
      </ul>
    </section>
  );
};
```

### Keep the UI file clean

**If a function can be written in another file, move it out of the UI file.** A function that does not need the component's state or props is not a nested function — it belongs in a [utils folder](/Structure/folder-structure#-utils).

`filterUsersByName` above only needs its arguments, so it lives in the component's `utils/` folder, in its own folder beside its test file:

```text
userList/
├── UserListClient.tsx
└── utils/
    ├── filterUsersByName/
    │   ├── filterUsersByName.ts
    │   ├── filterUsersByName.test.ts
    │   └── index.ts
    └── index.ts
```

```ts title="utils/filterUsersByName/filterUsersByName.ts"
import type { UserType } from "../../types";

interface FilterUsersByNameProps {
  users: UserType[];
  searchText: string;
}

export const filterUsersByName = ({
  users,
  searchText,
}: FilterUsersByNameProps) => {
  const lowerCaseSearchText = searchText.toLowerCase();

  return users.filter((user) =>
    user.name.toLowerCase().includes(lowerCaseSearchText),
  );
};
```

Each function folder has an `index.ts`, and so does the `utils/` folder — both are one line:

```ts title="utils/filterUsersByName/index.ts"
export { filterUsersByName } from "./filterUsersByName";
```

```ts title="utils/index.ts"
export { filterUsersByName } from "./filterUsersByName";
```

The component imports it from the folder: `import { filterUsersByName } from "./utils";`

### No inline functions in render

Never define a function inside the JSX. Declare it above with `useCallback` and pass it by name:

```tsx
// ✅ Good
const handleSearchTextChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
  setSearchText(event.target.value);
}, []);

<input value={searchText} onChange={handleSearchTextChange} />

// ❌ Bad
<input value={searchText} onChange={(event) => setSearchText(event.target.value)} />
```

When each item in a list needs its own handler, give the item its own component rather than writing an inline function in the loop:

```tsx title="userListItem/UserListItem.tsx"
import { useCallback } from "react";

import type { UserType } from "../types";

interface UserListItemProps {
  user: UserType;
  onUserSelect?: (user: UserType) => void;
}

export const UserListItem = ({
  user,
  onUserSelect,
}: UserListItemProps) => {
  const handleClick = useCallback(() => {
    onUserSelect?.(user);
  }, [onUserSelect, user]);

  return (
    <li>
      <button onClick={handleClick}>{user.name}</button>
    </li>
  );
};
```

### Use `useMemo` and `useCallback`

- **`useMemo`** for any value calculated from props or state (filtering, sorting, totals)
- **`useCallback`** for every function passed to a child component or a JSX prop

ESLint enforces the function half of this with `react/jsx-no-bind` — see the [ESLint configuration](/Standards/eslint#reactjsx-no-bind-error).

---

## 🔀 Server and client components

**Server code and client code live in separate files.** The server component fetches the data and nests the client component inside it:

```text
components/
└── userList/
    ├── UserList.tsx               # Server component: fetches data, renders the client component
    ├── UserListClient.tsx         # Client component: state, effects, event handlers
    ├── utils/
    ├── types.ts
    └── index.ts
```

```tsx title="UserList.tsx"
import { getUsers } from "@/services/userService";

import { UserListClient } from "./UserListClient";

export const UserList = async () => {
  const users = await getUsers();

  return <UserListClient users={users} />;
};
```

```tsx title="UserListClient.tsx"
"use client";

import { useState } from "react";

import type { UserListClientProps } from "./types";

export const UserListClient = ({ users }: UserListClientProps) => {
  const [searchText, setSearchText] = useState("");
  // ...
};
```

### Rules

- **Server file**: data fetching, database and service calls, secrets. No `"use client"`, no hooks, no event handlers.
- **Client file**: starts with `"use client"`. State, effects and event handlers only — it receives its data as props.
- **The server component nests the client component**, never the other way round.
- **Name the client file with a `Client` suffix** (`UserListClient.tsx`) so the pair is obvious.
- **Export the server component from `index.ts`** — it is the public entry point.

---

## Reusable by design

Every component in `components/ui/` is built so it can be copied into another project unchanged: everything comes in through props, and it imports nothing from the project's features, services, stores or `app/` folder. Before building one, [look before you build](/Guides/component-library-workflow#1-look-before-you-build), and build it to the props in the [Design System Components](/design-system-components). See [Future-proofing](/Guides/component-library-workflow#future-proofing).

---

## Components from shadcn

A component added with the shadcn CLI is **our code** and follows everything on this page. Convert it when it is added: its own camelCase folder, one component per file, `types.ts`, `index.ts` and a test file. See [Adding a shadcn component](/Guides/component-library-workflow#adding-a-shadcn-component).

---

## Folder Naming

**Component folders use camelCase** to match the component name:

```text
✅ Good
components/
└── button/
    ├── Button.tsx
    └── index.ts

❌ Bad
components/
└── Button/
    ├── Button.tsx
    └── index.ts
```

This makes it easy to spot component folders and keeps them consistent with file naming.

---

## Nested Components

For components with sub-components, give each sub-component its own folder:

```text
components/
└── card/
    ├── Card.tsx
    ├── Card.test.tsx
    ├── cardHeader/
    │   ├── CardHeader.tsx
    │   ├── CardHeader.test.tsx
    │   ├── types.ts
    │   └── index.ts
    ├── cardBody/
    │   ├── CardBody.tsx
    │   ├── CardBody.test.tsx
    │   ├── types.ts
    │   └── index.ts
    ├── cardFooter/
    │   ├── CardFooter.tsx
    │   ├── CardFooter.test.tsx
    │   ├── types.ts
    │   └── index.ts
    ├── types.ts
    └── index.ts             # Re-exports all sub-components
```

### `index.ts` for Nested Components

```typescript
// Card/index.ts
export { Card } from "./Card";
export { CardHeader } from "./cardHeader";
export { CardBody } from "./cardBody";
export { CardFooter } from "./cardFooter";
export type { CardProps } from "./types";
```

---

## Importing Components

### Within the Same Folder

Inside a component's folder, import files directly. **Never import through the folder's own `index.ts`**, and never import the parent component from a sub-component — both create a [circular import](/Structure/import-organization#import-safety).

```typescript
// card/Card.tsx — the parent imports its sub-components
import { CardBody } from "./cardBody";
import { CardHeader } from "./cardHeader";
import type { CardProps } from "./types";

// card/cardBody/CardBody.tsx — a sub-component imports types by file
import type { CardProps } from "../types";

// ❌ Bad — a sub-component importing its parent through the index
import { Card } from "..";
```

### From Other Components

```typescript
// UserProfile.tsx
import { Card, CardHeader, CardBody } from "@/components/ui/card";
```

### Best Practices

- ✅ From **outside** a folder, import through its `index.ts` — the folder, not the file
- ✅ From **inside** a folder, import the file directly — never the folder's own `index.ts`
- ❌ Never import a parent component from one of its sub-components
- ✅ Use path aliases (`@/`) for consistency
- ❌ Avoid deep relative imports (`../../../Button`)

---

## When to Split Components

Consider creating separate component folders when:

1. **Used by more than one page** → Move to the section's `components/` folder, or `components/shared/`
2. **Complex logic** → Separate file for clarity
3. **Multiple variants** → Sub-components in same folder
4. **Shared styles** → Keep co-located

### Page Components

Keep components in the page's route folder if they're only used there:

```text
app/
└── account-settings/
    ├── components/
    │   └── accountForm/
    │       ├── AccountForm.tsx
    │       ├── AccountForm.test.tsx
    │       └── index.ts
    └── page.tsx
```

See [Where components live](/Structure/folder-structure#-where-components-live) for every location.

---

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest](https://vitest.dev/)
- [Next.js Project Structure](https://nextjs.org/docs/app/building-your-application/routing/colocation)
