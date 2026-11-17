# Agent Response Format — Design

**Status:** Decided · **Updated:** 2026-11-17

## Decision

Add an optional **Response format** choice to project setup, recorded in each project's `AGENTS.md` so every dev agent (Claude Code, Codex, ChatGPT, any agent that reads `AGENTS.md`) answers with the same clear structure Claude gives: an overview of the problem, results in tables, numbered action steps, a status line, and a closing question.

The choice works like status circles: setup offers it, and only a yes writes the section. It is a project-workflow choice, not a numbered code standard, so it never sits inside the managed code-standards markers. The repo stays on version 3.3.7 for now: the version-history entry (same shape as ship's "sixth setup question" entry) is written when the next version goes out, and that release is also what asks existing projects the seventh question.

## The format

When the section is present, every **substantive reply** uses it — anything with findings, results, options or a plan. A plain acknowledgement of a yes/no stays plain. The reply:

1. **Opens with the status line** when status circles are on — "here's where we're up to" comes before anything else.
2. **Then an overview** — one or two lines saying what happened or what was found, before any detail.
3. **Names each problem plainly** — what is wrong and why it matters, one per item, not buried in prose.
4. **Puts results and comparisons in tables** — check results, before/after, options — one row per item.
5. **Gives "how to fix it" as numbered steps**, each concrete enough to action on its own.
6. **Closes with the next action as a question**, such as "Want me to build it on a new branch?"

**Emojis where they help, not everywhere.** Use them when they make a response quicker to read than a slab of text — ✅/❌ per row in a results table, 🎉 when something lands, 🔧 for work in progress. The whole range is welcome; not every response needs them. They are seasoning, never decoration.

**Traffic-light circles belong to the status line only.** The seven status circles (✅ 🟢 🟣 🟡 🟠 🔴 ⚪) each carry one meaning from the Status circles system, and they appear only on a status line, in the format that section defines. For general flavour, use other symbols — 🎉, 🔧, 🚀 — never a bare traffic-light circle. A plain ✅/❌ tick in a results table is fine: it marks pass/fail, which reads unambiguously. Where a response reports ticket status, it does it through a status line at the start, not circles scattered through the prose; the two systems never blend.

## Changes

| File                                                        | Change                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `static/templates/AGENTS.md`                                | New `### Response format` subsection under Project workflow, after `### Status circles`, with the standard "only if chosen during setup, otherwise delete" placeholder and the rules above. Outside the managed markers                                                                                                                                                                  |
| `static/templates/docs/development/coding-standards.md`     | The template's unfilled answers line gains `; response format [yes or no]`                                                                                                                                                                                                                                                                                                               |
| `docs/Guides/setup.md`                                      | Step 4 gains a seventh printed offer: "Response format (optional). Want the agent to answer with a clear structure — a short overview of the problem, results in tables, numbered action steps, and what it needs from you next?" A yes writes the section; a no writes nothing. The recorded-answers one-liner gains `response format [yes or no]`, and "all six answers" becomes seven |
| `docs/Standards/working-with-agents.md`                     | New "Response format" section documenting the choice, with a worked example response (genericised from the ESLint check-results example: status line first, overview, results table with ✅/❌, "how to fix it" steps, closing question)                                                                                                                                                 |
| `scripts/verifyStandards/checkRecordedAnswers.mjs` (+ test) | Learns the seventh answer, `response format`, so `standards:check` validates it like the other six                                                                                                                                                                                                                                                                                       |

## Rollout for existing projects

No migration work in this change, and no version bump: the repo stays on 3.3.7. New projects get the choice straight away, because setup and the templates change immediately. Existing projects run `standards:check` from their installed package version, so nothing changes for them until the next version goes out — its release adds the version-history entry (like ship's), and the update flow's standing step, "ask any Working with the agent question whose answer is not recorded", then asks them the seventh question.

## Why

Claude's structured answers make results readable at a glance; other dev agents answer in terse slabs, and the person re-reads everything to find what needs action. Encoding the format in `AGENTS.md` reaches every agent, since `AGENTS.md` is the one file they all read — Codex reads it natively. Making it a setup choice keeps the rollout gentle: no project has the section forced on it by a version bump.

## Related

- [Working with Agents](../../Standards/working-with-agents.md)
- [Setup — step 4](../../Guides/setup.md)
- [AGENTS.md template](https://github.com/activatus-life/code-standards/blob/main/static/templates/AGENTS.md)
