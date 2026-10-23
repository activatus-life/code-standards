import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { checkRecordedAnswers } from "./checkRecordedAnswers.mjs";
import { createTestProject } from "./testProject.mjs";

const ALL_ANSWERS = `## Details

- Working with the agent: GitHub repo https://github.com/example/site; Linear project None; status circles yes; ask before every commit and push yes (2026-10-23).

## Related
`;

const PALETTE = `## Colour palette

| Colour | Value | Class names | Use for |
| --- | --- | --- | --- |
| Brand primary | \`#3b82f6\` | \`bg-brand-primary\` | Buttons |

## Why
`;

const TEMPLATE_PALETTE = `## Colour palette

| Colour | Value | Class names | Use for |
| --- | --- | --- | --- |
| [Brand primary] | [\`#3b82f6\`] | [\`bg-brand-primary\`] | [Buttons] |

## Why
`;

const check = (files) =>
	checkRecordedAnswers({
		projectDirectory: createTestProject({ files }),
	});

describe("checkRecordedAnswers", () => {
	it("passes all four answers and a filled-in palette", () => {
		assert.deepEqual(
			check({
				"docs/development/coding-standards.md": ALL_ANSWERS,
				"docs/design/design-system.md": PALETTE,
			}),
			[],
		);
	});

	it("flags each missing agent answer", () => {
		const findings = check({
			"docs/development/coding-standards.md":
				"## Details\n\n- GitHub repo: https://github.com/example/site\n",
			"docs/design/design-system.md": PALETTE,
		});
		assert.equal(findings.length, 3);
		assert.match(findings[0].message, /the Linear project/);
	});

	it("flags the template's unfilled answers line", () => {
		const findings = check({
			"docs/development/coding-standards.md":
				"## Details\n\n- Working with the agent: GitHub repo [link or None]; Linear project [project or None]; status circles [yes or no]; ask before every commit and push [yes or no] ([YYYY-MM-DD]).\n",
			"docs/design/design-system.md": PALETTE,
		});
		assert.equal(findings.length, 4);
	});

	it("flags a palette still holding the template's placeholder", () => {
		const findings = check({
			"docs/development/coding-standards.md": ALL_ANSWERS,
			"docs/design/design-system.md": TEMPLATE_PALETTE,
		});
		assert.equal(findings.length, 1);
		assert.equal(findings[0].standard, "11");
	});

	it("flags a design system doc with no palette section", () => {
		const findings = check({
			"docs/development/coding-standards.md": ALL_ANSWERS,
			"docs/design/design-system.md": "## Decision\n\nBlue.\n",
		});
		assert.equal(findings.length, 1);
	});

	it("leaves missing files to the required files check", () => {
		assert.deepEqual(check({}), []);
	});
});
