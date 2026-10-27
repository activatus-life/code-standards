import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { describe, it } from "node:test";

import { runChecks } from "./runChecks.mjs";
import { createTestProject } from "./testProject.mjs";

const CODING_STANDARDS = `# Development — Coding Standards

## Details

- 6. ESLint — skipped: the project uses Biome.

## Unfinished changes

Version 3, change 4: tests still to write.
`;

const listTestFindingFiles = (findings) =>
	findings
		.filter((finding) => finding.standard === "4")
		.map((finding) => finding.file);

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

	it("never hides a numbered line it cannot read", () => {
		const projectDirectory = createTestProject({
			files: {
				"docs/development/coding-standards.md":
					"## Details\n\n1. Our ESLint config has two overrides.\n",
			},
		});
		const result = runChecks({ projectDirectory });
		assert.ok(
			result.failures.some((finding) =>
				/reads as standard 1/.test(finding.message),
			),
		);
	});

	it("hides only the files a named exception covers", () => {
		const projectDirectory = createTestProject({
			files: {
				"docs/development/coding-standards.md":
					"## Details\n\n- 4. Every function and component has a test file — changed for `app/api/**`: legacy.\n",
				"app/api/users/getUser.ts":
					"export const getUser = () => 1;\n",
				"utils/formatDate/formatDate.ts":
					"export const formatDate = () => 1;\n",
			},
		});
		// The checks list files with git.
		execFileSync("git", ["init", "--quiet"], {
			cwd: projectDirectory,
		});
		const result = runChecks({ projectDirectory });
		assert.deepEqual(listTestFindingFiles(result.recorded), [
			"app/api/users/getUser.ts",
		]);
		assert.deepEqual(listTestFindingFiles(result.failures), [
			"utils/formatDate/formatDate.ts",
		]);
	});
});
