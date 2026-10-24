import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { formatReport, STANDARD_NAMES } from "./formatReport.mjs";

const CHECKS_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const STANDARD_PATTERN = /standard: "[\d.]+"/g;
const STANDARD_NUMBER_PATTERN = /[\d.]+/;

// Every standard number any check reports, read from the check files.
const readReportedStandards = () =>
	readdirSync(CHECKS_DIRECTORY)
		.filter((fileName) => fileName.startsWith("check"))
		.filter((fileName) => !fileName.includes(".test."))
		.flatMap(
			(fileName) =>
				readFileSync(
					path.join(CHECKS_DIRECTORY, fileName),
					"utf8",
				).match(STANDARD_PATTERN) ?? [],
		)
		.map((match) => STANDARD_NUMBER_PATTERN.exec(match)?.[0]);

describe("formatReport", () => {
	it("has a name for every standard a check reports", () => {
		const unnamed = readReportedStandards().filter(
			(standard) => !Object.hasOwn(STANDARD_NAMES, standard),
		);
		assert.deepEqual(unnamed, []);
	});

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
