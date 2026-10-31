---
sidebar_position: 5
---

# Naming Conventions

Consistent naming conventions make codebases easier to navigate, understand, and maintain.

**Every name must be human-readable** — folders, files, props, form fields, types, database columns, everything. See [Human-Readable Names](/docs/Standards/human-readable-names).

This page covers **how** a name is written. **Which words** to use comes from the [Ontology](/docs/ontology): a Decision Doc is `decisionDoc` in code and `decision_doc` in the database, never `docDecision` or `decisionFile`.

## File Naming

### Components

**Use PascalCase** for React/Vue component files:

```tsx
✅ Good
UserProfile.tsx
DataTable.tsx
SidebarNavigation.tsx
SubmitButton.tsx

❌ Bad
userProfile.tsx
data_table.tsx
sidebar-nav.tsx
```

**Use PascalCase** for component declarations:

```tsx
✅ Good
const UserProfile = () => { };
const DataTable = () => { };
const SubmitButton = () => { };

❌ Bad
const userProfile = () => { };
const dataTable = () => { }
const submit_button = () => { };
```

### Utils

**Use camelCase** for utils files:

```ts
✅ Good
apiUtils.ts
formatDate.ts
formatCurrency.ts

❌ Bad
api-utils.ts
format-date.ts
string-manipulation.ts
format_currency.ts
```

### Hooks

**Use camelCase** with `use` prefix:

```ts
✅ Good
useUserData.ts
useDebounce.ts
useFormValidation.ts
useLocalStorage.ts

❌ Bad
userData.ts
getDebounce.ts
formValidation.ts
use-local-storage.ts
```

### Stores

**Use camelCase** with `Store` suffix:

```ts
✅ Good
userStore.ts
cartStore.ts
authenticationStore.ts
preferencesStore.ts

❌ Bad
user.ts
cart.ts
useAuthStore.ts
auth-store.ts
```

### Services

**Use camelCase** with `Service` suffix:

```ts
✅ Good
userService.ts
apiService.ts
paymentService.ts
notificationService.ts

❌ Bad
UserService.ts
api.ts
payment.ts
service-user.ts
```

### Types

**Use camelCase** descriptive names:

```ts
✅ Good
userWithPermissions.ts
apiResponseData.ts
cartItemWithProduct.ts
recordingUsageData.ts

❌ Bad
UserWithPermissions.ts
userTypes.ts
apiResponse.ts
data.ts
```

### Constants

**Use camelCase** for constant file names, **SCREAMING_SNAKE_CASE** for the constants themselves:

```ts
✅ Good
// File names
userRole.ts
httpStatus.ts
paymentStatus.ts

// Constant Variable Names
const MAXIMUM_RETRY_ATTEMPTS = 3;
const API_TIMEOUT_MILLISECONDS = 5000;
const COOKIE_DURATION_DAYS = 30;

❌ Bad Constant Variable Names
const maxRetryAttempts = 3;
const apiTimeout = 5000;
const cookieDays = 30;
```

**`r` and `s` are the exception:** the routes and strings objects are lowercase single letters, with camelCase keys, `r.myStory` and `s.pageNotFound`. Stand-in data follows the normal rule: `NO_DATA_INSIGHTS`. See [Constants](/docs/Structure/folder-structure#constants).

### CSS Modules

**Use camelCase** with `.module.css` suffix:

```tsx
✅ Good
userProfile.module.css
dataTableStyles.module.css
formComponents.module.css

❌ Bad
UserProfile.module.css
data-table-styles.css
form-components.module.css
```

### CSS Variables

**Use kebab-case** for CSS variables (custom properties and design tokens): it is the CSS convention, it is what Tailwind requires, and Stylelint enforces it.

```css
/* ✅ Good */
--color-brand-primary: #3b82f6;
--spacing-unit: 0.25rem;

/* ❌ Bad */
--colorBrandPrimary: #3b82f6;
--spacing_unit: 0.25rem;
```

See [CSS Styling](/docs/Standards/styling#css-variables).

### Documentation

**Use kebab-case** for documentation files. The [docs site](/docs/Standards/documentation) turns each file name into the page's URL, so a doc file is named the way a URL is written:

```tsx
✅ Good
background-jobs.md        → /docs/architecture/background-jobs
design-system.md
product-market-fit.md

❌ Bad
backgroundJobs.md         → /docs/architecture/backgroundJobs
design_system.md
ProductMarketFit.md
```

---

## Variables & Functions

### Variables

**Use camelCase**, and [full English words](/docs/Standards/readable-code#names-are-full-english-words) — no shorthand:

```ts
✅ Good
const userName = "John";
const isLoading = true;
const hasPermission = false;
const itemCount = 10;

❌ Bad
const UserName = "John";
const IsLoading = true;
const has_permission = false;
const item_count = 10;
```

### Functions

Every function is an [arrow function](/docs/Standards/readable-code#arrow-functions-everywhere).

**Use camelCase** with descriptive verbs:

```ts
✅ Good
const getUserData = () => { };
const validateEmail = () => { };
const calculateTotal = () => { };
const handleSubmit = () => { };

❌ Bad
const GetUserData = () => { };
const validate_email = () => { };
const total = () => { };
const submit = () => { };
```

### Boolean Variables

**Prefix with `is`, `has`, `should`, `can`:**

```ts
✅ Good
const isActive = true;
const hasPermission = true;
const shouldUpdate = false;
const canDelete = true;

❌ Bad
const active = true;
const permission = true;
const update = false;
const delete = true;
```

### Types & Interfaces

**Use PascalCase** for types/interfaces, ending in **`Props`** or **`Type`** so it is clear what the name is:

- **`Props`** — the single object parameter of a component or function (`ButtonProps`, `CreateUserProps`)
- **`Type`** — everything else (`UserType`, `OrderStatusType`)

```ts
✅ Good
type UserType = { };
interface ApiResponseType { }
interface UserCardProps { }

❌ Bad
type User = { };
type userType = { };
interface api_response { }
interface UserCardData { }
```

See [Readable Code](/docs/Standards/readable-code#type-names-say-what-they-are).

---

## When to Use kebab-case

Code files are camelCase or PascalCase. A short list of things are kebab-case instead:

| Thing                   | Example                                | Why                                      |
| ----------------------- | -------------------------------------- | ---------------------------------------- |
| **Route folders**       | `app/account-settings/`                | The folder name becomes the URL          |
| **Documentation files** | `docs/architecture/background-jobs.md` | The file name becomes the URL            |
| **CSS variables**       | `--color-brand-primary`                | The CSS convention; required by Tailwind |

**The rule of thumb: if the name becomes a URL, it is kebab-case.**

---

## Quick Reference

| Type                    | Convention                       | Example                      |
| ----------------------- | -------------------------------- | ---------------------------- |
| **Component files**     | PascalCase                       | `UserProfile.tsx`            |
| **Utils files**         | camelCase                        | `formatDate.ts`              |
| **Hook files**          | camelCase + `use`                | `useUserData.ts`             |
| **Store files**         | camelCase + `Store`              | `userStore.ts`               |
| **Service files**       | camelCase + `Service`            | `apiService.ts`              |
| **Type files**          | camelCase                        | `userWithRoles.ts`           |
| **Constant files**      | camelCase / SCREAMING_SNAKE_CASE | `userRole.ts` / `API_URL.ts` |
| **CSS modules**         | camelCase + `.module.css`        | `userProfile.module.css`     |
| **CSS variables**       | kebab-case                       | `--color-brand-primary`      |
| **Documentation files** | kebab-case                       | `background-jobs.md`         |
| **Variables**           | camelCase                        | `userName`                   |
| **Functions**           | camelCase                        | `getUserData`                |
| **Components**          | PascalCase                       | `UserProfile`                |
| **Types**               | PascalCase + `Props` or `Type`   | `ButtonProps`, `UserType`    |
| **Constants**           | SCREAMING_SNAKE_CASE             | `API_BASE_URL`               |
| **Booleans**            | camelCase + prefix               | `isActive`, `hasPermission`  |

---

## Enforcing Conventions

Use ESLint and Prettier to enforce these conventions automatically:

- **eslint-plugin-react** - React naming conventions
- **@ianvs/prettier-plugin-sort-imports** - Import ordering, run by Prettier
- **@typescript-eslint** - TypeScript naming rules

See [ESLint](/docs/Standards/eslint) and [Prettier](/docs/Standards/prettier) configuration for setup.
