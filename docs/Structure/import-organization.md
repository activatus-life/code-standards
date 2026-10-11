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
import { useAuth } from "@acme/auth";

// 3. External packages
import { format } from "date-fns";
import clsx from "clsx";

// 4. Side effect imports
import "prismjs/themes/prism-tomorrow.css";

// 5. Parent imports
import { formatDate } from "../utils/date-helpers";

// 6. Same-folder imports
import { Header } from "./Header";
import { useUserData } from "./useUserData";

// 7. Style imports
import "./UserProfile.css";
import styles from "./styles.module.css";
```

## Auto-Formatting

This import order is **automatically enforced** by ESLint. When you save a file, imports will automatically sort to match this pattern.

### Enable Auto-Fix on Save

If imports aren't auto-sorting on save, add this to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
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

## Not Enforced by ESLint

Import order is a **convention, not a lint rule**. Follow the same pattern in every file so imports are easy to read, but ESLint will not report an error if the order differs.
