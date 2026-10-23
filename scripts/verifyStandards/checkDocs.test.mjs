import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { checkDocs } from "./checkDocs.mjs";
import {
	createTestProject,
	TEMPLATES_DIRECTORY,
} from "./testProject.mjs";

const GOOD_DOC = `# Overview — What Is It

> One line.

**Status:** Not started · **Updated:** 2026-10-23

## Decision

Text.

## Why

Text.

## Related

- Link
`;

const listFiles = ({ directory }) =>
	readdirSync(directory).flatMap((entry) => {
		const entryPath = path.join(directory, entry);
		return statSync(entryPath).isDirectory()
			? listFiles({ directory: entryPath })
			: [entryPath];
	});

const checkOne = ({ filePath, contents }) => {
	const projectDirectory = createTestProject({
		files: { [filePath]: contents },
	});
	return checkDocs({ projectDirectory, projectFiles: [filePath] });
};

describe("checkDocs", () => {
	it("passes a doc in the standard format", () => {
		assert.deepEqual(
			checkOne({
				filePath: "docs/overview/what-is-it.md",
				contents: GOOD_DOC,
			}),
			[],
		);
	});

	it("flags a file name that does not match the menu item", () => {
		const findings = checkOne({
			filePath: "docs/overview/about.md",
			contents: GOOD_DOC,
		});
		assert.match(findings[0].message, /makes it what-is-it/);
	});

	it("ignores headings inside code blocks", () => {
		const findings = checkOne({
			filePath: "docs/overview/what-is-it.md",
			contents: `${GOOD_DOC}\n\`\`\`md\n# Not a heading\n\`\`\`\n`,
		});
		assert.deepEqual(findings, []);
	});

	it("flags a missing status line and sections", () => {
		const findings = checkOne({
			filePath: "docs/overview/what-is-it.md",
			contents: "# Overview — What Is It\n",
		});
		assert.equal(findings.length, 2);
	});

	it("skips docs/assets", () => {
		assert.deepEqual(
			checkOne({
				filePath: "docs/assets/notes.md",
				contents: "anything",
			}),
			[],
		);
	});

	it("passes every doc template", () => {
		const docsDirectory = path.join(TEMPLATES_DIRECTORY, "docs");
		const files = Object.fromEntries(
			listFiles({ directory: docsDirectory }).map((fullPath) => [
				path.posix.join(
					"docs",
					path.relative(docsDirectory, fullPath),
				),
				readFileSync(fullPath, "utf8"),
			]),
		);
		const projectDirectory = createTestProject({ files });
		const findings = checkDocs({
			projectDirectory,
			projectFiles: Object.keys(files),
		});
		assert.deepEqual(findings, []);
	});
});
