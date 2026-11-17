---
sidebar_position: 1
---

# API Route Standards

Standards for organizing and naming Next.js App Router API routes.

---

## 🌐 Next.js App Router API Routes

API routes in Next.js 16 use the App Router with a file-based routing system.

---

## ✅ Folder Structure

**Use kebab-case for API route folders:**

```text
app/api/
├── calendar-events/
│   └── route.ts           # GET, POST, PUT, DELETE
├── webhooks/
│   ├── stripe/
│   │   └── route.ts
│   └── recall/
│       └── route.ts
└── oauth-callback/
    └── google-calendar/
        └── route.ts
```

### Organization Principles

- **Group by domain** - Related endpoints in the same folder
- **Use kebab-case** - All lowercase with hyphens
- **Nest when needed** - Sub-folders for logical grouping
- **Avoid redundancy** - Don't repeat "api" or "route" in folder names

---

## ✅ File Naming

**Always use `route.ts`:**

```typescript
// ✅ Correct
app / api / users / route.ts;

// ❌ Incorrect
app / api / users.ts;
app / api / Users / route.ts;
app / api / user - management / route.ts; // avoid redundant strings
```

---

## 🗂️ Route Patterns

### Simple Routes

```text
app/api/
├── users/
│   └── route.ts              # /api/users
├── posts/
│   └── route.ts              # /api/posts
└── comments/
    └── route.ts              # /api/comments
```

### Dynamic Routes

```text
app/api/
├── users/
│   └── [id]/
│       └── route.ts          # /api/users/123
└── posts/
    └── [slug]/
        └── route.ts          # /api/posts/my-post
```

### Nested Routes

```text
app/api/
├── webhooks/
│   ├── stripe/
│   │   └── route.ts          # /api/webhooks/stripe
│   └── github/
│       └── route.ts          # /api/webhooks/github
└── integrations/
    └── calendar/
        └── events/
            └── route.ts      # /api/integrations/calendar/events
```

---

## 🚪 Route handlers outside `app/api/`

**A `route.ts` anywhere in `app/` is a route handler**, not just under `app/api/`. Next.js gives every `route.ts` the URL its folder path describes, so a handler lives outside `app/api/` when its URL is not an API endpoint but a page-shaped stop on the way somewhere else. The main case is an **auth callback**: a URL the identity provider sends the browser back to, which reads the result and redirects on, like `app/sign-in/confirm/route.ts` serving `/sign-in/confirm`.

**The same rules apply outside `app/api/`**: kebab-case folders, the file is `route.ts`, and every other standard holds. A handler that returns JSON belongs under `app/api/`; a handler that redirects or rewrites belongs at the URL the outside world already expects, which is usually not under `app/api/`.

### Named exports

**Handlers are exported as named functions, never a default export.** Next.js wires the HTTP method by the export's name:

```typescript
// ✅ Correct — named export per HTTP method
export async function GET(request: Request) { … }
export async function POST(request: Request) { … }

// ❌ Incorrect — a default export does nothing
export default async function handler(request: Request) { … }
```

### Where a handler's helpers go

Functions written for one route handler follow the [utils ladder](/docs/Structure/folder-structure#-utils): a helper only this handler uses goes in that section's `utils/` folder, and a helper used across the app goes in the global `utils/`. Code that talks to an outside service goes in `lib/integrations/`, never in the handler file itself.

---

## 🔒 Security Best Practices

- **Validate input** - Use Zod schemas
- **Handle errors** - Try/catch with proper error responses
- **Rate limiting** - Implement rate limits for public endpoints
- **Authentication** - Check user permissions
- **CORS** - Configure properly for API routes
- **Environment variables** - Never log sensitive data

---

## 📚 Related Documentation

- [Folder Structure](/docs/Structure/folder-structure) - Overall project structure
- [Naming Conventions](/docs/Structure/naming-conventions) - File and folder naming
- [TypeScript](/docs/Standards/tech-stack) - Type safety standards
