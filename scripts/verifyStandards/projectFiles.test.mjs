import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { readSection, readTextFile } from "./projectFiles.mjs";
import { createTestProject } from "./testProject.mjs";

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
