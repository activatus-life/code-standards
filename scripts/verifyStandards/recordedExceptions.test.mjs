import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	isRecordedFinding,
	readRecordedExceptions,
} from "./recordedExceptions.mjs";
import { createTestProject } from "./testProject.mjs";

const readDetails = ({ details, unfinished = "None" }) =>
	readRecordedExceptions({
		projectDirectory: createTestProject({
			files: {
				"docs/development/coding-standards.md": `# Development — Coding Standards

## Details

${details}

## Components for the standards

- Scroll Cue: label

## Unfinished changes

${unfinished}
`,
			},
		}),
	});

describe("readRecordedExceptions", () => {
	it("reads exceptions, components and unfinished changes", () => {
		const recorded = readDetails({
			details:
				"- 7. Prettier — skipped: the project uses Biome.\n- **12.1. Constants** — changed: see below.",
		});
		assert.deepEqual(recorded.exceptions, [
			{ standard: "7", fileGlobs: [] },
			{ standard: "12.1", fileGlobs: [] },
		]);
		assert.deepEqual(recorded.unreadLines, []);
		assert.match(recorded.componentsText, /scroll cue/);
		assert.equal(recorded.unfinishedChanges, undefined);
	});

	it("reads the files an exception names", () => {
		const recorded = readDetails({
			details:
				"- 4. Every function and component has a test file — changed for `app/api/**` and `lib/legacy.ts`: tested when replaced.",
		});
		assert.deepEqual(recorded.exceptions, [
			{ standard: "4", fileGlobs: ["app/api/**", "lib/legacy.ts"] },
		]);
	});

	it("reports a numbered line that is not an exception", () => {
		const recorded = readDetails({
			details:
				"1. The ESLint config has two overrides.\n2. Both are temporary.",
		});
		assert.deepEqual(recorded.exceptions, []);
		assert.equal(recorded.unreadLines.length, 2);
		assert.match(recorded.unreadLines[0], /reads as standard 1/);
	});

	it("reports an exception whose name does not match its number", () => {
		const recorded = readDetails({
			details: "- 6. Prettier — skipped: uses Biome.",
		});
		assert.deepEqual(recorded.exceptions, []);
		assert.match(recorded.unreadLines[0], /which is "ESLint"/);
	});

	it("leaves lines without a number alone", () => {
		const recorded = readDetails({
			details:
				"- Working with the agent: GitHub repo None; status circles yes.",
		});
		assert.deepEqual(recorded.exceptions, []);
		assert.deepEqual(recorded.unreadLines, []);
	});

	it("reads a None with a note as unfinished", () => {
		const recorded = readDetails({
			details: "No differences",
			unfinished:
				"None. ESLint was switched on in an earlier ticket.",
		});
		assert.match(recorded.unfinishedChanges, /switched on/);
	});

	it("records nothing when the file is missing", () => {
		const recorded = readRecordedExceptions({
			projectDirectory: createTestProject({ files: {} }),
		});
		assert.deepEqual(recorded.exceptions, []);
		assert.deepEqual(recorded.unreadLines, []);
	});
});

describe("isRecordedFinding", () => {
	const finding = { standard: "4", file: "app/api/users/route.ts" };

	it("covers every file when the exception names none", () => {
		assert.ok(
			isRecordedFinding({
				finding,
				exceptions: [{ standard: "4", fileGlobs: [] }],
			}),
		);
	});

	it("covers a file inside a named glob", () => {
		assert.ok(
			isRecordedFinding({
				finding,
				exceptions: [{ standard: "4", fileGlobs: ["app/api/**"] }],
			}),
		);
	});

	it("leaves a file outside the named globs", () => {
		assert.equal(
			isRecordedFinding({
				finding: { standard: "4", file: "app/page.tsx" },
				exceptions: [
					{ standard: "4", fileGlobs: ["app/api/", "lib/*.ts"] },
				],
			}),
			false,
		);
	});

	it("keeps a single star inside one folder", () => {
		assert.equal(
			isRecordedFinding({
				finding,
				exceptions: [{ standard: "4", fileGlobs: ["app/*.ts"] }],
			}),
			false,
		);
	});

	it("leaves another standard alone", () => {
		assert.equal(
			isRecordedFinding({
				finding,
				exceptions: [{ standard: "7", fileGlobs: [] }],
			}),
			false,
		);
	});
});
