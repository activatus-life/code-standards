---
sidebar_position: 4
---

# Import Organization

Consistent import organization makes code easier to read and understand.

## Import Order

Follow this order in all files:

1. **React and core packages**
2. **Internal workspace packages** (the project's own scope, e.g. `@acme/*`)
3. **External packages**
4. **Side effect imports**
5. **Parent imports** (`../`)
6. **Same-folder imports** (`./`)
7. **Style imports** (`.css`, `.module.css`)

## Example

```tsx
// 1. React and core packages
import React, { useState, useEffect } from "react";
import { Link } from "@radix-ui/react-navigation-menu";

// 2. Internal workspace packages
import { Button } from "@acme/ui";
import { useAuthentication } from "@acme/authentication";

// 3. External packages
import { format } from "date-fns";
import clsx from "clsx";

// 4. Side effect imports
import "prismjs/themes/prism-tomorrow.css";

// 5. Parent imports
import { formatDate } from "../utils";

// 6. Same-folder imports
import { Header } from "./Header";
import { useUserData } from "./useUserData";

// 7. Style imports
import "./UserProfile.css";
import styles from "./styles.module.css";
```

## Why This Order?

1. **React first** - Most important dependency, immediately visible
2. **Internal packages** - Your team's code, separate from third-party
3. **External packages** - Third-party dependencies
4. **Side effects** - Imports that don't export values (CSS, polyfills)
5. **Parent imports** - Code from parent directories
6. **Same-folder** - Code from the current directory
7. **Styles last** - Visual separation, easy to find style imports

## Rules

- ✅ **Alphabetized** within each group
- ✅ **Blank lines** between groups
- ✅ **No duplicates** - Import each module once

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
// card/cardHeader/CardHeader.tsx

// ✅ Good — import the file directly
import type { CardProps } from "../types";

// ❌ Bad — the card index imports CardHeader, so this is a circle
import { Card } from "..";
```

| Importing from         | Import through                                                         |
| ---------------------- | ---------------------------------------------------------------------- |
| **Outside** the folder | The folder's `index.ts`: `import { Card } from "@/components/ui/card"` |
| **Inside** the folder  | The file itself: `import type { CardProps } from "../types"`           |

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

## Import Order Is Not Enforced

The **order of the import lines** is a convention, not a lint rule. Follow the same pattern in every file so imports are easy to read, but ESLint will not report an error if the order differs.
