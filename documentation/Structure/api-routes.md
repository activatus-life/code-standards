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

## 🔒 Security Best Practices

- **Validate input** - Use Zod schemas
- **Handle errors** - Try/catch with proper error responses
- **Rate limiting** - Implement rate limits for public endpoints
- **Authentication** - Check user permissions
- **CORS** - Configure properly for API routes
- **Environment variables** - Never log sensitive data

---

## 📚 Related Documentation

- [Folder Structure](/Structure/folder-structure) - Overall project structure
- [Naming Conventions](/Structure/naming-conventions) - File and folder naming
- [TypeScript](/Standards/tech-stack) - Type safety standards
