---
sidebar_position: 3
---

# Folder Structure

This guide defines standard folder organization patterns for Activatus projects.

## Principles

1. **Predictability** - Developers should know where to find things
2. **Scalability** - Structure should work for small and large projects
3. **Consistency** - Same patterns across all projects
4. **Clarity** - Folder names should describe their purpose

---

## 📁 Recommended Next.js Structure

For Next.js projects using App Router, use the **root-level `app/` directory**. This is the modern Next.js standard.

```text
project-root/
├── app/                                             # Next.js App Router pages & layouts
│   ├── (routes)/                                    # Route groups (kebab-case)
│   │   ├── account-settings/
│   │   │   ├── components/                         # Route-specific components
│   │   │   │   └── accountForm/                    # Example component structure
│   │   │   │       ├── AccountForm.tsx             # Component implementation
│   │   │   │       ├── AccountForm.test.tsx        # Unit tests
│   │   │   │       ├── types.ts                    # Component types
│   │   │   │       └── index.ts                    # Export file
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── api/                                         # API routes (kebab-case)
│   │   ├── users/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/                                      # React components
│   ├── ui/                                          # Reusable UI components
│   │   └── button/                                  # Example component structure
│   │       ├── Button.tsx                           # Component implementation
│   │       ├── Button.test.tsx                      # Unit tests
│   │       ├── Button.stories.tsx                   # Storybook stories
│   │       ├── types.ts                             # Component types
│   │       └── index.ts                             # Export file
│   ├── features/                                    # Feature-specific components
│   └── layout/                                      # Layout components
├── library/                                             # Core libraries & integrations
│   ├── permissions/                                 # Permission files (grouped)
│   │   ├── index.ts                                 # Main definitions
│   │   ├── api.ts                                   # API permissions
│   │   ├── page.ts                                  # Page permissions
│   │   └── plan.ts                                  # Plan permissions
│   ├── integrations/                                # External services (grouped)
│   │   ├── stripe.ts                                # Payment processing
│   │   └── supabase/                                # Database integration
│   │       ├── client.ts
│   │       └── mock/
│   ├── middleware/                                  # Middleware concerns (grouped)
│   │   ├── cors.ts
│   │   ├── rateLimit.ts
│   │   └── session.ts
│   ├── validation/                                  # Validation schemas
│   ├── constants/                                   # Constants
│   ├── errors/                                      # Error handlers
│   └── types/                                       # Type definitions
├── utilities/                                           # Reusable functions used across the app
│   ├── formatCurrency/                              # One folder per function
│   │   ├── formatCurrency.ts
│   │   ├── formatCurrency.test.ts
│   │   └── index.ts
│   ├── formatDate/
│   │   ├── formatDate.ts
│   │   ├── formatDate.test.ts
│   │   └── index.ts
│   └── index.ts                                     # Exports every function
├── hooks/                                           # Custom React hooks
├── services/                                        # Business logic services
├── stores/                                          # State management stores
├── types/                                           # TypeScript type definitions
├── constants/                                       # App constants
├── styles/                                          # Global styles
├── public/                                          # Static assets
├── tests/                                           # Test files
├── documentation/                                            # Project documentation — every file is a Decision Doc
│   ├── overview/                                    # What the project is and how it works
│   ├── architecture/                                # How the system is built
│   ├── scope/                                       # What is in, out and later
│   └── ...                                          # The other standard folders
├── documentationSite/                                        # Docusaurus viewer for documentation/ (config only)
├── package.json
├── next.config.mjs
├── tsconfig.json
└── eslint.config.mjs
```

---

## 📁 Next.js Project Structure

**Next.js modern standard** (App Router) uses root-level directories:

```text
project-root/
├── app/                    # Next.js App Router
├── components/             # React components
├── library/                    # Core libraries & integrations
├── utilities/                  # Reusable functions
├── public/                 # Static assets
├── documentation/                   # Project documentation (Markdown)
├── documentationSite/               # Docusaurus viewer for documentation/
├── package.json
├── next.config.mjs
└── tsconfig.json
```

### 💡 Why root-level for Next.js?

- **Next.js standard** - Official documentation uses root-level
- **Simpler imports** - Cleaner import paths
- **Faster development** - No abstraction layer
- **Better Next.js integration** - Optimized for the framework
- **Easier for beginners** - Less complexity
- **Framework conventions** - Matches Next.js ecosystem

---

## 🎯 Route-Specific Components Pattern

Components can live inside route folders alongside their pages. Only if the component is specific to that route

### ✅ Example: Components in Routes

```text
app/
├── (routes)/
│   ├── account-settings/
│   │   ├── components/       # Specific to account-settings
│   │   │   └── accountForm/
│   │   │       ├── AccountForm.tsx
│   │   │       ├── AccountForm.test.tsx
│   │   │       ├── types.ts
│   │   │       └── index.ts
│   │   │   └── accountHeader/
│   │   │       ├── AccountHeader.tsx
│   │   │       └── types.ts
│   │   │       └── index.ts
│   │   └── page.tsx
│   └── page.tsx
└── api/
```

### 💡 When to Use This Pattern

- **Route-specific components** - Place components inside the route folder if they're only used by that route
- **Shared route components** - Place components in the route group folder if shared across multiple routes
- **Global components** - Place components in root `components/` if used across the entire app

---

## 🧩 Component Organization

Organize components by what they **do**, not what they **are**:

```text
components/
├── ui/                      # Reusable UI components
│   ├── button/
│   ├── form/
│   └── modal/
├── features/                # Feature-specific components
│   ├── userManagement/
│   ├── billing/
│   └── dashboard/
└── layout/                  # Layout components
    ├── header/
    ├── sidebar/
    └── footer/
```

### ❌ Avoid: Type-Based Grouping

Unless using Atomic Design deliberately:

```text
components/
├── atoms/                   # Too abstract
├── molecules/               # Hard to navigate
└── organisms/               # Unclear boundaries
```

---

## 🧰 Utilities

**Every reusable function lives in a utilities folder or file**, never inside a UI file. Where it goes depends on who uses it:

| Used by | Location | Example |
| --- | --- | --- |
| The whole app | Global `utilities/` folder at the project root | `utilities/formatCurrency/` |
| One feature | That feature's `utilities/` folder | `components/features/billing/utilities/calculateInvoiceTotal/` |
| One component | A `utilities/` folder inside that component's folder | `components/features/billing/invoiceTable/utilities/sortInvoicesByDate/` |

Every `utilities/` folder has the same shape, at every level: **one folder per function**, holding the function, its test file and an `index.ts` — and an **`index.ts`** in the `utilities/` folder that exports them all.

```text
project-root/
├── utilities/                                       # Global: used across the app
│   ├── formatCurrency/
│   │   ├── formatCurrency.ts
│   │   ├── formatCurrency.test.ts
│   │   └── index.ts
│   ├── formatDate/
│   │   ├── formatDate.ts
│   │   ├── formatDate.test.ts
│   │   └── index.ts
│   └── index.ts
└── components/
    ├── features/
    │   └── billing/
    │       ├── utilities/                           # Feature: used only by billing
    │       │   ├── calculateInvoiceTotal/
    │       │   │   ├── calculateInvoiceTotal.ts
    │       │   │   ├── calculateInvoiceTotal.test.ts
    │       │   │   └── index.ts
    │       │   └── index.ts
    │       └── invoiceTable/
    │           ├── InvoiceTable.tsx
    │           └── utilities/                       # Component: used only by InvoiceTable
    │               ├── sortInvoicesByDate/
    │               │   ├── sortInvoicesByDate.ts
    │               │   ├── sortInvoicesByDate.test.ts
    │               │   └── index.ts
    │               └── index.ts
    └── ui/
```

### The `index.ts` files

Each function folder has an `index.ts` that exports its function, and the `utilities/` folder has an `index.ts` that exports every function, so imports stay neat:

```ts title="utilities/formatCurrency/index.ts"
export { formatCurrency } from "./formatCurrency";
```

```ts title="utilities/index.ts"
export { formatCurrency } from "./formatCurrency";
export { formatDate } from "./formatDate";
```

```ts
// ✅ Good — import from the utilities folder
import { formatCurrency, formatDate } from "@/utilities";
import { sortInvoicesByDate } from "./utilities";

// ❌ Bad — reaching into the function's folder
import { formatCurrency } from "@/utilities/formatCurrency/formatCurrency";
```

Add the export to `utilities/index.ts` whenever you add a function.

### Rules

- **Start local, promote when shared.** A function begins in the component's `utilities/`. When a second component in the feature needs it, move its folder to the feature's `utilities/`. When a second feature needs it, move it to the global `utilities/`.
- **One function per folder**, with the folder and file named after the function (`formatCurrency/formatCurrency.ts`), plus its test file and an `index.ts`.
- **Every function has a test file** in the same folder. See [Readable Code](/Standards/readable-code#every-function-and-component-has-a-test-file).
- **Import from the `utilities` folder**, never from the files inside it.
- **Keep UI files clean.** If a function could be written in another file, it does not belong in the component file. See [Writing a component](/Structure/component-organization#-writing-a-component).

---

## 🧪 Test Placement

**Co-locate tests** with the code they test:

```text
components/
├── button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   └── index.ts
hooks/
├── useUserData/
│   ├── useUserData.ts
│   ├── useUserData.test.ts
│   └── index.ts
utilities/
├── formatCurrency/
│   ├── formatCurrency.ts
│   ├── formatCurrency.test.ts
│   └── index.ts
└── index.ts
```

---

## 📝 Project Documentation

**Keep project documentation in a root-level `documentation/` folder.** Every file in it is a Decision Doc, and every project uses the same folders. The Docusaurus viewer that displays it at `/documentation` lives beside it in `documentationSite/`:

```text
project-root/
├── documentation/                    # The docs: plain Markdown only. Every file is a Decision Doc
│   ├── overview/            # What the project is, how it works, how to write docs
│   ├── architecture/        # How the system is built
│   ├── design/              # How it looks and behaves
│   ├── scope/               # What is in, out and later
│   ├── ...                  # The other standard folders
│   └── product/             # Decisions specific to this product
└── documentationSite/                # The viewer: Docusaurus config, no content
```

See [Documentation](/Standards/documentation) for the full list of folders, the doc format, and how docs are displayed and kept up to date.

Name documentation folders and files in **kebab-case** (`background-jobs.md`), not camelCase (`backgroundJobs.md`). The name becomes the page's URL on the docs site.

---

## 📄 Configuration Files

**Keep configuration at the root** where tools expect it:

```text
/root
├── eslint.config.mjs         # ESLint configuration
├── prettier.config.js       # Prettier configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies & scripts
└── .env.local               # Environment variables (gitignored)
```

---

## 🚨 Red Flags

Avoid these anti-patterns:

- ❌ **Deep nesting** - More than 4-5 levels deep
- ❌ **Scattered logic** - Related code in multiple unrelated folders
- ❌ **Vague names** - `helpers/`, `misc/`, `stuff/` without organization
- ❌ **Inconsistent patterns** - Different structures for similar things

---

## 📚 Naming Conventions

See [Naming Conventions](/Structure/naming-conventions) for detailed file and folder naming rules.

**Quick reference:**

- **Component files**: PascalCase (`UserProfile.tsx`)
- **Utility files**: camelCase (`apiUtilities.ts`)
- **Hook files**: camelCase with `use` prefix (`useUserData.ts`)
- **Service files**: camelCase with `Service` suffix (`apiService.ts`)
- **Route Folder names**: kebab-case (`user-management/`, `api-routes/`)
- **Component Folder names**: camelCase (`header/`, `model/`)
- **Documentation files**: kebab-case (`background-jobs.md`)

---

## 📚 Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Project Structure](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [Monorepo Patterns](https://monorepo.tools/)
