import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	readRecordedExceptions,
	readSection,
	readTextFile,
} from "./projectFiles.mjs";
import { createTestProject } from "./testProject.mjs";

const CODING_STANDARDS = `# Development — Coding Standards

## Details

- 7. Prettier — skipped: the project uses Biome.
- **12.1. Constants** — changed: see below.

## Components for the standards

- Scroll Cue: label

## Unfinished changes

None
`;

describe("readSection", () => {
	it("returns the text under a heading, up to the next one", () => {
		const section = readSection({
			markdown: "## One\n\nfirst\n\n## Two\n\nsecond",
			heading: "One",
		});
		assert.equal(section, "first");
	});

	it("returns an empty string when the heading is missing", () => {
		assert.equal(readSection({ markdown: "", heading: "One" }), "");
	});
});

describe("readTextFile", () => {
	it("returns undefined for a missing file", () => {
		const projectDirectory = createTestProject({ files: {} });
		assert.equal(
			readTextFile({ projectDirectory, filePath: "missing.md" }),
			undefined,
		);
	});
});

describe("readRecordedExceptions", () => {
	it("reads standard numbers, components and unfinished changes", () => {
		const projectDirectory = createTestProject({
			files: {
				"docs/development/coding-standards.md": CODING_STANDARDS,
			},
		});
		const exceptions = readRecordedExceptions({ projectDirectory });
		assert.deepEqual([...exceptions.standardNumbers], ["7", "12.1"]);
		assert.match(exceptions.componentsText, /scroll cue/);
		assert.equal(exceptions.unfinishedChanges, undefined);
	});

	it("records nothing when the file is missing", () => {
		const projectDirectory = createTestProject({ files: {} });
		const exceptions = readRecordedExceptions({ projectDirectory });
		assert.equal(exceptions.standardNumbers.size, 0);
	});
});
