---
sidebar_position: -1
sidebar_label: "Human-Readable Names"
---

# Human-Readable Names

**Every name we write is made of whole words a person can read out loud.** Variables, function parameters, props, types, constants, form fields, files, folders, routes, database columns, scripts and environment variables — everything. No shortened words, no single letters, no numbered names — not even for a loop counter or an event handler.

Anyone reading the code should never have to guess what a name stands for.

This applies to everyone writing code, **including AI agents**. An agent copies the examples it sees, so every example in these standards follows this rule too.

## Never / Always

| Never | Always |
| --- | --- |
| `btn`, `msg`, `val` | `button`, `message`, `value` |
| `(e) =>`, `(item, i) =>` | `(event) =>`, `(item, index) =>` |
| `acc` in a `reduce` | `runningTotal` — what it actually holds |
| `args`, `params` (our own) | `commandArguments`, `searchFilters` |
| `props`, `ButtonProps` | `properties`, `ButtonProperties` |
| `inputRef` | `inputReference` |
| `cwd` (our own variable) | `workingDirectory` |
| `deps`, `repo`, `env` | `dependencies`, `repository`, `environment` |
| `timeoutMs` | `timeoutMilliseconds` |
| `MAX_RETRY_ATTEMPTS` | `MAXIMUM_RETRY_ATTEMPTS` |
| `size: "sm" \| "lg"` | `size: "small" \| "large"` |
| `<T>` | `<ItemType>` |
| `name="email1"` | `name="emailAddress"` |
| `apiUtils.ts`, `helpers.ts` | `formatCurrency.ts` — named after what it does |
| `lib/`, `docs/`, `utils/` | `library/`, `documentation/`, `utilities/` |
| `useAuth`, `authStore` | `useAuthentication`, `authenticationStore` |
| `STRIPE_SK` | `STRIPE_SECRET_KEY` |

## Where it applies

Everything that has a name:

| Thing | ✅ Human-readable | ❌ Not |
| --- | --- | --- |
| **Folders** | `accountSettings/`, `invoiceTable/` | `acctSet/`, `misc/`, `stuff/`, `new/` |
| **Files** | `formatCurrency.ts`, `InvoiceTable.tsx` | `fmtCur.ts`, `utils2.ts`, `helpers.ts`, `temp.ts` |
| **Components** | `InvoiceTable`, `SubmitButton` | `Tbl`, `Comp1`, `MyComponent`, `Wrapper2` |
| **Component properties** | `isDisabled`, `onUserSelect`, `invoiceTotal` | `dis`, `cb`, `val`, `data`, `props` |
| **Variables** | `userEmailAddress`, `activeUsers` | `addr`, `x`, `temp`, `data`, `res`, `obj` |
| **Functions** | `calculateOrderTotal`, `sendWelcomeEmail` | `calc`, `doIt`, `process`, `handle` |
| **Event handlers** | `handleSearchTextChange` | `onChg`, `handler`, `fn` |
| **Booleans** | `isLoading`, `hasPermission`, `canDelete` | `loading`, `flag`, `ok`, `chk` |
| **Constants** | `MAXIMUM_RETRY_ATTEMPTS`, `RETRY_DELAY_MILLISECONDS` | `MAX`, `N`, `DELAY` |
| **Types** | `UserType`, `InvoiceStatusType`, `ButtonProperties` | `U`, `Data`, `IProperties`, `Obj` |
| **Generic type parameters** | `<ItemType>`, `<ResponseType>` | `<T>`, `<K, V>` |
| **Union and enum values** | `"processing" \| "shipped" \| "cancelled"` | `"p" \| "s"`, `1 \| 2 \| 3` |
| **Form fields** | `name="emailAddress"`, `name="companyName"` | `name="email1"`, `name="fld3"`, `name="q"` |
| **CSS Module classes** | `.primaryButton`, `.invoiceRow` | `.pb`, `.btn2`, `.wrapper3` |
| **CSS variables** | `--color-brand-primary` | `--c1`, `--blue2` |
| **Database tables and columns** | `draft_ticket`, `created_at`, `invoice_total` | `dt`, `col1`, `amt`, `flag` |
| **API routes** | `/api/calendar-events` | `/api/ce`, `/api/data`, `/api/v2x` |
| **Environment variables** | `STRIPE_SECRET_KEY`, `DOCUMENTATION_URL` | `SK`, `KEY2`, `URL_1` |
| **Test names** | `it("adds a thousands separator")` | `it("works")`, `it("test 1")` |
| **Branches** | `feat/invoice-export` | `fix/stuff`, `toms-branch` |
| **Doc files** | `architecture/background-jobs.md` | `arch/bg.md`, `notes2.md` |
| **Error messages** | `"Enter an email address"` | `"Invalid input"`, `"Error 42"` |

The words come from the [Ontology](/ontology) wherever it has a term: a Draft Ticket is `draftTicket`, never `pendingTicket`. The casing comes from [Naming Conventions](/Structure/naming-conventions).

The words come from the [Ontology](/ontology) wherever it has a term: a Draft Ticket is `draftTicket`, never `pendingTicket`. The casing comes from [Naming Conventions](/Structure/naming-conventions).

---

## Form fields

Form fields are where names slip most, and where they matter most: a field's name travels through the whole system.

**One field, one name, everywhere it goes.** The same words name the input, the form's data, the API request, the type and the database column:

| Where | Name |
| --- | --- |
| Input `name` and `id` | `emailAddress` |
| Form data and validation schema | `emailAddress` |
| API request body | `emailAddress` |
| Type property | `emailAddress: string` |
| Database column | `email_address` |

```tsx
// ✅ Good
<label htmlFor="emailAddress">Email address</label>
<input id="emailAddress" name="emailAddress" type="email" />

<label htmlFor="billingFrequency">Billing frequency</label>
<select id="billingFrequency" name="billingFrequency">
  <option value="monthly">Monthly</option>
  <option value="yearly">Yearly</option>
</select>
```

```tsx
// ❌ Bad
<input id="f3" name="email1" placeholder="Email" />

<select name="freq">
  <option value="1">Monthly</option>
  <option value="2">Yearly</option>
</select>
```

- **`name` and `id` are full words**, and match each other.
- **Every field has a visible `<label>`** in plain English. A placeholder is never the label.
- **Option values are words**, not numbers: `value="monthly"`, not `value="1"`.
- **Buttons with only an icon get an `aria-label`** that says what they do: `aria-label="Delete invoice"`.
- **Validation messages name the field and say what to do**: "Enter an email address", not "Required".

---

## `id` is a word

**`id` is its own word. Never write it out as `identifier`.**

| Where | Write |
| --- | --- |
| A property or variable | `id`, `userId`, `draftTicketId` |
| A list of them | `userIds` |
| A constant | `DEFAULT_PROJECT_ID` |
| A database column | `user_id` |

- **Case it as a word**: `userId`, never `userID`.
- **`identifier` means something else.** Use it only when an outside system has a separate field with that name. Linear has both: `id` is its hidden unique code, and `identifier` is the readable `ACT-73`. Writing `identifier` for an `id` would mix the two up.

## Short names that are the real name

Some things are only ever called by their short name. Those stay short:

`id` · `url` · `api` · `uat` · `pdf` · `html` · `css` · `json` · `readme`

**Case them as words** in camelCase and PascalCase: `imageUrl`, `apiResponse`, `htmlContent` — never `imageURL` or `APIResponse`.

This is not a back door. If people say the long form out loud — "environment", "repository", "properties" — write the long form.

---

## Names you cannot rename

**Names owned by someone else stay exactly as they are.** Renaming them breaks the code. Use them as they are where they touch the outside, then **give the value a full-word name as soon as it comes into our code**.

| Owned by | Examples |
| --- | --- |
| An outside service's data | Linear's `id`, `identifier` and `pageInfo` |
| Node and library options | `cwd` in `execFile`, `process.env`, `stdout`, `argv` |
| React | `ref`, `children`, `useRef`, `useEffect` |
| Next.js | the `app/` folder, `params`, `searchParams`, `LayoutProps`, `generateMetadata` |
| HTML and CSS | `href`, `src`, `alt`, `tabIndex`, Tailwind classes like `text-sm` |
| Tools | `node_modules`, `.env.local`, Docusaurus's `src/pages`, Storybook's `args`, the `dev` and `prepare` scripts |
| The [Ontology](/ontology) | Decided terms such as `dev_agent` and `dev_testing` |

```ts
// ✅ Good — the option keeps its owned name; our value gets a full-word name
const workingDirectory = process.cwd();
const commandArguments = ["lint", "--fix"];

execFile("pnpm", commandArguments, { cwd: workingDirectory });
```

```ts
// ❌ Bad — renaming the owned option breaks the call: execFile ignores "workingDirectory"
execFile("pnpm", commandArguments, { workingDirectory });

// ❌ Bad — the owned name leaks into our own code
const cwd = process.cwd();
```

---

## Examples in code

```ts
// ✅ Good
const userEmailAddress = user.email;
const isSubmitButtonDisabled = !isFormValid;

const calculateOrderTotal = (orderItems: OrderItemType[]) => {
  return orderItems.reduce((runningTotal, orderItem) => runningTotal + orderItem.price, 0);
};

users.map((user) => user.name);
```

```ts
// ❌ Bad
const addr = user.email;
const btnDis = !valid;

const calc = (arr: OrderItemType[]) => {
  return arr.reduce((acc, i) => acc + i.price, 0);
};

users.map((u) => u.name);
```

---

## How it is checked

| Names | Checked by |
| --- | --- |
| Variables, functions, parameters and file names | ESLint `unicorn/name-replacements` and `unicorn/filename-case` |
| Type names | ESLint `@typescript-eslint/naming-convention` |
| CSS variables and CSS Module classes | Stylelint |
| **Everything else** — folders, props, form fields, union values, database columns, routes, environment variables, test names | **Code review and AI agents.** The linter cannot read these, so every agent and reviewer checks them |

ESLint allows exactly three owned names as they are — `ref`, `params` and `searchParams` — and flags any of our own names built from them, such as `inputRef`.
