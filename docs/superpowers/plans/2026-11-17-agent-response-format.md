# Agent Response Format Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional "Response format" setup choice so every dev agent answers with a structured reply — status line first, overview, problems plainly, tables, numbered steps, closing question.

**Architecture:** A new `### Response format` subsection in the AGENTS.md template's Project workflow (outside the managed markers), offered by setup step 4 as the seventh question, recorded like the other six answers, and validated by the recorded-answers checker. No version bump: the repo stays on 3.3.7.

**Tech Stack:** Markdown docs and templates, plain Node ESM scripts, `node --test`, Prettier.

**Standing rule for every commit step:** ask Tom "Ready to commit and push — want me to?" and wait for a clear yes to that specific action. Never commit without it.

**Spec:** `docs/superpowers/specs/2026-11-17-agent-response-format-design.md`

---

### Task 1: The `### Response format` section in the AGENTS.md template

**Files:**

- Modify: `static/templates/AGENTS.md` (insert after the Status circles section, which ends at line 76 with the "- Only what the person needs to act on..." list; before `## Environment variables` at line 78)

- [ ] **Step 1: Insert the section**

Between the end of `### Status circles` (after the line `- Only what the person needs to act on. Leave out what they already know.`) and `## Environment variables`, insert:

```markdown
### Response format

[Only if the person chose the response format during setup. Otherwise delete this section.]

Answer every substantive reply — anything with findings, results, options or a plan — in this shape. A plain acknowledgement of a yes or no stays plain.

1. **The status line first**, when status circles are on: where the work is up to, before anything else, in the format the Status circles section defines.
2. **An overview** — one or two lines: what happened or what was found, before any detail.
3. **Each problem named plainly** — what is wrong and why it matters, one per item, not buried in prose.
4. **Results and comparisons in tables** — check results, before and after, options — one row per item.
5. **"How to fix it" as numbered steps**, each concrete enough to action on its own.
6. **The next action as a question**, so the person only has to answer it.

**Emojis where they help, not everywhere.** Use them when they make the reply quicker to read than a slab of text — ✅/❌ per row in a results table, 🎉 when something lands, 🔧 for work in progress. The whole range is welcome; not every reply needs them. **Traffic-light circles are the exception:** the seven status circles (✅ 🟢 🟣 🟡 🟠 🔴 ⚪) carry one meaning each from the Status circles section and appear only on a status line. For flavour use other symbols. A ✅/❌ tick in a results table marks pass and fail, which is fine.
```

- [ ] **Step 2: Check formatting and the agent-files check**

Run: `pnpm format:check` and `node --test scripts/verifyStandards/checkAgentFiles.test.mjs`
Expected: both pass. The new section sits outside the `<!-- code-standards:start/end -->` markers, so `checkAgentFiles` must not report a template difference.

- [ ] **Step 3: Commit** (ask Tom first — see the standing rule)

```bash
git add static/templates/AGENTS.md
git commit -m "feat: response format section in the AGENTS.md template"
```

---

### Task 2: The seventh slot in the template's answers line

**Files:**

- Modify: `static/templates/docs/development/coding-standards.md:19`

- [ ] **Step 1: Extend the unfilled answers line**

Change line 19 from:

```markdown
- Working with the agent: GitHub repo [link or None]; Linear project [project or None]; status circles [yes or no]; ask before every commit and push [yes or no]; told about decisions [yes or no]; ship [yes or no] ([YYYY-MM-DD]).
```

to:

```markdown
- Working with the agent: GitHub repo [link or None]; Linear project [project or None]; status circles [yes or no]; ask before every commit and push [yes or no]; told about decisions [yes or no]; ship [yes or no]; response format [yes or no] ([YYYY-MM-DD]).
```

- [ ] **Step 2: Check formatting**

Run: `pnpm format:check`
Expected: passes

- [ ] **Step 3: Commit** (ask Tom first)

```bash
git add static/templates/docs/development/coding-standards.md
git commit -m "feat: response format slot in the template's recorded answers"
```

---

### Task 3: The checker learns the seventh answer (TDD)

**Files:**

- Modify: `scripts/verifyStandards/checkRecordedAnswers.test.mjs`
- Modify: `scripts/verifyStandards/checkRecordedAnswers.mjs`

- [ ] **Step 1: Update the failing test**

In `checkRecordedAnswers.test.mjs`, make these changes:

a. The `ALL_ANSWERS` constant becomes (the recorded line gains `; response format yes`):

```js
const ALL_ANSWERS = `## Details

- Working with the agent: GitHub repo https://github.com/example/site; Linear project None; status circles yes; ask before every commit and push yes; told about decisions no; ship yes; response format yes (2026-10-23).

## Related
`;
```

b. The test named `"passes all six answers and a filled-in palette"` is renamed to `"passes all seven answers and a filled-in palette"` (assert stays `[]`).

c. The template's unfilled answers line in `"flags the template's unfilled answers line"` gains the seventh slot, and the expected count goes from 6 to 7:

```js
const findings = check({
	"docs/development/coding-standards.md":
		"## Details\n\n- Working with the agent: GitHub repo [link or None]; Linear project [project or None]; status circles [yes or no]; ask before every commit and push [yes or no]; told about decisions [yes or no]; ship [yes or no]; response format [yes or no] ([YYYY-MM-DD]).\n",
	"docs/design/design-system.md": PALETTE,
});
assert.equal(findings.length, 7);
```

d. The test named `"flags each missing agent answer"` expects one more finding (GitHub recorded, the other six missing), and the first finding's message stays the Linear project:

```js
assert.equal(findings.length, 6);
assert.match(findings[0].message, /the Linear project/);
```

e. Add a new test after `"flags a project set up before ship was asked"`:

```js
it("flags a project set up before the response format was asked", () => {
	const findings = check({
		"docs/development/coding-standards.md": ALL_ANSWERS.replace(
			"; response format yes",
			"",
		),
		"docs/design/design-system.md": PALETTE,
	});
	assert.equal(findings.length, 1);
	assert.match(findings[0].message, /does not record the response format/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/verifyStandards/checkRecordedAnswers.test.mjs`
Expected: FAIL — the new test fails because the checker does not know the response format yet

- [ ] **Step 3: Implement the seventh answer**

In `checkRecordedAnswers.mjs`, change the header comment from "the six agent answers" to "the seven agent answers", and add the seventh entry to `AGENT_ANSWERS` after the ship entry:

```js
// What setup asks the person and writes down: the seven agent answers
// (standard 21) and the colour palette (standard 11).
```

```js
	{ name: "ship", pattern: /\bship\b/i },
	{ name: "the response format", pattern: /response format/i },
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test scripts/verifyStandards/checkRecordedAnswers.test.mjs`
Expected: PASS, all tests green

- [ ] **Step 5: Run the whole test suite**

Run: `pnpm test`
Expected: passes

- [ ] **Step 6: Commit** (ask Tom first)

```bash
git add scripts/verifyStandards/checkRecordedAnswers.mjs scripts/verifyStandards/checkRecordedAnswers.test.mjs
git commit -m "feat: recorded-answers check learns the response format"
```

---

### Task 4: Setup offers the seventh question

**Files:**

- Modify: `docs/Guides/setup.md` (lines 134, 168–176, 225, 281)

- [ ] **Step 1: Update the section count at line 134**

Change:

```markdown
Do this step every time, straight after step 3. Once the standards are agreed, offer the six [Working with Agents](/docs/Standards/working-with-agents) options. All six are optional: offer every one, every time, so the person can fill them in quickly and keep going.
```

to:

```markdown
Do this step every time, straight after step 3. Once the standards are agreed, offer the seven [Working with Agents](/docs/Standards/working-with-agents) options. All seven are optional: offer every one, every time, so the person can fill them in quickly and keep going.
```

- [ ] **Step 2: Add the printed offer after the ship offer**

After the ship offer's code block (which ends with `Yes or no?` and the closing fence, before the "Record the answers" paragraph), insert:

````markdown
Then the **response format**. **Print this to the person exactly as it is written**:

```text
Response format (optional). Want the agent to answer with a
clear structure — a short overview of the problem, results
in tables, numbered action steps, and what it needs from
you next? Yes or no?
```
````

- [ ] **Step 3: Extend the "Record the answers" paragraph**

Two changes in the paragraph at line 176:

a. After the sentence about ship ("If they said no, delete the Ship line."), insert:

```markdown
 If they said yes to the response format, write the **Response format** section from the template's Project workflow into `AGENTS.md`, under Project workflow, after the Status circles section. If they said no, write nothing about it.
```

b. Change `Write all six answers` to `Write all seven answers`, and extend the recorded line:

```markdown
`- Working with the agent: GitHub repo [link or None]; Linear project [project or None]; status circles [yes or no]; ask before every commit and push [yes or no]; told about decisions [yes or no]; ship [yes or no]; response format [yes or no] ([date]).`
```

- [ ] **Step 4: Update "Already on this version" step 1 (line 225)**

Change the answer list to include the new one:

```markdown
1. **Check `docs/development/coding-standards.md`, under "Details",** for the [step 4](#4-working-with-the-agent) answers: the GitHub repo, the Linear project, the status circles, asking before committing, being told about decisions, ship and the response format. Ask the person any that are not recorded, and record them as step 4 says.
```

- [ ] **Step 5: Update the check table row (line 281)**

Change `records the six agent answers` to `records the seven agent answers`.

- [ ] **Step 6: Check formatting**

Run: `pnpm format:check`
Expected: passes

- [ ] **Step 7: Commit** (ask Tom first)

```bash
git add docs/Guides/setup.md
git commit -m "docs: setup offers the response format as the seventh question"
```

---

### Task 5: The Working with Agents docs section

**Files:**

- Modify: `docs/Standards/working-with-agents.md` (intro at line 8, new section after Ship)

- [ ] **Step 1: Update the intro**

Change line 8 from:

```markdown
> How an AI agent links a project's work, reports on it, asks before committing, tells the person about its decisions and ships a change. The GitHub repo, the Linear project, the status circles, asking before every commit and push, being told about decisions and ship are all optional. [Setup](/docs/Guides/setup#4-working-with-the-agent) offers all six every time, so they take a moment to fill in, and a project can leave out any of them. They work the same with Claude Code, ChatGPT, Codex or any agent that reads `AGENTS.md`.
```

to:

```markdown
> How an AI agent links a project's work, reports on it, asks before committing, tells the person about its decisions, ships a change and answers in a readable shape. The GitHub repo, the Linear project, the status circles, asking before every commit and push, being told about decisions, ship and the response format are all optional. [Setup](/docs/Guides/setup#4-working-with-the-agent) offers all seven every time, so they take a moment to fill in, and a project can leave out any of them. They work the same with Claude Code, ChatGPT, Codex or any agent that reads `AGENTS.md`.
```

- [ ] **Step 2: Add the Response format section at the end of the file**

After the Ship section (end of file), append:

````markdown
## Response format

Optional. Setup asks: "Would you like the agent to answer with a clear structure — a short overview of the problem, results in tables, numbered action steps, and what it needs from you next?" A yes is written as the **Response format** section in Project workflow. Then every substantive reply — anything with findings, results, options or a plan — follows the same shape, and a plain acknowledgement of a yes or no stays plain:

1. **The status line first**, when status circles are on: where the work is up to.
2. **An overview** — what happened or what was found, in a line or two.
3. **Each problem plainly** — what is wrong and why it matters.
4. **Results in tables** — one row per item.
5. **"How to fix it" as numbered steps.**
6. **The next action as a question.**

Emojis are welcome where they make the reply quicker to read — a ✅/❌ per row in a results table, 🎉 when something lands. The seven status circles appear only on a status line, never as decoration.

```md title="A reply in the response format"
🟣 Response format: template, setup and docs done; the checker is left.

I added the response format as a setup choice, like status circles. One problem: the recorded-answers check only knows six answers, so `standards:check` would pass a project that said yes without the answer recorded.

| File | Result |
| --- | --- |
| AGENTS.md template | ✅ Response format section added |
| Setup step 4 | ✅ Seventh offer added |
| working-with-agents.md | ✅ This section |
| checkRecordedAnswers.mjs | ❌ Missing the seventh answer |

How to fix it:

1. Add the response format to the checker's list of answers.
2. Update the checker's test to expect seven answers.
3. Run the tests and `pnpm standards:check`.

Want me to finish the checker now?
```
````

- [ ] **Step 3: Check formatting**

Run: `pnpm format:check`
Expected: passes

- [ ] **Step 4: Commit** (ask Tom first)

```bash
git add docs/Standards/working-with-agents.md
git commit -m "docs: response format in Working with Agents, with a worked example"
```

---

### Task 6: Full verification and the left-to-do note

**Files:**

- Modify: `docs/superpowers/specs/2026-11-17-agent-response-format-design.md` (no change expected — this task only verifies it matches what was built)

- [ ] **Step 1: Run the repo checks**

```bash
pnpm test
pnpm format:check
pnpm typecheck
```

Expected: all pass

- [ ] **Step 2: Run `pnpm devtest`** (the standards are not ready until it passes)

Run: `pnpm devtest`
Expected: passes — it lints and formats every template the way a project does

- [ ] **Step 3: Self-review against the spec**

Read the spec's Changes table row by row and point at the change in the working tree for each. Confirm:

- The template section sits outside the managed markers and `checkAgentFiles` still passes.
- "six" appears nowhere in the step-4 flow except the historical version-history entry (line 79 of `docs/version-history.md`, which stays untouched).
- The worked example's status line comes first and uses no traffic-light circle beyond the status line.

- [ ] **Step 4: Leave a note for the release**

The next version release (3.3.8 or later, whichever ships first) must add a version-history entry, same shape as ship's at `docs/version-history.md:79`: "A seventh setup question, the response format…", plus "records the seven agent answers" in its era of the check table. Record this as a leftover in the handover summary to Tom, not in a released version entry — the repo stays on 3.3.7.

- [ ] **Step 5: Commit anything left** (ask Tom first, per the standing rule)
