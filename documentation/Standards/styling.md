---
sidebar_position: 10
---

# CSS Styling

Standards for styling React components and applications.

---

## 🎨 Tailwind CSS

Use Tailwind CSS utility classes for all component styling. Tailwind is compatible with React Server Components and is the foundation [shadcn/ui](/Guides/component-library-workflow) is built on.

```tsx
// Button.tsx
export const Button = () => {
  return (
    <button className="rounded-md bg-brand-primary px-8 py-4 text-white transition-colors hover:bg-brand-primary-hover">
      Click me
    </button>
  );
};
```

---

## 📐 Layout: Flexbox First

**Build every layout with flexbox.** Reach for `flex` first, and split the layout into child components so each one styles only itself.

**Only use CSS grid when it is specifically asked for.**

### ✅ Flex parent, child components

The parent arranges its children with flex. Each child is its own component with its own styles:

```tsx title="pageHeader/PageHeader.tsx"
import { PageHeaderActions } from "./pageHeaderActions";
import { PageHeaderTitle } from "./pageHeaderTitle";

export const PageHeader = () => {
  return (
    <header className="flex items-center justify-between gap-4">
      <PageHeaderTitle />
      <PageHeaderActions />
    </header>
  );
};
```

```tsx title="pageHeader/pageHeaderActions/PageHeaderActions.tsx"
export const PageHeaderActions = () => {
  return (
    <div className="flex items-center gap-2">
      <button className="rounded-md bg-brand-primary px-4 py-2 text-white">Save</button>
      <button className="rounded-md px-4 py-2 text-text">Cancel</button>
    </div>
  );
};
```

### ❌ One component styling everything

```tsx
// ❌ Bad — grid without being asked, and every piece styled in one place
export const PageHeader = () => {
  return (
    <header className="grid grid-cols-[1fr_auto] items-center gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text">Invoices</h1>
        <p className="text-sm text-text">All invoices for this account</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-md bg-brand-primary px-4 py-2 text-white">Save</button>
        <button className="rounded-md px-4 py-2 text-text">Cancel</button>
      </div>
    </header>
  );
};
```

### Rules

- **Flex first.** `flex`, `flex-col`, `gap-*`, `items-*` and `justify-*` cover almost every layout.
- **The parent positions, the child styles itself.** A parent sets direction, spacing and alignment. Each child component owns its own padding, colour and typography.
- **Split into child components** rather than growing one long `className` or a deep tree of `div`s. Each child gets [its own folder](/Structure/component-organization#nested-components).
- **Space with `gap`**, not margins on the children.
- **Grid only when asked.** Do not choose CSS grid on your own — use it only when the task specifically asks for a grid.

---

## ❌ Avoid These

- ❌ **CSS grid**, unless it was specifically asked for

- ❌ **Hard-coded colours** — hex, `rgb()` or named colours anywhere outside the theme
- ❌ **Arbitrary colour values** (`bg-[#3b82f6]`) — if the colour is not in the palette, it is not used
- ❌ **Inline styles** (except for dynamic values)
- ❌ **Styled-components or emotion** (not compatible with RSC)
- ❌ **Global CSS files for component styles**

---

## ✅ Colours Always Come From Global Variables

**Strictly follow the global colour palette.** Every colour is defined **once**, as a global colour variable in the theme. Components never contain a colour value — they reference a variable.

The palette is two things, and nothing else:

- **Tailwind's built-in colours** (`bg-white`, `text-slate-900`, `border-blue-500`) — allowed
- **Project colours** added to the `@theme` block (`bg-brand-primary`)

A colour that is in neither is not used. If a design calls for a new colour, add it to the global palette first — never write a one-off value in a component.

### ✅ Define the colours

Each project defines its colours once, in its global stylesheet:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand-primary: #3b82f6;
  --color-brand-primary-hover: #2563eb;
  --color-brand-secondary: #64748b;
  --color-surface: #fff;
  --color-text: #0f172a;
}

[data-theme="dark"] {
  --color-brand-primary: #60a5fa;
  --color-brand-primary-hover: #93c5fd;
  --color-surface: #0f172a;
  --color-text: #f8fafc;
}
```

Tailwind turns every `--color-*` variable in `@theme` into utility classes: `--color-brand-primary` becomes `bg-brand-primary`, `text-brand-primary`, `border-brand-primary` and so on.

The project's design decisions — what each colour is for, the fonts, the spacing — are recorded in its `documentation/design/design-system.md` [Decision Doc](/Standards/documentation).

### ✅ Use the colours

```tsx
// ✅ Good — colours come from the theme
<p className="bg-surface text-text">Hello</p>
<button className="bg-brand-primary text-white">Save</button>

// ❌ Bad — colours hard-coded in the component
<p className="bg-[#fff] text-[#0f172a]">Hello</p>
<button style={{ background: "#3b82f6", color: "white" }}>Save</button>
```

When you do write CSS by hand, reference the variable — never the value:

```css
/* ✅ Good */
.chart {
  color: var(--color-white);
  background: var(--color-brand-primary);
}

/* ❌ Bad */
.chart {
  color: white;
  background: #3b82f6;
}
```

Tailwind's built-in colours are variables too — `white` is `var(--color-white)`.

---

## 💡 Best Practices

### Tailwind utilities

- **Use for**: All component styling
- **Layout**: Flexbox first; grid only when specifically asked
- **Colours**: Global palette only — Tailwind colours and project colours from `@theme` — never arbitrary values
- **Long class lists**: Extract a component, not a CSS class
- **Conditional classes**: Use `clsx`
- **Class order**: Sorted automatically by [Prettier](/Standards/prettier#tailwind-class-sorting) — do not sort by hand

### Global CSS

- **Use for**: The Tailwind import, the `@theme` block, theme overrides, global resets
- **Location**: `app/globals.css`
- **Avoid**: Component-specific styles
- **Import only**: In the root layout

### CSS Modules

- **Use for**: The rare style Tailwind cannot express (complex keyframe animations, third-party overrides)
- **File naming**: `componentName.module.css`
- **Colours**: `var(--color-*)` only — Stylelint rejects hex and named colours in CSS Modules
- **Import**: Co-located with component

### Inline Styles

- **Use for**: Dynamic values only (e.g., `style={{ height: sliderValue }}`)
- **Avoid**: Static styles that should be Tailwind utilities

---

## 📁 File Organization

### Component Styles

Styles live in the component's `className` — there is no separate style file:

```text
components/
└── button/
    ├── Button.tsx
    ├── Button.test.tsx
    └── index.ts
```

### Global Styles

```text
app/
├── globals.css              # Tailwind import, @theme colour variables, resets
├── layout.tsx
└── page.tsx
```

---

## 🎯 Naming Conventions

### CSS Variables

**Use kebab-case for variable names.** This is the CSS convention, it is what Tailwind's theme namespaces (`--color-*`, `--spacing-*`, `--font-*`) require, and Stylelint enforces it.

```css
/* ✅ Good */
--color-brand-primary: #3b82f6;
--spacing-unit: 0.25rem;
--radius-card: 0.5rem;

/* ❌ Bad */
--colorBrandPrimary: #3b82f6;
--spacing_unit: 0.25rem;
--RadiusCard: 0.5rem;
```

Name colours by **role**, not by value: `--color-brand-primary`, not `--color-blue`.

### CSS Modules

**Use camelCase for class names**, because they are read in JavaScript as `styles.primaryButton`:

```css
/* ✅ Good */
.button {
}
.primaryButton {
}
.submitButton {
}

/* ❌ Bad */
.primary-button {
}
.submit_button {
}
```

---

## 📚 Related Documentation

- [Stylelint](/Standards/stylelint) - Linting for hand-written CSS
- [Component Organization](/Structure/component-organization) - How to organize component files
- [Folder Structure](/Structure/folder-structure) - Overall project structure
- [Naming Conventions](/Structure/naming-conventions) - File and folder naming rules
