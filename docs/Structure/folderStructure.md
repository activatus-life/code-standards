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
├── lib/                                             # Core libraries & integrations
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
├── utils/                                           # Reusable functions used across the app
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
├── docs/                                            # Project documentation
│   ├── scope/                                       # What is being built, and what is not
│   ├── design/                                      # How it is built
│   ├── decisions/                                   # Why it is built that way
│   ├── guides/                                      # How to run, deploy and fix it
│   └── standards/                                   # Local standards (optional)
├── docsSite/                                        # Docusaurus viewer for docs/ (config only)
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
├── lib/                    # Core libraries & integrations
├── utils/                  # Reusable functions
├── public/                 # Static assets
├── docs/                   # Project documentation (Markdown)
├── docsSite/               # Docusaurus viewer for docs/
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

## 🧰 Utils

**Every reusable function lives in a utils folder or file**, never inside a UI file. Where it goes depends on who uses it:

| Used by | Location | Example |
| --- | --- | --- |
| The whole app | Global `utils/` folder at the project root | `utils/formatCurrency/` |
| One feature | That feature's `utils/` folder | `components/features/billing/utils/calculateInvoiceTotal/` |
| One component | A `utils/` folder inside that component's folder | `components/features/billing/invoiceTable/utils/sortInvoicesByDate/` |

Every `utils/` folder has the same shape, at every level: **one folder per function**, holding the function, its test file and an `index.ts` — and an **`index.ts`** in the `utils/` folder that exports them all.

```text
project-root/
├── utils/                                       # Global: used across the app
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
    │       ├── utils/                           # Feature: used only by billing
    │       │   ├── calculateInvoiceTotal/
    │       │   │   ├── calculateInvoiceTotal.ts
    │       │   │   ├── calculateInvoiceTotal.test.ts
    │       │   │   └── index.ts
    │       │   └── index.ts
    │       └── invoiceTable/
    │           ├── InvoiceTable.tsx
    │           └── utils/                       # Component: used only by InvoiceTable
    │               ├── sortInvoicesByDate/
    │               │   ├── sortInvoicesByDate.ts
    │               │   ├── sortInvoicesByDate.test.ts
    │               │   └── index.ts
    │               └── index.ts
    └── ui/
```

### The `index.ts` files

Each function folder has an `index.ts` that exports its function, and the `utils/` folder has an `index.ts` that exports every function, so imports stay neat:

```ts title="utils/formatCurrency/index.ts"
export { formatCurrency } from "./formatCurrency";
```

```ts title="utils/index.ts"
export { formatCurrency } from "./formatCurrency";
export { formatDate } from "./formatDate";
```

```ts
// ✅ Good — import from the utils folder
import { formatCurrency, formatDate } from "@/utils";
import { sortInvoicesByDate } from "./utils";

// ❌ Bad — reaching into the function's folder
import { formatCurrency } from "@/utils/formatCurrency/formatCurrency";
```

Add the export to `utils/index.ts` whenever you add a function.

### Rules

- **Start local, promote when shared.** A function begins in the component's `utils/`. When a second component in the feature needs it, move its folder to the feature's `utils/`. When a second feature needs it, move it to the global `utils/`.
- **One function per folder**, with the folder and file named after the function (`formatCurrency/formatCurrency.ts`), plus its test file and an `index.ts`.
- **Every function has a test file** in the same folder. See [Readable Code](/Standards/readableCode#every-function-and-component-has-a-test-file).
- **Import from the `utils` folder**, never from the files inside it.
- **Keep UI files clean.** If a function could be written in another file, it does not belong in the component file. See [Writing a component](/Structure/componentOrganization#-writing-a-component).

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
utils/
├── formatCurrency/
│   ├── formatCurrency.ts
│   ├── formatCurrency.test.ts
│   └── index.ts
└── index.ts
```

---

## 📝 Project Documentation

**Keep project documentation in a root-level `docs/` folder**, split by purpose. The Docusaurus viewer that displays it at `/docs` lives beside it in `docsSite/`:

```text
project-root/
├── docs/                    # The docs: plain Markdown only
│   ├── index.md             # Overview
│   ├── scope/               # What is being built, and what is not
│   ├── design/              # How it is built
│   ├── decisions/           # Why it is built that way — one file per decision
│   ├── guides/              # How to run it, deploy it and fix it
│   └── standards/           # Local standards (optional)
└── docsSite/                # The viewer: Docusaurus config, no content
```

| Folder | Contents |
| --- | --- |
| `docs/scope/` | Project scope: goals, requirements, and what is in and out of scope |
| `docs/design/` | How the system works: the parts, the data and the key flows |
| `docs/decisions/` | One page per significant decision: what was chosen, why, and what was rejected |
| `docs/guides/` | Step-by-step instructions: run locally, deploy, fix common problems |
| `docs/standards/` | Local copy of the code standards. Only add this when the project should keep its standards locally instead of reading them from this repo |
| `docsSite/` | The Docusaurus site that shows `docs/` at the `/docs` route. Holds config only |

Name documentation files in **camelCase** (`projectScope.md`), not kebab-case (`project-scope.md`).

See [Documentation](/Standards/documentation) for how docs are written, displayed and kept up to date.

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

See [Naming Conventions](/Structure/namingConventions) for detailed file and folder naming rules.

**Quick reference:**

- **Component files**: PascalCase (`UserProfile.tsx`)
- **Utility files**: camelCase (`apiUtils.ts`)
- **Hook files**: camelCase with `use` prefix (`useUserData.ts`)
- **Service files**: camelCase with `Service` suffix (`apiService.ts`)
- **Route Folder names**: kebab-case (`user-management/`, `api-routes/`)
- **Component Folder names**: camelCase (`header/`, `model/`)
- **Documentation files**: camelCase (`projectScope.md`)

---

## 📚 Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Project Structure](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [Monorepo Patterns](https://monorepo.tools/)
