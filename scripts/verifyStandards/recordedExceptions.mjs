// Reads the exceptions a project has recorded in
// docs/development/coding-standards.md: which standards it skips or
// changes, for which files, and what is left unfinished.
import { readFileSync } from "node:fs";
import path from "node:path";

import {
	CODING_STANDARDS_PATH,
	PACKAGE_DIRECTORY,
	readSection,
	readTextFile,
} from "./projectFiles.mjs";

const NO_VALUE_WORDS = new Set(["none", "no differences"]);

// Any line that starts with a number, which is read as a standard
// number: "7. Prettier", "- 12.1. Constants", "**6. ESLint**".
const NUMBERED_LINE_PATTERN =
	/^\s*(?:[-*]\s+)?(?:\*\*)?(\d+(?:\.\d+)?)\.\s/;

// A recorded exception, named as in the setup list: "7. Prettier —
// skipped: the project uses Biome", or "4. Every function and
// component has a test file — changed for `app/api/**`: legacy code".
const EXCEPTION_PATTERN =
	/^\s*(?:[-*]\s+)?(?:\*\*)?(\d+(?:\.\d+)?)\.\s+(.+?)(?:\*\*)?\s+[—–-]+\s+(?:\*\*)?(?:skipped|changed)\b(.*)$/i;

const FILES_CLAUSE_PATTERN = /^\s*for\s+([^:]+)/i;
const INLINE_CODE_PATTERN = /`([^`]+)`/g;
const SETUP_LIST_START = "These are the Activatus Code Standards.";
const SETUP_LIST_ITEM_PATTERN = /^\s*(\d+(?:\.\d+)?)\.\s+([^:,]+)/;

// Lowercase letters and digits only, so "ESLint" and "eslint," match.
const toComparableName = (name) =>
	name.toLowerCase().replaceAll(/[^a-z\d]/g, "");

// The standard names, by number, from the list in
// docs/Guides/setup.md that a project records its choices against.
const readStandardNames = () => {
	const setupText = readFileSync(
		path.join(PACKAGE_DIRECTORY, "docs/Guides/setup.md"),
		"utf8",
	);
	const lines = setupText.split("\n");
	const startIndex = lines.findIndex((line) =>
		line.startsWith(SETUP_LIST_START),
	);
	const listLines = lines.slice(startIndex + 1);
	const endIndex = listLines.findIndex((line) =>
		line.startsWith("```"),
	);
	return new Map(
		listLines
			.slice(0, endIndex)
			.map((line) => SETUP_LIST_ITEM_PATTERN.exec(line))
			.filter(Boolean)
			.map((match) => [match[1], match[2].trim()]),
	);
};

// The files after "for", each in backticks. Undefined when there is a
// "for" but no file in backticks: read as no files, it would cover the
// whole standard.
const readFileGlobs = (textAfterVerb) => {
	const filesClause = FILES_CLAUSE_PATTERN.exec(textAfterVerb)?.[1];
	if (filesClause === undefined) {
		return [];
	}
	const fileGlobs = Array.from(
		filesClause.matchAll(INLINE_CODE_PATTERN),
		(match) => match[1],
	);
	return fileGlobs.length > 0 ? fileGlobs : undefined;
};

// One line under Details: an exception, a line that looks like one
// but is not read as one, or anything else.
const readDetailsLine = ({ line, standardNames }) => {
	const standard = NUMBERED_LINE_PATTERN.exec(line)?.[1];
	if (standard === undefined) {
		return {};
	}
	const match = EXCEPTION_PATTERN.exec(line);
	if (match === null) {
		return {
			unreadLine: `"${line.trim()}" starts with a number, so it reads as standard ${standard}, but it is not shaped like an exception: "${standard}. Name — skipped: reason". Write it as an exception, or start the line without a number`,
		};
	}
	const standardName = standardNames.get(standard);
	const recordedName = toComparableName(match[2]);
	if (
		standardName === undefined ||
		!toComparableName(standardName).startsWith(recordedName)
	) {
		return {
			unreadLine: `"${line.trim()}" names standard ${standard}, which is ${standardName === undefined ? "not on the standards list" : `"${standardName}"`}. Use the number and name from the list in docs/Guides/setup.md`,
		};
	}
	const fileGlobs = readFileGlobs(match[3]);
	if (fileGlobs === undefined) {
		return {
			unreadLine: `"${line.trim()}" names files after "for", but none in backticks, so it would cover every file. Put each path in backticks: for \`app/api/**\``,
		};
	}
	return { exception: { standard, fileGlobs } };
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
	const standardNames = readStandardNames();
	const detailsLines = readSection({ markdown, heading: "Details" })
		.split("\n")
		.map((line) => readDetailsLine({ line, standardNames }));
	const componentsSection = readSection({
		markdown,
		heading: "Components for the standards",
	});
	const unfinishedSection = readSection({
		markdown,
		heading: "Unfinished changes",
	});
	return {
		exceptions: detailsLines
			.map(({ exception }) => exception)
			.filter(Boolean),
		unreadLines: detailsLines
			.map(({ unreadLine }) => unreadLine)
			.filter(Boolean),
		componentsText: componentsSection.toLowerCase(),
		unfinishedChanges: hasContent(unfinishedSection)
			? unfinishedSection
			: undefined,
	};
};

const escapeForPattern = (text) =>
	text.replaceAll(/[.+^${}()|[\]\\]/g, String.raw`\$&`);

// "app/api/**" matches every file under app/api/, "*" stays inside
// one folder, and a glob ending in "/" means the whole folder.
const toGlobPattern = (fileGlob) => {
	const fullGlob = fileGlob.endsWith("/")
		? `${fileGlob}**`
		: fileGlob;
	const pattern = escapeForPattern(fullGlob)
		.replaceAll("**", "\0")
		.replaceAll("*", "[^/]*")
		.replaceAll("?", "[^/]")
		.replaceAll("\0", ".*");
	return new RegExp(`^${pattern}$`);
};

// A finding is recorded when an exception covers its standard, and,
// if the exception names files, the finding's file is one of them.
export const isRecordedFinding = ({ finding, exceptions }) =>
	exceptions
		.filter((exception) => exception.standard === finding.standard)
		.some(
			(exception) =>
				exception.fileGlobs.length === 0 ||
				(finding.file !== undefined &&
					exception.fileGlobs.some((fileGlob) =>
						toGlobPattern(fileGlob).test(finding.file),
					)),
		);
