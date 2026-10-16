---
sidebar_position: -1
sidebar_label: "Human-Readable Names"
---

# Human-Readable Names

**Every name we write is made of whole words a person can read out loud.** Variables, function parameters, props, types, constants, form fields, files, folders, routes, database columns, scripts and environment variables — everything. No shortened words, no single letters, no numbered names — not even for a loop counter or an event handler.

Anyone reading the code should never have to guess what a name stands for.

This applies to everyone writing code, **including AI agents**. An agent copies the examples it sees, so every example in these standards follows this rule too.

## Never / Always

| Never                      | Always                                         |
| -------------------------- | ---------------------------------------------- |
| `btn`, `msg`, `val`        | `button`, `message`, `value`                   |
| `(e) =>`, `(item, i) =>`   | `(event) =>`, `(item, index) =>`               |
| `acc` in a `reduce`        | `runningTotal` — what it actually holds        |
| `args`, `params` (our own) | `commandArguments`, `searchFilters`            |
| `cwd` (our own variable)   | `workingDirectory`                             |
| `deps`, `env`              | `dependencies`, `environment`                  |
| `timeoutMs`                | `timeoutMilliseconds`                          |
| `MAX_RETRY_ATTEMPTS`       | `MAXIMUM_RETRY_ATTEMPTS`                       |
| `size: "sm" \| "lg"`       | `size: "small" \| "large"`                     |
| `<T>`                      | `<ItemType>`                                   |
| `name="email1"`            | `name="emailAddress"`                          |
| `helpers.ts`, `misc.ts`    | `formatCurrency.ts` — named after what it does |
| `helpers/`, `utilities/`   | `utils/`                                       |
| `useAuth`, `authStore`     | `useAuthentication`, `authenticationStore`     |
| `STRIPE_SK`                | `STRIPE_SECRET_KEY`                            |

## Where it applies

Everything that has a name:

| Thing                           | ✅ Human-readable                                    | ❌ Not                                            |
| ------------------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| **Folders**                     | `accountSettings/`, `invoiceTable/`                  | `acctSet/`, `misc/`, `stuff/`, `new/`             |
| **Files**                       | `formatCurrency.ts`, `InvoiceTable.tsx`              | `fmtCur.ts`, `utils2.ts`, `helpers.ts`, `temp.ts` |
| **Components**                  | `InvoiceTable`, `SubmitButton`                       | `Tbl`, `Comp1`, `MyComponent`, `Wrapper2`         |
| **Component props**             | `isDisabled`, `onUserSelect`, `invoiceTotal`         | `dis`, `cb`, `val`, `data`                        |
| **Variables**                   | `userEmailAddress`, `activeUsers`                    | `addr`, `x`, `temp`, `data`, `res`, `obj`         |
| **Functions**                   | `calculateOrderTotal`, `sendWelcomeEmail`            | `calc`, `doIt`, `process`, `handle`               |
| **Event handlers**              | `handleSearchTextChange`                             | `onChg`, `handler`, `fn`                          |
| **Booleans**                    | `isLoading`, `hasPermission`, `canDelete`            | `loading`, `flag`, `ok`, `chk`                    |
| **Constants**                   | `MAXIMUM_RETRY_ATTEMPTS`, `RETRY_DELAY_MILLISECONDS` | `MAX`, `N`, `DELAY`                               |
| **Types**                       | `UserType`, `InvoiceStatusType`, `ButtonProps`       | `U`, `Data`, `IProps`, `Obj`                      |
| **Generic type parameters**     | `<ItemType>`, `<ResponseType>`                       | `<T>`, `<K, V>`                                   |
| **Union and enum values**       | `"processing" \| "shipped" \| "cancelled"`           | `"p" \| "s"`, `1 \| 2 \| 3`                       |
| **Form fields**                 | `name="emailAddress"`, `name="companyName"`          | `name="email1"`, `name="fld3"`, `name="q"`        |
| **CSS Module classes**          | `.primaryButton`, `.invoiceRow`                      | `.pb`, `.btn2`, `.wrapper3`                       |
| **CSS variables**               | `--color-brand-primary`                              | `--c1`, `--blue2`                                 |
| **Database tables and columns** | `draft_ticket`, `created_at`, `invoice_total`        | `dt`, `col1`, `amt`, `flag`                       |
| **API routes**                  | `/api/calendar-events`                               | `/api/ce`, `/api/data`, `/api/v2x`                |
| **Environment variables**       | `STRIPE_SECRET_KEY`, `DOCS_URL`                      | `SK`, `KEY2`, `URL_1`                             |
| **Test names**                  | `it("adds a thousands separator")`                   | `it("works")`, `it("test 1")`                     |
| **Doc files**                   | `architecture/background-jobs.md`                    | `arch/bg.md`, `notes2.md`                         |
| **Error messages**              | `"Enter an email address"`                           | `"Invalid input"`, `"Error 42"`                   |

The words come from the [Ontology](/ontology) wherever it has a term: reusable functions are in `utils/`, never `helpers/` or `utilities/`. A project's own ontology adds its product words: in Launchpad, a Draft Ticket is `draftTicket`, never `pendingTicket`. The casing comes from [Naming Conventions](/Structure/naming-conventions).

---

## Form fields

Form fields are where names slip most, and where they matter most: a field's name travels through the whole system.

**One field, one name, everywhere it goes.** The same words name the input, the form's data, the API request, the type and the database column:

| Where                           | Name                   |
| ------------------------------- | ---------------------- |
| Input `name` and `id`           | `emailAddress`         |
| Form data and validation schema | `emailAddress`         |
| API request body                | `emailAddress`         |
| Type property                   | `emailAddress: string` |
| Database column                 | `email_address`        |

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

| Where                  | Write                           |
| ---------------------- | ------------------------------- |
| A property or variable | `id`, `userId`, `draftTicketId` |
| A list of them         | `userIds`                       |
| A constant             | `DEFAULT_PROJECT_ID`            |
| A database column      | `user_id`                       |

- **Case it as a word**: `userId`, never `userID`.
- **`identifier` means something else.** Use it only when an outside system has a separate field with that name. Linear has both: `id` is its hidden unique code, and `identifier` is the readable `ACT-73`. Writing `identifier` for an `id` would mix the two up.

## Dictionary

Some short names are not abbreviations. They are the word people actually say, and the long form would only make the name harder to read. **These are dictionary words, and stay short:**

| Word                         | Means                                                                                                       | Example names                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `id`                         | A unique id                                                                                                 | `userId`, `user_id`, `DEFAULT_PROJECT_ID`         |
| `docs`                       | A project's documentation                                                                                   | `docs/`, `docsSite/`, `DOCS_URL`, `pnpm docs:dev` |
| `lib`                        | The folder for outside connections and app-wide setup. Next.js and shadcn/ui use the same name              | `lib/`, `lib/integrations/`                       |
| `props`                      | The values a component takes                                                                                | `props`, `ButtonProps`                            |
| `ref`                        | A React ref: a handle on an element or a value kept between renders                                         | `inputRef`, `useRef`, `scrollContainerRef`        |
| `repo`                       | A repository: in GitHub's words, it "contains all of your project's files and each file's revision history" | `repoName`, `repoUrl`                             |
| `utils`                      | Reusable functions that are not components                                                                  | `utils/`, `utils/formatCurrency/`                 |
| `app`                        | The application                                                                                             | `app/`, `appName`                                 |
| `url`                        | A web address                                                                                               | `imageUrl`, `DOCS_URL`                            |
| `api`                        | An application programming interface                                                                        | `api/`, `apiResponse`                             |
| `uat`                        | User acceptance testing                                                                                     | `uatEnvironment`                                  |
| `pdf`, `html`, `css`, `json` | File formats                                                                                                | `invoicePdf`, `htmlContent`, `globals.css`        |
| `readme`                     | A project's README file                                                                                     | `readmeContent`                                   |

**Case them as words** in camelCase and PascalCase: `imageUrl`, `apiResponse`, `docsSite` — never `imageURL` or `APIResponse`.

**This list is the only back door.** A short name not on it gets written out in full. If people say the long form out loud — "environment", "dependencies", "message" — write the long form.

### Adding a word to the dictionary

When a short name feels like a dictionary word, don't just use it — add it here first:

1. **Ask:** is this the word people actually say, so the long form would only be harder to read? `docs`, `repo`: yes. `env`, `btn`, `msg`: no.
2. **Add a row** to the table above, in the same pull request as the code that uses it.
3. **If ESLint flags the word**, add it to `replacements` in the `unicorn/name-replacements` rule of the [ESLint config](/Standards/eslint), so the linter agrees: `replacements: { docs: false, lib: false, props: false, ref: false, repo: false, utils: false }`.

The list is the record. If a word is not on it, it is not a dictionary word yet.

---

## Third-party names

**This rule is for the names we write.** It does not cover names that come from someone else's code — a package, a framework, an outside service. Those stay exactly as they are: everyone knows them by that name, their docs use that name, and renaming them breaks the code. Use them as they are where they touch the outside, then **give the value a full-word name as soon as it comes into our code**.

| From                      | Examples                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| An outside service's data | Linear's `id`, `identifier` and `pageInfo`                                                                  |
| Node and library options  | `cwd` in `execFile`, `process.env`, `stdout`, `argv`                                                        |
| React                     | `ref`, `children`, `useRef`, `useEffect`                                                                    |
| shadcn/ui                 | the `cn` class-name function, and the component files it generates                                          |
| Next.js                   | the `app/` folder, `params`, `searchParams`, `LayoutProps`, `generateMetadata`                              |
| HTML and CSS              | `href`, `src`, `alt`, `tabIndex`, Tailwind classes like `text-sm`                                           |
| Tools                     | `node_modules`, `.env.local`, Docusaurus's `src/pages`, Storybook's `args`, the `dev` and `prepare` scripts |
| A project's own ontology  | Its decided product terms, such as Launchpad's `dev_agent`                                                  |

```ts
// ✅ Good — the option keeps its third-party name; our value gets a full-word name
const workingDirectory = process.cwd();
const commandArguments = ["lint", "--fix"];

execFile("pnpm", commandArguments, { cwd: workingDirectory });
```

```ts
// ❌ Bad — renaming the third-party option breaks the call: execFile ignores "workingDirectory"
execFile("pnpm", commandArguments, { workingDirectory });

// ❌ Bad — the third-party name leaks into our own code
const cwd = process.cwd();
```

### When a name clashes

**Keep a third-party import's own name.** When it clashes with something the file declares itself, **rename our own thing first**. A clash usually means our name is too vague: give it a more specific full-word name that says what it actually is.

```ts
// ✅ Good — our function says what it makes, so Supabase's createClient keeps its name
import { createClient } from "@supabase/supabase-js";

export const createProjectDatabaseClient = () =>
  createClient(DATABASE_URL, DATABASE_KEY);
```

```ts
// ❌ Bad — the import is renamed to make room for our vague name
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const createClient = () =>
  createSupabaseClient(DATABASE_URL, DATABASE_KEY);
```

**Rename the import only when our side can't change:**

| The clash                                                                                          | Why our side can't change                      | Rename the import to                                       |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| **Two third-party names**, such as `Link` from `next/link` and the `Link` icon from `lucide-react` | Neither name is ours                           | The owner plus the original name: `Link as LucideLinkIcon` |
| **Our name is fixed by a framework**, such as a Next.js route's `GET` or `generateMetadata`        | The framework finds it only by that exact name | The owner plus the original name                           |

```ts
// ✅ Good — two third-party names clash, so one import is renamed: owner plus original name
import Link from "next/link";
import { Link as LucideLinkIcon } from "lucide-react";
```

```ts
// ❌ Bad — renamed for taste, or shortened
import { createClient as makeDb } from "@supabase/supabase-js";
import { Link as Icon } from "lucide-react";
```

Never rename an import for taste, and never shorten it.

---

## Examples in code

```ts
// ✅ Good
const userEmailAddress = user.email;
const isSubmitButtonDisabled = !isFormValid;

const calculateOrderTotal = (orderItems: OrderItemType[]) => {
  return orderItems.reduce(
    (runningTotal, orderItem) => runningTotal + orderItem.price,
    0,
  );
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

| Names                                                                                                                        | Checked by                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Variables, functions, parameters and file names                                                                              | ESLint `unicorn/name-replacements` and `unicorn/filename-case`                                       |
| Type names                                                                                                                   | ESLint `@typescript-eslint/naming-convention`                                                        |
| CSS variables and CSS Module classes                                                                                         | Stylelint                                                                                            |
| **Everything else** — folders, props, form fields, union values, database columns, routes, environment variables, test names | **Code review and AI agents.** The linter cannot read these, so every agent and reviewer checks them |

ESLint allows the [dictionary](#dictionary) words it would otherwise flag (`docs`, `lib`, `props`, `ref`, `repo`, `utils`), and exactly two third-party names as they are: `params` and `searchParams`. It still flags any of our own names built from an third-party name, such as `inputRef`.
