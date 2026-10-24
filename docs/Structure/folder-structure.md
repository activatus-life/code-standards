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
│   ├── (homepage)/                                  # The homepage, served at /
│   │   ├── components/                              # Used only by the homepage
│   │   └── page.tsx
│   └── layout.tsx
├── components/                                      # React components
│   ├── ui/                                          # Design System Components
│   │   └── button/                                  # Example component structure
│   │       ├── Button.tsx                           # Component implementation
│   │       ├── Button.test.tsx                      # Unit tests
│   │       ├── Button.stories.tsx                   # Storybook stories
│   │       ├── types.ts                             # Component types
│   │       └── index.ts                             # Export file
│   ├── layout/                                      # The site frame: navigation, header, footer
│   └── shared/                                      # Used by three or more pages
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
│   ├── constants/                                   # Constants shared across the app: see Constants below
│   │   ├── routes.ts                                # r: every link
│   │   ├── strings.ts                               # s: every piece of static text
│   │   ├── numbers.ts                               # Every loose named number
│   │   ├── noData.ts                                # Stand-in data for local development
│   │   ├── animation.ts                             # How things move, once there is any
│   │   ├── artwork.ts                               # What is drawn and where, once there is any
│   │   ├── classNames.ts                            # Class names shared between files, once there are any
│   │   └── index.ts
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

**A component lives where it is used.** There are no feature folders: a component belongs to one page or one section, is shared, or is part of the site frame.

| Used by                                                                                         | Lives in                                             | Example                                        |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| **Every project the same way** — the [Design System Components](/docs/design-system-components) | `components/ui/`                                     | `components/ui/button/`                        |
| **The site frame** — navigation, header, footer                                                 | `components/layout/`                                 | `components/layout/siteHeader/`                |
| **Three or more pages** of this project                                                         | `components/shared/`                                 | `components/shared/pricingTable/`              |
| **Three or more pages in one section**                                                          | A `components/` folder in that section's route group | `app/(billing)/components/invoiceTable/`       |
| **One or two pages**                                                                            | A `components/` folder in that page's route folder   | `app/account-settings/components/accountForm/` |
| **The homepage**                                                                                | `app/(homepage)/components/`                         | `app/(homepage)/components/heroSection/`       |

A route group is a folder in brackets, such as `(billing)`. It groups pages without changing their URLs: `app/(billing)/invoices/page.tsx` is served at `/invoices`.

**The homepage is a route group too: `app/(homepage)/`.** It holds the homepage's `page.tsx` and its own `components/` and `utils/` folders, and is served at `/`. Without it, the homepage's components sit loose in `app/components/` beside the root layout, with no clean place for the next page's. `app/` keeps only the root `layout.tsx` and the files Next.js needs there, such as `globals.css`. A folder inside `app/` is only a route when it holds a `page.tsx` or `route.ts`, so `components/` and `utils/` folders inside `app/` are safe: they never become URLs.

```text
project-root/
├── app/
│   ├── (billing)/                       # A section: groups pages, not part of the URL
│   │   ├── components/                  # Used by three or more billing pages
│   │   │   └── invoiceTable/
│   │   ├── invoices/
│   │   │   └── page.tsx                 # /invoices
│   │   └── payments/
│   │       └── page.tsx                 # /payments
│   ├── (homepage)/                      # The homepage, served at /
│   │   ├── components/                  # Used only by the homepage
│   │   │   └── heroSection/
│   │   └── page.tsx                     # /
│   ├── account-settings/
│   │   ├── components/                  # Used only by this page
│   │   │   └── accountForm/
│   │   │       ├── AccountForm.tsx
│   │   │       ├── AccountForm.test.tsx
│   │   │       ├── types.ts
│   │   │       └── index.ts
│   │   └── page.tsx                     # /account-settings
│   └── layout.tsx                       # The root layout
└── components/
    ├── ui/                              # Design System Components: Button, Card, Modal
    │   └── button/
    ├── layout/                          # The site frame: navigation, header, footer
    │   ├── siteHeader/
    │   └── siteFooter/
    └── shared/                          # Used by three or more pages of this project
        └── pricingTable/
```

### Rules

- **Start where it is used, and share it on the third use.** Two uses are not enough to see which props really change from one use to the next. Three are.
  1. **First use:** a new component goes in its page's `components/` folder.
  2. **Second use:** copy it into the second page's `components/` folder. Only one copy, and each copy has a comment naming the other: `// Copy of app/invoices/components/invoiceSummary/. Merge on the third use.`
  3. **Third use:** merge the copies into one component. Design its props from all three uses, move it to the section's `components/` folder if all three pages are in one section, or to `components/shared/` if not, and delete the copies.
- **This is the only copying allowed.** A third copy is a mistake. It does not apply to [Design System Components](/docs/design-system-components), which are shared from the start, or to constants, which always live in `lib/constants/`.
- **`components/ui/` is only for [Design System Components](/docs/design-system-components).** They take everything through props and import nothing from the project, so they can be copied into another project unchanged. See [Reusable by design](/docs/Structure/component-organization#reusable-by-design).
- **A props-only component that is not on the list yet stays in `components/ui/`.** A project cannot edit the standards, so it cannot add the component to the list itself. If a component takes everything through props and imports nothing from the project, keep it in `components/ui/` and record it in `docs/development/coding-standards.md`, under "Components for the standards", with its props. Tell the person, so it is added to the list in the next release.
- **`components/layout/` is the site frame**: the navigation, header, footer and anything else that frames the pages. It is this project's own code, so it may read `r` and `s`, and usually wraps Design System Components such as Navigation Bar and Footer. It does not have to be on every page, and it does not have to be rendered from a `layout.tsx` file. **Layout primitives, such as Duplex and Section Wrapper, are Design System Components**: they go in `components/ui/`, never `components/layout/`.
- **`components/shared/` is everything else used by three or more pages.** The difference from `components/layout/` is what it is, not how often it is used: a footer is layout even on one page, and a pricing table used on three pages is shared.
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
- **Group `services/` by the project's own ontology word it works on**, one folder per function: `services/invoice/createInvoice/`. The project's ontology is usually in `docs/product/ontology.md`, but it can be in another file. If you can't find it, ask.

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
- **Sort, find, get, filter and format functions are utils from the start.** A function that only works on the data passed to it goes in a `utils/` folder the first time it is written, never inside the component, even with one user.
- **One function per folder**, with the folder and file named after the function (`formatCurrency/formatCurrency.ts`), plus its test file and an `index.ts`.
- **Every function has a test file** in the same folder. See [Readable Code](/docs/Standards/readable-code#every-function-and-component-has-a-test-file).
- **Import from the `utils` folder**, never from the files inside it.
- **Keep UI files clean.** If a function could be written in another file, it does not belong in the component file. See [Writing a component](/docs/Structure/component-organization#-writing-a-component).

---

## 🔤 Constants: `r`, `s`, numbers, noData, animation, artwork and class names {#constants}

Every link, every piece of text on screen, every named number, every piece of stand-in data, and every motion, drawing and shared class name lives in `lib/constants/`, never written straight into a component. **There is no component-level `constants.ts`**: even a value only one file uses goes here, so every piece of text is in one place when the site is translated into other languages, and every project finds its values in the same seven files.

```text
lib/constants/
├── routes.ts      # r: every link
├── strings.ts     # s: every piece of static text
├── numbers.ts     # Every loose named number
├── noData.ts      # Stand-in data, once the data's shape is decided
├── animation.ts   # How things move, once there is any
├── artwork.ts     # What is drawn and where, once there is any
├── classNames.ts  # Class names shared between files, once there are any
└── index.ts       # Exports all of them
```

**These seven files are the only ones.** Each is one file, never split by topic. `routes.ts`, `strings.ts`, `numbers.ts` and `index.ts` exist from the start; the other four are created only once the project has something to put in them.

| A value that is…                                            | Goes in             |
| ----------------------------------------------------------- | ------------------- |
| A link                                                      | `r` in `routes.ts`  |
| Text shown on screen                                        | `s` in `strings.ts` |
| A single number with one job                                | `numbers.ts`        |
| Fake data shaped like a real response                       | `noData.ts`         |
| A group of values that together say how something moves     | `animation.ts`      |
| A group of values that together say what is drawn and where | `artwork.ts`        |
| A Tailwind class string used by more than one file          | `classNames.ts`     |

**This table is the base, and where each value goes is the project's call.** The table says what each file is for, not where every value in every project goes. The project reads its own values, decides which file each one belongs in, and keeps that choice the same across the codebase. A value that fits none of them is recorded under "Details" in `docs/development/coding-standards.md`, with the person's yes, and the work carries on.

A file outside the folder imports everything it needs in one line:

```tsx
import { NO_DATA_INSIGHTS, r, s } from "@/lib/constants";

<a href={r.contact}>{s.contact}</a>;
```

### `r`: routes

**`r` holds every link the app uses**: its own pages, outside sites, and `mailto:`, `tel:` and `sms:` links.

```ts title="lib/constants/routes.ts"
export const r = {
	contact: "/contact",
	email: "mailto:mail@example.com",
	insights: "/insights",
	linkedIn: "https://www.linkedin.com/in/example",
	sms: "sms:+61400000000",
};
```

- **A dynamic route starts from its `r` route.** Build the changing part where it is used: `` `${r.insights}/${insight.slug}` ``.
- **Name each key after the place it goes**, in camelCase: `r.myStory`, `r.linkedIn`.
- **No `"#"` placeholder links.** A link with nowhere to go yet is shown as plain text, without a link, with a TODO above it: `{/* TODO: Link to the pricing page once it exists */}`. A `"#"` link is a bug a user can click.

### `s`: strings

**`s` holds every piece of static text** shown on screen: headings, buttons, labels, aria-labels, page titles and descriptions, and longer Markdown copy.

```ts title="lib/constants/strings.ts"
export const s = {
	contact: "CONTACT",
	emailAriaLabel: "Email Tom",
	pageNotFound: "PAGE NOT FOUND",
	pageNotFoundDescription:
		"The page you are looking for does not exist",
};
```

- **The keys of `s` are the site's translation keys.** When a site gets more languages, each key is translated into each language. Name each key after what the text says or does, and never use one key for two different jobs.
- **Only real copy goes in `s`.** Dummy text belongs in `noData.ts`.

### A list of items with links

Each item's words go in `s` and its link goes in `r`, under the same key, so the words can be translated and the link stays with the other links. The component reads each one by name:

```ts title="lib/constants/strings.ts"
export const s = {
	plans: {
		starter: { title: "Starter", action: "Start free" },
		team: { title: "Team", action: "Talk to us" },
	},
};
```

```ts title="lib/constants/routes.ts"
export const r = {
	plans: {
		starter: "/signup?plan=starter",
		team: "/contact",
	},
};
```

```tsx title="app/(homepage)/components/pricingPlans/PricingPlans.tsx"
<Link href={r.plans.starter}>{s.plans.starter.action}</Link>
<Link href={r.plans.team}>{s.plans.team.action}</Link>
```

**Write each key out by name** when you mean one item: `r.plans.starter`, never `r.plans[planId]`. A reader can see exactly which words and which link each line uses.

**Inside a loop over the list, look each item up by its key.** A loop cannot name its items, so it reads `r` and `s` with the item's key, typed from `r` itself:

```ts title="lib/types/index.ts"
import type { r } from "@/lib/constants";

export type PlanIdType = keyof typeof r.plans;
```

```tsx
{planIds.map((planId) => (
	<Link key={planId} href={r.plans[planId]}>
		{s.plans[planId].action}
	</Link>
))}
```

- **The type comes from `r`**, so a missing or misspelt key fails the type check.
- **No separate lookup objects** that map a key to its link. `r` already is that lookup: a second one is a copy that drifts out of step.

### noData: stand-in data for local development

**`noData.ts` stands in for outside data while you work locally**, when the CMS, database or API can't be reached, such as when you have no internet. Every page still renders with something that looks real.

**Create it once the project has decided how its data comes in**, the shape of the CMS, database or API response. Not before: the shape may still change. If the person asks for stand-in data before then, such as a list of fake users, put it in `noData.ts` with a comment above it: `// Not the real schema: a basic shape to finish the task.`

```ts title="lib/constants/noData.ts"
const DUMMY_HEADING = "A heading for local development";
const DUMMY_SLUG = "/insights";

export const NO_DATA_INSIGHT = {
	heading: DUMMY_HEADING,
	slug: DUMMY_SLUG,
};

export const NO_DATA_INSIGHTS = [NO_DATA_INSIGHT];
```

```ts
const insights =
	query?.insights ??
	(IS_LOCAL_DEVELOPMENT ? NO_DATA_INSIGHTS : []);
```

`IS_LOCAL_DEVELOPMENT` is a constant in `lib/constants/`: `export const IS_LOCAL_DEVELOPMENT = process.env.NODE_ENV === "development";`.

- **Local development only.** noData is never shown in production. Where the real data is missing in production, show the page's empty state.
- **Name each export `NO_DATA_` plus the exact thing it stands in for**: singular for one item, plural for a list. `NO_DATA_INSIGHT` and `NO_DATA_INSIGHTS`, `NO_DATA_EVENT`, `NO_DATA_TOPICS`.
- **Shape it exactly like the real response**, so the code using it cannot tell the difference.
- **Dummy values sit at the top of `noData.ts`** as their own constants, `DUMMY_HEADING` and the rest. They are never added to `s`.
- **noData is for the whole site.** All of it lives in this one file.

### Numbers: named, in one file {#numbers-named-and-kept-by-topic}

**A number other than `-1`, `0` or `1` gets a name**, such as `MAXIMUM_RETRY_ATTEMPTS`. Those three mean "nothing", "one more" and "not found", so they read clearly as they are. Any other number was chosen by someone, and its name says what it controls. ESLint checks this with `no-magic-numbers`.

**Every loose named number lives in `lib/constants/numbers.ts`**, even one that only one file uses, so every project finds its numbers in the same place. There is no `n` object: each number is its own `SCREAMING_SNAKE_CASE` export.

```ts title="lib/constants/numbers.ts"
export const COOKIE_DURATION_DAYS = 30;
export const MAXIMUM_RETRY_ATTEMPTS = 3;
export const SESSION_TIMEOUT_MILLISECONDS = 900_000;
```

- **One file, never split by topic.** `numbers.ts` can run past 300 lines, like `r` and `s`.
- **Loose numbers only.** A number that only means something beside other values stays inside its object in `animation.ts` or `artwork.ts`. It is never lifted out into `numbers.ts`.
- **Config files and scripts outside the app**, such as `eslint.config.mjs`, keep their numbers at the top of the file: they are not part of the app and do not import from it.
- **Put the unit in the name**: `_MILLISECONDS`, `_DAYS`, `_PIXELS`.

### Animation: how things move

**`animation.ts` holds every object that says how and when something moves.**

```ts title="lib/constants/animation.ts"
export const ENTRANCE_ANIMATION = {
	delaySeconds: 0.1,
	durationSeconds: 0.4,
	offsetPixels: 24,
};
```

- **Each object stays whole.** Values that only mean something together stay in one object, named by their keys. Never lift its numbers out into `numbers.ts`.
- **Values the animation library reads are not text on screen**, so they stay in the object, never in `s`.
- **Put the unit in the key**: `durationSeconds`, `offsetPixels`.

### Artwork: what is drawn and where

**`artwork.ts` holds every object that says what is drawn, where it ends up, and how it is grouped.** Where something ends up is artwork; how and when it gets there is animation.

```ts title="lib/constants/artwork.ts"
export const ILLUSTRATION_LAYOUT = {
	heightPixels: 600,
	widthPixels: 800,
};
```

- **Each object stays whole**, the same as in `animation.ts`.
- **Drawing data the code reads goes here.** A static drawing that nothing reads goes in an `.svg` file in `public/` or in an icon component.

### Class names shared between files

**`classNames.ts` holds Tailwind class names that more than one file uses**: a single class string, or a set of them keyed by variant.

```ts title="lib/constants/classNames.ts"
export const SURFACE_CLASS_NAME =
	"rounded-2xl border border-border bg-card";
```

- **Make a component first.** A class string repeated across files usually means a component is missing, and the component is what makes the styling reusable. Use `classNames.ts` only when a component cannot hold the classes and they still repeat, such as when they go on different elements.
- **A class name used in one file stays inline in that file.**
- **Name each export after what it styles, ending in `_CLASS_NAME`**, or `_CLASS_NAMES` for a set keyed by variant.

### Rules

- **Named exports only:** `export const r`, `export const s`. No default exports.
- **Files outside `lib/constants/` import from `@/lib/constants`**, all in one import line.
- **Files inside `lib/constants/` import each other directly**, `import { s } from "./strings";`, never through `index.ts`. See [Inside a folder, import files directly](/docs/Structure/import-organization#2-inside-a-folder-import-files-directly).
- **`r` and `s` are the only single-letter names allowed anywhere.** See [Human-Readable Names](/docs/Standards/human-readable-names#r-and-s).
- **Other constants**, such as numbers, are `SCREAMING_SNAKE_CASE`: see [Naming Conventions](/docs/Structure/naming-conventions#constants).
- **An id lives in the object that uses it.** A value that picks which item something acts on, such as which item an animation moves to, is a key inside that object, never a loose constant of its own.
- **CSS belongs in a stylesheet, never in a constant.** Styles written as a string in TypeScript move to `globals.css`. Styles for when JavaScript is off go there under `@media (scripting: none)`; a browser without that query misses the fallback, and the standard accepts that.
- **All seven files can run past 300 lines.** They are data only, so ESLint does not apply `max-lines` to them. Keep each one a single file: never split them to get under the limit.
- **`lib/constants/` never imports from `lib/types/`.** `lib/types/` reads some of its types from the constants (`typeof s`), so an import the other way makes a loop. When a constant needs a type, write the type beside the constant, or read it from the constant.

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

See [Documentation](/docs/Standards/documentation) for the full list of folders, the doc format, and how docs are displayed and kept up to date.

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

See [Naming Conventions](/docs/Structure/naming-conventions) for detailed file and folder naming rules.

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
