---
sidebar_position: 1
sidebar_label: "Workflow"
---

# Component & Design-to-Code Workflow

How components get from design into a project: where they come from, what we are allowed to change, and how AI automation fits without producing drift.

:::tip[The one-line summary]

**Every project builds on the same shadcn components. How a component works stays identical everywhere — only how it looks changes from project to project.**

:::

## How it fits together

| Layer | What it is | Owned by |
| --- | --- | --- |
| **Claude Design** | Where designs are produced, using shadcn components and the project's colour palette. | Design |
| **shadcn/ui** | The source of every base component. Added to a project with the shadcn CLI. | — |
| **`components/ui/`** | The project's own copy of those components, converted to our standards and styled for the project. | Dev |
| **CMS components** | Wrappers that connect `components/ui/` to a CMS such as Storyblok. | Dev |
| **CMS project space** | Supplies content and data to the project. | Dev + Content |

## Each project has its own components

**There is no shared component library.** Each project adds the shadcn components it needs straight into its own `components/ui/` folder.

Our projects are different products, so a shared library is not worth its upkeep yet. We will build one later — see [Future-proofing](#future-proofing). What keeps the projects consistent until then is one rule.

## Same component, different paint

**The way a component works is identical in every project. Only the way it looks changes.**

| | Rule | Examples |
| --- | --- | --- |
| **How it works** | ❌ Do not change | Properties and their names, variants, behaviour, keyboard handling, accessibility |
| **How it looks** | ✅ Change freely | Colours, spacing, corner radius, typography, shadows |

A `Button` in one Activatus project takes the same props and behaves the same way as a `Button` in any other. A developer or an AI agent who knows one project's components knows them all.

- **Keep shadcn's props exactly as they ship.** Do not rename, remove or repurpose a prop.
- **Style through the [global colour palette](/Standards/styling#-colours-always-come-from-global-variables)** and Tailwind classes. Per-project branding is a palette change, not a component rewrite.
- **Need different behaviour?** Build a new component that wraps the base one. Do not change the base component.

Keeping the components identical is also what makes a shared library possible later — see [Future-proofing](#future-proofing).

## Adding a shadcn component

**shadcn is where a component starts. What lives in `components/ui/` is ours.**

The shadcn CLI copies source code into the project. From that moment it is **our code, not third-party code**: we own it, and it follows every standard. It never goes in `vendor/`.

The CLI writes files in shadcn's format, which breaks our standards — kebab-case file names, many components in one file, no folder, no types file and no tests. **Convert them in the same change that adds them.** Never leave raw CLI output in the project.

### Before and after

```text
❌ What the shadcn CLI writes
components/ui/
├── button.tsx
└── dropdown-menu.tsx              # 15 components in one file

✅ What we keep
components/ui/
├── button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── types.ts
│   └── index.ts
└── dropdownMenu/
    ├── DropdownMenu.tsx
    ├── DropdownMenu.test.tsx
    ├── types.ts
    ├── index.ts
    ├── dropdownMenuTrigger/
    ├── dropdownMenuContent/
    └── dropdownMenuItem/
```

### Converting a component

1. **Add it** with the shadcn CLI.
2. **Keep only the parts the project uses.** A shadcn file often exports many components. Delete the ones that are not used — if one is needed later, add it again and convert it the same way.
3. **Give each component its own folder and file**: a camelCase folder with a PascalCase file (`button/Button.tsx`). One component per file — sub-components get [their own folders](/Structure/component-organization#nested-components) inside the parent.
4. **Add the standard files** to each folder: `types.ts`, `index.ts` and a test file. See [Component Organization](/Structure/component-organization).
5. **Apply the code standards**: named exports, type names ending in `Properties` or `Type`, full English names for our own variables.
6. **Leave the props and behaviour alone.** Converting changes the file layout and the styling, never [how the component works](#same-component-different-paint).
7. **Use the global colour palette.** Replace shadcn's colour classes with colours from [the palette](/Standards/styling#-colours-always-come-from-global-variables).
8. **Move shared helpers to `utilities/`.** shadcn's `cn` helper lives in the [global `utilities/` folder](/Structure/folder-structure#-utilities), not in `lib/utilities.ts`.
9. **Run `pnpm lint` and `pnpm test`.** The converted component must pass both.

### What is still third-party

The packages a shadcn component imports — Radix UI and the like — stay in `node_modules/` and are [exempt from the standards](/Standards/eslint#third-party-code-is-exempt). Only the component source that the CLI copies into the project becomes ours.

## The design → code loop

1. **Design in Claude Design** using shadcn components and the project's palette.
2. **A new component is needed** → [look before you build](#1-look-before-you-build), then add it from shadcn and [convert it](#converting-a-component).
3. **A new look is needed** → change the palette or the component's classes. The props stay as they are.
4. **Something shadcn does not provide** → build it in `components/ui/` from existing components, following [Component Organization](/Structure/component-organization).

:::caution[Design and code are decoupled]

A design change does **not** automatically change the code. Component changes are made deliberately, in a reviewed change.

:::

## AI automation: governed, not soup

Soup comes from letting AI generate components freely for every screen. We prevent it by making `components/ui/` a **hard constraint** and pointing automation at composition.

- **Base components** come from shadcn and are converted once. AI does not invent a new button, input or dialog.
- **Page composition** is where AI does the heavy lifting: assembling pages from the components already in `components/ui/`.

**Guardrails:** typed props, lint rules (no hard-coded colours, no inline styles) and tests. **Gap-loop:** when a component is missing, AI *flags it* and adds it from shadcn, instead of inventing one.

## Maintenance

- **Foundation upgrades** (Tailwind, Radix, React) are done per project, and proven with the project's tests.
- **Updating a shadcn component** means adding it again from shadcn and converting it again. Because the props were never changed, the update drops in.

## Future-proofing

**We know we are building the same components more than once.** Each project has its own copy today. One day those copies will be pulled out into a single shared repository that every project installs.

That refactor is **planned, but not now**. Until then, two things stop each project from reinventing the same component differently, and keep the eventual refactor cheap.

### 1. Look before you build

Before building any component, check these in order and stop at the first match:

| # | Look in | If it is there |
| --- | --- | --- |
| 1 | The project's own `components/ui/` | Use it |
| 2 | The [Component Reference](/template-components) | Build it to the listed variants and props |
| 3 | Another Activatus project | Copy the component's whole folder — code, types and tests — then restyle it |
| 4 | shadcn | Add it and [convert it](#converting-a-component) |
| 5 | Nowhere | Build it, and **add it to the [Component Reference](/template-components)** so the next project builds it the same way |

**Copying a finished component from another Activatus project is encouraged.** Rebuilding one from memory is how two projects end up with two different buttons.

### 2. Build every component to be lifted out

A component in `components/ui/` must be able to move to another project — or to a shared library — by copying its folder and changing nothing but its styling.

| Rule | Why |
| --- | --- |
| **Everything comes in through props.** No fetching data, no reading global state | The component cannot depend on one project's data |
| **No imports from the project's features, services, stores or `app/` folder** | Those do not exist in the next project |
| **It may import only** other `components/ui/` components, the global `utilities/` folder and installed packages | These travel with it |
| **No project names, client names or business rules inside it** | A `Button` knows nothing about invoices |
| **Its types and tests live in its folder** | They move when the folder moves |
| **Its props match the [Component Reference](/template-components)** | Every project's copy is interchangeable |

Logic that belongs to one project goes in a **feature component** (`components/features/`) that wraps the base component and passes it props. The base component stays clean.

```tsx
// ✅ Good — the base component takes props; the feature component knows about invoices
// components/features/billing/invoiceTable/InvoiceTable.tsx
<DataTable rows={invoices} columns={INVOICE_COLUMNS} onRowSelect={handleInvoiceSelect} />

// ❌ Bad — a base component that fetches invoices cannot be reused anywhere else
// components/ui/dataTable/DataTable.tsx
const invoices = await getInvoices();
```

### When the shared library gets built

Not on a date — on a signal. It is time to build it when any of these becomes true:

- The same bug has to be fixed in the same component in more than one project.
- Keeping the projects' components in step is taking real time.
- A new project would copy most of its `components/ui/` from an existing one.

Because every project followed the two rules above, the refactor is then a matter of moving folders, not rewriting components.
