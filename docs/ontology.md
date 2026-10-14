---
sidebar_position: 1.5
sidebar_label: "Ontology"
---

# Ontology

> The words Activatus uses, what each one means, and the words we deliberately do not use.

**Status:** Decided · **Updated:** 2026-10-12 · **Source:** Launchpad's `docs/product/ontology.md` (2026-09-28)

**Every Activatus project uses these terms.** Use them consistently in docs, code, database names, prompts and UI.

An ontology is a shared vocabulary. When a person says "Draft Ticket" or "UAT", this page is what they mean — so a developer or an AI agent never has to guess, and never invents a second word for the same thing.

## How to use this page

- **Read it before starting work on any Activatus project.**
- **Use the term on this page**, not a synonym. It is a `user_flow`, never a `user_journey`.
- **Never use a [removed term](#removed-terms).**
- **If someone uses a word loosely**, work out which term on this page they mean, and use that term in what you write.
- **If a term here has no definition, or you are not sure what is meant, ask.** Do not guess, and do not invent a new term.

### Writing a term

The words stay the same everywhere. Only the casing changes, to match where the term is written:

| Where | Written as | Example |
| --- | --- | --- |
| Database names, and the form used on this page | `snake_case` | `draft_ticket` |
| Code — variables and functions | camelCase | `draftTicket` |
| Code — types and components | PascalCase | `DraftTicketType` |
| Docs, prompts and UI | Title Case | Draft Ticket |

---

## The lifecycle

Activatus takes a product from idea to live in four stages:

```text
PITCH → ASSEMBLE → DEPLOY → LIVE
```

| Stage | Means |
| --- | --- |
| **Pitch** | Understand and define the product. Produces the Product Definition and Decision Docs |
| **Assemble** | Turn product intent into approved implementation work, and execute it |
| **Deploy** | Validate the work through UAT, approve it, and move it into production |
| **Live** | Verify the intended product is actually live and working |

There is no separate "confirmation" stage. Confirming Draft Tickets is an action within Assemble.

### The end-to-end workflow

```text
HUMAN → IDEA → PITCH → PRODUCT DEFINITION → DECISIONS → DECISION DOCS
  ↓
PLANNING AGENT → DRAFT TICKETS → DRAFT TICKET REVIEW → CONFIRM & SEND TO LINEAR
  ↓
LINEAR TICKETS → WORKFLOW → LAUNCHPAD ENGINE
  ↓
ASSIGNEE ── DEV AGENT | DEVELOPER
  ↓
TICKET CHANGE → DEV TESTING → REVIEW AGENT → PULL REQUEST → PULL REQUEST REVIEW → MERGE
  ↓
UAT → UAT CHECK ── PASS | FAIL | SKIP
                        │
                        └─ FAIL → new bugfix Linear Ticket → back to WORKFLOW (Assemble)
  ↓
UAT COMPLETE → APPROVAL → DEPLOYMENT → PRODUCTION → LIVE
```

---

## The terms

### Product / Knowledge

`project` · `repository` · `pitch` · `product_definition` · `product` · `target_market` · `ideal_user` · `product_market_fit` · `user_flow` · `product_scope` · `feature_scope` · `ticket_scope` · `assumption` · `decision` · `decision_doc` · `context` · `knowledge` · `ontology` · `retrieval`

### AI

`agent` · `agent_harness` · `stager` · `planning_agent` · `dev_agent` · `review_agent` · `model` · `tool` · `mcp`

### Work

`draft_ticket` · `draft_ticket_review` · `approval` · `build_plan` · `linear_ticket` · `dependency` · `workflow` · `ready` · `blocked` · `blocker` · `assignee` · `unassigned` · `in_review` · `waiting_uat` · `in_uat` · `human` · `waiting` · `developer` · `human_label` · `launchpad_engine` · `assemble`

### Implementation / Delivery

`ticket_change` · `acceptance_criteria` · `dev_testing` · `pull_request` · `pull_request_review` · `deploy` · `uat` · `uat_check` · `bugfix` · `scope_creep` · `deployment` · `release` · `release_ticket` · `production` · `live` · `relationship`

---

## Key distinctions

These are the terms most easily confused. The **Not** column is the word we do not use.

| Term | Means | Not |
| --- | --- | --- |
| **Workflow** | How we plan and build the app: work relationships, dependencies, readiness | `work_graph` |
| **User Flow** | How the user uses the app | `user_journey` |
| **Draft Ticket / Linear Ticket** | Work before approval (Launchpad) vs approved work (Linear) | generic `ticket` |
| **Ticket Change** | What was actually changed | generic `changes` / `implementation` |
| **Dev Testing** | *Did we build it correctly?* | `technical_check` |
| **UAT** | *Did we build the right thing?* | |
| **Launchpad Engine** | Deterministic orchestration. Not an AI agent | |
| **Developer** | A human doing development work | |
| **Dev Agent** | The AI development worker | |
| **Agent / Agent Run** | Reusable role vs one scoped execution of it | |
| **Ontology / Agent Harness** | What concepts mean vs how an agent behaves | |
| **blocked + `human` label** | Can't continue until a human acts | `needs_you` |
| **blocked + `waiting` label** | Can't continue until a restricted model is available | |

Use specific review terms: `draft_ticket_review`, `pull_request_review`, `review_agent`, `in_review`. Never a bare "review".

### Decisions and Decision Docs

Every meaningful product choice is an explicit **Decision**. Important Decisions are captured in human-readable **Decision Docs**.

- **Linear Tickets own the *what*.** Example: "Build GitHub authentication."
- **Decision Docs own the *why*.** Example: "Developers are our audience and we must sync directly to their repositories."

```text
WHY → DECISION → WORK → TICKET CHANGE
```

Agents and developers trace work back to its Decision Doc, so they never have to invent a product decision to unblock themselves.

---

## Removed terms

**Do not use these.** Do not reintroduce one without first explaining why in a Decision Doc.

| Removed | Use instead |
| --- | --- |
| `user_journey` | `user_flow` |
| `work_graph` | `workflow` |
| generic `ticket` | `draft_ticket` or `linear_ticket` |
| generic `changes`, generic `implementation` | `ticket_change` |
| `technical_check` | `dev_testing` |
| `needs_you` | `blocked` + the `human` label |
| generic `review` | `draft_ticket_review`, `pull_request_review`, `review_agent` or `in_review` |
| generic `scope` | `product_scope`, `feature_scope` or `ticket_scope` |
| `confirmation` (as a stage) | It is an action within Assemble, not a stage |

Also removed, with no direct replacement:

generic `outcome` · generic `experience` · `open_question` · temporary agent name `alex` · `implementation_issue` · `decision_issue` · `fix_issue` · `missing_work`

Unknown work found later becomes real work through the normal Draft Ticket / Linear Ticket path. Work outside the agreed scope is `scope_creep`.

---

## Changing the ontology

**This page is the one place the ontology is kept.** Change it here; do not keep a second copy in a project.

- **Adding a term**: add it to the right group above. If it could be confused with another term, add a row to [Key distinctions](#key-distinctions).
- **Removing a term**: move it to [Removed terms](#removed-terms) and say what to use instead.
- **Either way**, update the date at the top of this page.
