import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { checkRequiredFiles } from "./checkRequiredFiles.mjs";
import { TEMPLATES_DIRECTORY } from "./testProject.mjs";

const listTemplateDocs = ({ directory }) =>
	readdirSync(directory).flatMap((entry) => {
		const entryPath = path.join(directory, entry);
		return statSync(entryPath).isDirectory()
			? listTemplateDocs({ directory: entryPath })
			: [entryPath];
	});

const docsDirectory = path.join(TEMPLATES_DIRECTORY, "docs");
const TEMPLATE_DOCS = listTemplateDocs({
	directory: docsDirectory,
}).map((fullPath) =>
	path.posix.join("docs", path.relative(docsDirectory, fullPath)),
);

const check = (projectFiles) =>
	checkRequiredFiles({
		templatesDirectory: TEMPLATES_DIRECTORY,
		projectFiles,
	});

describe("checkRequiredFiles", () => {
	it("passes a project with every standard file", () => {
		assert.deepEqual(check(TEMPLATE_DOCS), []);
	});

	it("accepts the overview doc renamed after the project", () => {
		const projectFiles = [
			...TEMPLATE_DOCS.filter(
				(filePath) => filePath !== "docs/overview/what-is-it.md",
			),
			"docs/overview/what-is-launchpad.md",
		];
		assert.deepEqual(check(projectFiles), []);
	});

	it("flags missing docs", () => {
		const findings = check([]);
		assert.ok(findings.some((finding) => finding.standard === "18"));
	});
});
