---
sidebar_position: 1
sidebar_label: "Workflow"
---

# Component Library & Design-to-Code Workflow

The operating model for the shared Activatus component library: how components flow from
design to code, how we version and roll them out across projects, and how AI automation
fits without producing drift.

:::tip[The one-line summary]

**shadcn is the owned foundation, the central versioned library is the single source of
truth, design happens in Claude Design, and governance not the library brand is what
delivers long-term success.**

:::

## Architecture: four layers

| Layer | What it is | Owned by |
| --- | --- | --- |
| **Claude Design** | Where designs are produced, using the shared UI library's components and tokens. | Design |
| **shadcn/ui** | Vanilla base components, copied into our shared UI library repo. No live upstream link. Components will be bought in like a shopping cart item | Dev |
| **Shared UI library** | Our themed base + composites that shadcn doesn't provide (e.g. Hero Card). The single source of truth. | Dev |
| **Storyblok UI Library** | Wrappers around shadcn + shared UI library components. Other CMS tools like Drupal can be set up in the same way. | Dev |
| **CMS Project Space** | Supply content/data to the project repo. | Dev + Content |

## Foundation (set up once)

- The shared UI library is a **single, versioned npm package**, governed by strict semver.
- **Storybook** is the documentation hub and the **visual-regression baseline**.
- **Design tokens** are **CSS custom properties** defined once in the library and used by
  both design and code. Per-client branding = **token overrides on top of the one shared library**.
- **Governance rules + CI guardrails** ensure devs and AI *compose from* the library rather
  than generate components freely.

:::info[Ownership boundary]

Design owns the **what** (visual spec, the component set, the design↔code parity requirement).
Dev owns the **how** (framework, versioning, registry, build, distribution). shadcn is the
shared foundation both sides agree to start from.

:::

## The recurring design → code loop

1. **Design in Claude Design** using the library's components (parity with code); brand via tokens.
2. **New component/variant needed** → it is added **granularly** (one component at a time).
3. **"Shopping trip"** → bring that component into the shared UI library, theme to tokens, add
   Storybook stories, and **check the dependency delta** (does it need a newer Radix / Tailwind?).
4. **Token changes** are made in the library. Component/prop changes are adopted
   **deliberately**, not automatically.
5. **Ship a versioned release** `minor` for additive changes, `major` (with a deprecation
   window + codemod) for breaking ones.
6. **Consumers update** via Renovate PRs: `patch`/`minor` auto-merge on green CI; `major` is
   opt-in per repo.

:::caution[Design and code are decoupled]

A design change does **not** automatically change your code. Component/prop changes are
pulled in deliberately via a shopping trip and shipped as a versioned release.

:::

## Versioning policy (semver)

| Change | Bump |
| --- | --- |
| Bug fix, internal refactor | **patch** `2.4.0 → 2.4.1` |
| New component / new optional prop / deprecate (don't remove) an old prop | **minor** `2.4.1 → 2.5.0` |
| Remove a deprecated prop, change a prop/default, or a shared-dep bump that hits consumers (e.g. Tailwind major) | **major** `2.x → 3.0.0` |

**Golden rule:** *Add freely in minors. Only ever remove or break in majors.*

### Deprecation window (how we change a prop without breaking anyone)

1. **Introduce (minor):** add the new prop, keep the old one working, mark it `@deprecated`
   with a dev-only `console.warn`.
2. **Migrate:** each consuming repo moves old → new at its own pace (use a `jscodeshift` codemod).
3. **Remove (major):** once all consumers are migrated, remove the old prop, publish a major
   with a migration guide.
4. **Adopt:** each repo bumps its pin `^2 → ^3` when ready. Lagging repos stay on `2.x`
   fully supported.

## AI automation governed, not soup

Soup comes from letting AI generate components freely per frame. We prevent it by making the
library a **hard constraint** and pointing automation at composition.

- **Tier 1 components:** built/curated in the central library and reviewed. AI may
  *accelerate* this, but its output flows **through the central library never directly
  into project repos.**
- **Tier 2 page composition:** AI assembles pages from existing library components +
  Storyblok blocks. **Push automation hard here.**

**Guardrails:** typed public API, lint rules (ban raw hex, inline styles, off-system imports),
and visual regression. **Gap-loop:** when something's missing, AI *flags it* for the library
instead of inventing it.

## Maintenance

- **Foundation upgrades** (Tailwind, Radix, React) are done **once, centrally**, proven with
  Storybook + visual regression, and shipped as a versioned release not 20 times across repos.
- **Tailwind majors** are always a shared UI library major and must include consumer-side
  migration steps, because Tailwind runs at each consumer's build.

## Known trade-offs

- **Tied to Tailwind** you inherit Tailwind's major-upgrade cadence. Real and permanent.
- **Ongoing maintenance** true of *any* component library or design system; it's the price of
  a single source of truth, not a flaw specific to this choice.
