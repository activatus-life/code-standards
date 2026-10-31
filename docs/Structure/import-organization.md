---
sidebar_position: 4
---

# Import Organization

Consistent import organization makes code easier to read and understand.

## Import order is sorted for you

**Prettier sorts the imports of every file** with `@ianvs/prettier-plugin-sort-imports`, the same way it sorts Tailwind classes. Nobody sorts imports by hand, and agents never reorder them themselves: `pnpm format`, or saving in the editor, does it. See [Import sorting](/docs/Standards/prettier#import-sorting).

```tsx
"use client";

import { readFileSync } from "node:fs";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui";
import { r, s } from "@/lib/constants";

import { formatDate } from "../utils/formatDate";

import type { SampleProps } from "./Sample.types";

import "./sample.css";
```

Node's own modules, then packages, the project's `@/` aliases, parent folders (`../`), and the same folder (`./`). **Side-effect imports, such as CSS, go after every other import**: the sorter never moves them, because the order they load in can matter.

## Importing components

**`components/ui/`, `components/layout/` and `components/shared/` each have an `index.ts`**, and code outside a category imports from it, so imports stay short:

```tsx
import { Button, Card } from "@/components/ui";
```

- **No `index.ts` directly in `components/`.** The import shows whether a component is a Design System Component, part of the site frame, or shared.
- **Inside a category, components import each other by file**, never through the category's own `index.ts`. See [Inside a folder, import files directly](#2-inside-a-folder-import-files-directly).
- **A category's `index.ts` exports only components a Client Component can import.** A Client Component that imports a category pulls in everything its `index.ts` exports, so one server-only component in it breaks the build for every Client Component that imports the category.
- **A component that reaches server-only code**, such as authentication, the database, secrets or `next/headers`, starts with `import "server-only";`. It is left out of its category's `index.ts`, and imported from its own folder:

  ```tsx
  // components/layout/siteHeader/SiteHeader.tsx
  import "server-only";

  // app/layout.tsx
  import { SiteHeader } from "@/components/layout/siteHeader";
  ```

  `import "server-only";` makes a mistake fail the build with a clear error, instead of sending server code to the browser.

## Import Safety

These four rules **are** enforced, and they are not about tidiness. They stop a whole class of bug: code that runs before the thing it needs exists.

### 1. No circular imports

**A file never imports a file that imports it back** — directly, or through a chain of other files.

```ts
// ❌ Bad — userService imports orderService, which imports userService
// services/userService.ts
import { getOrdersForUser } from "./orderService";

// services/orderService.ts
import { getUserById } from "./userService";
```

When two files import each other, one of them has to load first, and it sees the other half-finished. The code may work today and break when an unrelated import changes the loading order.

**The fix is to move the shared part into a third file** that both import, so the dependency runs one way:

```ts
// ✅ Good — both services import from a third file; neither imports the other
// services/userService.ts
import { findUserRecord } from "./userRecords";

// services/orderService.ts
import { findUserRecord } from "./userRecords";
```

Enforced by ESLint `import-x/no-cycle`.

### 2. Inside a folder, import files directly

**A folder's `index.ts` is for code outside the folder.** Code inside the folder imports its neighbours by file, never through the folder's own `index.ts`. Importing through your own index is the most common way a circular import is created by accident.

```ts
// card/components/cardHeader/CardHeader.tsx

// ✅ Good — import the file directly
import type { CardProps } from "../../types";

// ❌ Bad — the card index imports CardHeader, so this is a circle
import { Card } from "../..";
```

| Importing from         | Import through                                                         |
| ---------------------- | ---------------------------------------------------------------------- |
| **Outside** the folder | The folder's `index.ts`: `import { Card } from "@/components/ui/card"` |
| **Inside** the folder  | The file itself: `import type { CardProps } from "../../types"`        |

A parent component imports its sub-components. **A sub-component never imports its parent.** If a child needs something from the parent, the parent passes it as a prop.

### 3. Define before use

**A function or variable is written above the code that uses it.** Read top to bottom, a file never refers to something that has not been defined yet.

```ts
// ✅ Good
const formatReport = () => "report";

export const sendReport = () => formatReport();
```

```ts
// ❌ Bad — formatReport is used above where it is defined
export const sendReport = () => formatReport();

const formatReport = () => "report";
```

Enforced by ESLint `no-use-before-define`.

### 4. Files define things; they do not run things

**A file declares its functions and exports them. It does not call them as it loads.** The calling happens later, inside a component or another function.

```ts
// ✅ Good — nothing runs when this file is imported
export const connectToDatabase = () => createConnection(DATABASE_URL);

// ❌ Bad — importing this file opens a database connection
export const database = createConnection(DATABASE_URL);
```

Code that runs on import makes the order files load in matter. Code that only defines things does not.

Enforced by ESLint `unicorn/no-top-level-side-effects`.
