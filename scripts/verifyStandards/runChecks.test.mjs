import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { runChecks } from "./runChecks.mjs";
import { createTestProject } from "./testProject.mjs";

const CODING_STANDARDS = `# Development — Coding Standards

## Details

- 6. ESLint — skipped: the project uses Biome.

## Unfinished changes

Version 3, change 4: tests still to write.
`;

describe("runChecks", () => {
	it("moves findings for recorded standards out of the failures", () => {
		const projectDirectory = createTestProject({
			files: {
				"docs/development/coding-standards.md": CODING_STANDARDS,
			},
		});
		const result = runChecks({ projectDirectory });
		assert.ok(result.recorded.length > 0);
		assert.ok(
			result.recorded.every((finding) => finding.standard === "6"),
		);
		assert.ok(
			result.failures.every((finding) => finding.standard !== "6"),
		);
		assert.match(result.unfinishedChanges, /tests still to write/);
	});
});
