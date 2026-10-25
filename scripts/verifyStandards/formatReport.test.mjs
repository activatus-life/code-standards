import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { formatReport, STANDARD_NAMES } from "./formatReport.mjs";

const CHECKS_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const STANDARD_PATTERN = /standard: "[\d.]+"/g;
const ANY_STANDARD_PATTERN = /standard:/g;
const STANDARD_NUMBER_PATTERN = /[\d.]+/;

const readCheckFiles = () =>
	readdirSync(CHECKS_DIRECTORY)
		.filter((fileName) => fileName.startsWith("check"))
		.filter((fileName) => !fileName.includes(".test."))
		.map((fileName) =>
			readFileSync(path.join(CHECKS_DIRECTORY, fileName), "utf8"),
		);

// Every standard number any check reports, read from the check files.
const readReportedStandards = () =>
	readCheckFiles()
		.flatMap((checkText) => checkText.match(STANDARD_PATTERN) ?? [])
		.map((match) => STANDARD_NUMBER_PATTERN.exec(match)?.[0]);

describe("formatReport", () => {
	it("has a name for every standard a check reports", () => {
		const unnamed = readReportedStandards().filter(
			(standard) => !Object.hasOwn(STANDARD_NAMES, standard),
		);
		assert.deepEqual(unnamed, []);
	});

	// The test above reads only numbers written as text. A number kept in
	// a variable would be skipped there, so it fails here instead.
	it("finds every standard a check reports written as text", () => {
		const unreadable = readCheckFiles().filter(
			(checkText) =>
				(checkText.match(ANY_STANDARD_PATTERN) ?? []).length !==
				(checkText.match(STANDARD_PATTERN) ?? []).length,
		);
		assert.equal(unreadable.length, 0);
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
