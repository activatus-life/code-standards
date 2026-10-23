import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatReport } from "./formatReport.mjs";

describe("formatReport", () => {
	it("says the project passes when nothing fails", () => {
		const report = formatReport({
			result: {
				failures: [],
				recorded: [],
				unfinishedChanges: undefined,
			},
			projectDirectory: process.cwd(),
		});
		assert.match(report, /follows the code standards/);
	});

	it("groups findings under their standard, with the page once", () => {
		const finding = {
			standard: "7",
			message: "prettier.config.mjs is missing",
			page: "docs/Standards/prettier.md",
		};
		const report = formatReport({
			result: {
				failures: [finding, { ...finding, message: "second" }],
				recorded: [],
				unfinishedChanges: undefined,
			},
			projectDirectory: process.cwd(),
		});
		assert.match(report, /7\. Prettier/);
		assert.equal(report.match(/Read:/g).length, 1);
	});
});
