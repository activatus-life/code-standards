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
│   ├── ui/                                          # Design System Components
│   │   └── button/                                  # Example component structure
│   │       ├── Button.tsx                           # Component implementation
│   │       ├── Button.test.tsx                      # Unit tests
│   │       ├── Button.stories.tsx                   # Storybook stories
│   │       ├── types.ts                             # Component types
│   │       └── index.ts                             # Export file
│   └── shared/                                      # Used by more than one page
├── lib/                                             # Outside connections and app-wide setup
│   ├── permissions/                                 # Who may do what
│   │   ├── index.ts                                 # Main definitions
│   │   ├── api.ts                                   # API permissions
│   │   ├── page.ts                                  # Page permissions
│   │   └── plan.ts                                  # Plan permissions
│   ├── integrations/                                # The only code that talks to outside services
│   │   ├── stripe.ts                                # Payment processing
│   │   └── supabase/                                # Database integration
│   │       ├── client.ts
│   │       └── mock/
│   ├── middleware/                                  # Code that runs on every request
│   │   ├── cors.ts
│   │   ├── rateLimit.ts
│   │   └── session.ts
│   ├── validation/                                  # Schemas that check input
│   ├── constants/                                   # Constants shared across the app
│   ├── errors/                                      # Error types and handlers shared across the app
│   └── types/                                       # Types shared across the app; a component's own types stay in its types.ts
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
├── services/                                        # Business logic: what the app does
├── stores/                                          # State management stores
├── styles/                                          # Global styles
├── public/                                          # Static assets
├── tests/                                           # Test files
├── docs/                                            # Project documentation — every file is a Decision Doc
│   ├── overview/                                    # What the project is and how it works
│   ├── architecture/                                # How the system is built
│   ├── scope/                                       # What is in, out and later
│   └── ...                                          # The other standard folders
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
├── lib/                    # Outside connections and app-wide setup
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

## 🧩 Where components live

**A component lives where it is used.** There are no feature folders: a component either belongs to one page, to one section, or is shared.

| Used by                                                                                    | Lives in                                             | Example                                        |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ---------------------------------------------- |
| **Every project the same way** — the [Design System Components](/design-system-components) | `components/ui/`                                     | `components/ui/button/`                        |
| **More than one page** of this project                                                     | `components/shared/`                                 | `components/shared/siteHeader/`                |
| **A few pages in one section**                                                             | A `components/` folder in that section's route group | `app/(billing)/components/invoiceTable/`       |
| **One page only**                                                                          | A `components/` folder in that page's route folder   | `app/account-settings/components/accountForm/` |

A route group is a folder in brackets, such as `(billing)`. It groups pages without changing their URLs: `app/(billing)/invoices/page.tsx` is served at `/invoices`.

```text
project-root/
├── app/
│   ├── (billing)/                       # A section: groups pages, not part of the URL
│   │   ├── components/                  # Used by more than one billing page
│   │   │   └── invoiceTable/
│   │   ├── invoices/
│   │   │   └── page.tsx                 # /invoices
│   │   └── payments/
│   │       └── page.tsx                 # /payments
│   └── account-settings/
│       ├── components/                  # Used only by this page
│       │   └── accountForm/
│       │       ├── AccountForm.tsx
│       │       ├── AccountForm.test.tsx
│       │       ├── types.ts
│       │       └── index.ts
│       └── page.tsx                     # /account-settings
└── components/
    ├── ui/                              # Design System Components: Button, Card, Modal
    │   └── button/
    └── shared/                          # Used by more than one page of this project
        └── siteHeader/
```

### Rules

- **Start where it is used, and move it when it is shared.** A new component goes in its page's `components/` folder. When a second page in the same section needs it, move it to the section's `components/` folder. When a page in another section needs it, move it to `components/shared/`.
- **`components/ui/` is only for [Design System Components](/design-system-components).** They take everything through props and import nothing from the project, so they can be copied into another project unchanged. See [Reusable by design](/Structure/component-organization#reusable-by-design).
- **A page or shared component wraps Design System Components.** It holds this project's logic and data, and passes props down.
- **Never group by type** (`atoms/`, `molecules/`, `organisms/`). Group by where a component is used.

Other frameworks follow the same rule with their own folders. In a React app without Next.js, a page's folder is the folder for that screen.

---

## 🗂️ utils, services and lib {#utils-services-and-lib}

Three folders hold functions that are not components. Each function belongs in exactly one of them:

| Folder          | What goes in it                                                                                                                                                                              | Ask yourself                                                              | Examples                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **`utils/`**    | Small reusable functions with no side effects. The same input always gives the same output: formatting, calculating, sorting, checking                                                       | "Does it only work with what it is given?"                                | `formatCurrency`, `calculateInvoiceTotal`, `sortInvoicesByDate`   |
| **`services/`** | The business logic: what the app actually does. Its rules and operations, which may read and write data                                                                                      | "Is this a rule or an action of the product itself?"                      | `createInvoice`, `decideNextActions`, `sendWelcomeEmail`          |
| **`lib/`**      | Code that connects the app to something outside it, and the app-wide setup around that: integration clients, permissions, middleware, validation schemas, constants, errors and shared types | "Does it talk to another system, or set up something the whole app uses?" | `lib/integrations/stripe/`, `lib/permissions/`, `lib/validation/` |

- **Pages, API routes and server actions stay thin.** They take the request, call a function in `services/`, and return the result. Business logic never lives in them.
- **`services/` uses `lib/` to reach the outside world.** A service that charges a card calls the Stripe client in `lib/integrations/stripe/`, never the Stripe package directly.
- **`utils/` uses nothing outside itself.** If a function needs a database, an API or the environment, it is not a util: it belongs in `services/` or `lib/`.
- **Group `services/` by the [Ontology](/ontology) word it works on**, one folder per function: `services/invoice/createInvoice/`.

## 🧰 Utils

**Every reusable function lives in a `utils/` folder**, never inside a UI file. Where it goes depends on who uses it:

| Used by       | Location                                         | Example                                                           |
| ------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| The whole app | Global `utils/` folder at the project root       | `utils/formatCurrency/`                                           |
| One section   | A `utils/` folder in that section's route group  | `app/(billing)/utils/calculateInvoiceTotal/`                      |
| One component | A `utils/` folder inside that component's folder | `app/(billing)/components/invoiceTable/utils/sortInvoicesByDate/` |

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
└── app/
    └── (billing)/
        ├── utils/                               # Section: used only by billing pages
        │   ├── calculateInvoiceTotal/
        │   │   ├── calculateInvoiceTotal.ts
        │   │   ├── calculateInvoiceTotal.test.ts
        │   │   └── index.ts
        │   └── index.ts
        └── components/
            └── invoiceTable/
                ├── InvoiceTable.tsx
                └── utils/                       # Component: used only by InvoiceTable
                    ├── sortInvoicesByDate/
                    │   ├── sortInvoicesByDate.ts
                    │   ├── sortInvoicesByDate.test.ts
                    │   └── index.ts
                    └── index.ts
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

- **Start local, promote when shared.** A function begins in the component's `utils/`. When another component in the same section needs it, move its folder to the section's `utils/`. When anything outside the section needs it, move it to the global `utils/`.
- **One function per folder**, with the folder and file named after the function (`formatCurrency/formatCurrency.ts`), plus its test file and an `index.ts`.
- **Every function has a test file** in the same folder. See [Readable Code](/Standards/readable-code#every-function-and-component-has-a-test-file).
- **Import from the `utils` folder**, never from the files inside it.
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
utils/
├── formatCurrency/
│   ├── formatCurrency.ts
│   ├── formatCurrency.test.ts
│   └── index.ts
└── index.ts
```

---

## 📝 Project Documentation

**Keep project documentation in a root-level `docs/` folder.** Every file in it is a Decision Doc, and every project uses the same folders. The Docusaurus viewer that displays it at `/docs` lives beside it in `docsSite/`:

```text
project-root/
├── docs/                    # The docs: plain Markdown only. Every file is a Decision Doc
│   ├── overview/            # What the project is, how it works, how to write docs
│   ├── architecture/        # How the system is built
│   ├── design/              # How it looks and behaves
│   ├── scope/               # What is in, out and later
│   ├── ...                  # The other standard folders
│   └── product/             # Decisions specific to this product
└── docsSite/                # The viewer: Docusaurus config, no content
```

See [Documentation](/Standards/documentation) for the full list of folders, the doc format, and how docs are displayed and kept up to date.

Name documentation folders and files in **kebab-case** (`background-jobs.md`), not camelCase (`backgroundJobs.md`). The name becomes the page's URL on the docs site.

---

## 📄 Configuration Files

**Keep configuration at the root** where tools expect it:

```text
/root
├── eslint.config.mjs         # ESLint configuration
├── prettier.config.mjs       # Prettier configuration
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
- **Utils files**: camelCase (`apiUtils.ts`)
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
