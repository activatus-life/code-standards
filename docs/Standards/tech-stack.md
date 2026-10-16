---
sidebar_position: 11
---

# Tech Stack

Standard technology choices for Activatus projects.

---

## 📋 Standard Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 7
- **Package Manager**: pnpm (monorepo: workspaces)
- **Styling**: Tailwind CSS
- **Node Version**: `^22.11 || ^24 || >=26`
- **Build Tool**: Turbopack (Next.js built-in)

### TypeScript 7

TypeScript 7 is the compiler rewritten in Go. It is a drop-in replacement for
the JavaScript implementation for compiling and type-checking, but two things
change for tooling:

- **There is no `tsserver`.** The compiler is its own language server, started
  with `tsc --lsp --stdio`. Editors and tools that drove TypeScript through
  `typescript-language-server` have nothing to drive; they talk to `tsc`
  directly instead.
- **It answers diagnostics on request.** TypeScript 7 supports LSP pull
  diagnostics, so a client that only waits for a `publishDiagnostics` push can
  sit there believing a file is clean.

### Parameterise a library's generics

A generic whose default is a permissive index signature returns `any` at every use, and
the code reads as though it were typed. Storyblok's story type is the one to watch:

```ts
// storyblok-js-client
interface ISbStoryData<
  Content = ISbComponentType<string> & { [index: string]: any },
> {
  content: Content;
  // …
}
```

Left bare, `ISbStoryData` makes `story.content` that `any`-indexed fallback. Every field
access resolves, nothing is checked, and a renamed block field fails in the browser
rather than in CI. Declare the block and pass it:

```ts
export interface HeroBlokType extends ISbComponentType<"hero"> {
  headline: string;
  subhead?: string;
  callToAction?: CallToActionBlokType[];
}

// story.content.headline is string; story.content.headlien is a compile error.
const story: ISbStoryData<HeroBlokType> = await getStory();
```

The parameter flows, so the surrounding types carry it too — `ISbResult`'s
`data.stories` becomes `ISbStoryData<HeroBlokType>[]`. Where a story can hold one of several
blocks, make `Content` a discriminated union on `component` and switch on it.

Extend the published type rather than restating its fields: `ISbComponentType<"hero">`
already contributes `_uid`, `component` and `_editable`, and a hand-written copy drifts
the moment the library changes.

Read every library generic this way. An unparameterised one with a permissive default is
usually a silent `any`, not a sensible fallback. The [`/typescript` skill](/Standards/agent-skills)
applies this as a rule.

---

## 🧪 Testing Stack

- **Unit Testing**: Vitest
- **Component Testing**: @testing-library/react
- **E2E Testing**: Playwright
- **Coverage**: @vitest/coverage-v8

---

## 🗄️ Database & Backend

- **Database**: Supabase (PostgreSQL)
- **ORM**: Supabase client (direct)
- **Validation**: Zod schemas

---

## ⚛️ State Management

- **Server State**: @tanstack/react-query
- **Global State**: Zustand
- **Form State**: @tanstack/react-form

---

## 📦 Package Versions

See `package.json` for specific version requirements. Key dependencies:

```json
{
  "dependencies": {
    "next": "^16.3.5",
    "react": "^19.3.0",
    "@tanstack/react-query": "^5.85.5",
    "zustand": "^5.0.7"
  },
  "devDependencies": {
    "typescript": "^7.0.2",
    "vitest": "^2.1.8",
    "@testing-library/react": "^16.1.0",
    "playwright": "^1.63.0"
  }
}
```

---

## 🎨 UI Libraries

- **Design System**: Custom (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Tables**: TanStack Table

---

## 🔧 Development Tools

- **Linting**: ESLint 9+
- **Formatting**: Prettier
- **Git Hooks**: Husky
- **Monorepo**: Turborepo
- **Documentation**: Docusaurus

---

## Version Requirements

### Node.js

- **Consumer minimum**: 20.0.0, matching the packages' `engines` requirement
- **Repository version**: 24, pinned in `.nvmrc`
- **Package manager minimum for consumers**: pnpm 9, matching the root `engines` requirement
- **Repository package manager**: pnpm 11.23.0, pinned in `package.json#packageManager`

### TypeScript

- **Version**: 5.0+
- **Strict Mode**: Enabled
- **Target**: ES2022+
