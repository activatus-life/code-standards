// Reads what the checks need from the project: its files, and the
// exceptions it has recorded in docs/development/coding-standards.md.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The installed @activatus/code-standards package: its templates and
// its docs are what the project is checked against.
export const PACKAGE_DIRECTORY = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../..",
);

export const CODING_STANDARDS_PATH =
	"docs/development/coding-standards.md";

const NO_VALUE_WORDS = new Set(["none", "no differences"]);

// A recorded exception starts with its standard number:
// "7. Prettier — skipped", "- 12.1. Constants — changed".
const STANDARD_NUMBER_PATTERN =
	/^\s*(?:[-*]\s+)?(?:\*\*)?(\d+(?:\.\d+)?)\.\s/;

export const readTextFile = ({ projectDirectory, filePath }) => {
	const fullPath = path.join(projectDirectory, filePath);
	return existsSync(fullPath)
		? readFileSync(fullPath, "utf8")
		: undefined;
};

// Git lists the files, so every git ignore rule applies, the same way
// as the format scripts. Outside git, nothing is listed.
export const listProjectFiles = ({ projectDirectory }) => {
	try {
		const output = execFileSync(
			"git",
			["ls-files", "--cached", "--others", "--exclude-standard"],
			{ cwd: projectDirectory, encoding: "utf8" },
		);
		return output
			.split("\n")
			.filter((filePath) => filePath.length > 0)
			.filter((filePath) =>
				existsSync(path.join(projectDirectory, filePath)),
			);
	} catch {
		return [];
	}
};

// The text under one "## Heading" of a Markdown file, up to the next
// "## " heading.
export const readSection = ({ markdown, heading }) => {
	const lines = markdown.split("\n");
	const startIndex = lines.findIndex(
		(line) => line.trim() === `## ${heading}`,
	);
	if (startIndex === -1) {
		return "";
	}
	const sectionLines = [];
	const linesAfterHeading = lines.slice(startIndex + 1);
	for (const line of linesAfterHeading) {
		if (line.startsWith("## ")) {
			break;
		}
		sectionLines.push(line);
	}
	return sectionLines.join("\n").trim();
};

const hasContent = (sectionText) => {
	const words = sectionText
		.replaceAll(/[".]/g, "")
		.trim()
		.toLowerCase();
	return words.length > 0 && !NO_VALUE_WORDS.has(words);
};

export const readRecordedExceptions = ({ projectDirectory }) => {
	const markdown =
		readTextFile({
			projectDirectory,
			filePath: CODING_STANDARDS_PATH,
		}) ?? "";
	const details = readSection({ markdown, heading: "Details" });
	const standardNumbers = new Set(
		details
			.split("\n")
			.map((line) => STANDARD_NUMBER_PATTERN.exec(line)?.[1])
			.filter(Boolean),
	);
	const componentsSection = readSection({
		markdown,
		heading: "Components for the standards",
	});
	const unfinishedSection = readSection({
		markdown,
		heading: "Unfinished changes",
	});
	return {
		standardNumbers,
		componentsText: componentsSection.toLowerCase(),
		unfinishedChanges: hasContent(unfinishedSection)
			? unfinishedSection
			: undefined,
	};
};
