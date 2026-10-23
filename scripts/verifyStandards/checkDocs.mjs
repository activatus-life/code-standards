// Standard 18: every doc is a Decision Doc in the standard format.
import path from "node:path";

import { readTextFile } from "./projectFiles.mjs";

const DOC_PATTERN = /^docs\/(?!assets\/).+\.mdx?$/;
const TITLE_PATTERN = /^# (.+) — (.+)$/;
const STATUS_PATTERN =
	/^\*\*Status:\*\* (Not started|Under evaluation|Current plan|Decided) · \*\*Updated:\*\* /m;
const REQUIRED_SECTIONS = ["Decision", "Why", "Related"];
const CODE_FENCE = "```";
const PAGE = "docs/Standards/documentation.md#-the-doc-format";

// Headings inside code blocks are examples, not headings.
const readTopHeadings = (markdown) => {
	const headings = [];
	// eslint-disable-next-line no-restricted-syntax -- flips at each code fence while reading line by line
	let isInCodeBlock = false;
	for (const line of markdown.split("\n")) {
		if (line.startsWith(CODE_FENCE)) {
			isInCodeBlock = !isInCodeBlock;
			continue;
		}
		if (!isInCodeBlock && line.startsWith("# ")) {
			headings.push(line.trimEnd());
		}
	}
	return headings;
};

const toKebabCase = (text) =>
	text
		.toLowerCase()
		.replaceAll(/[^a-z0-9]+/g, "-")
		.replaceAll(/^-|-$/g, "");

const checkTitle = ({ filePath, headings }) => {
	if (headings.length !== 1) {
		return [
			`has ${headings.length} "#" headings. A doc has exactly one, its title`,
		];
	}
	const match = TITLE_PATTERN.exec(headings[0]);
	if (!match) {
		return [
			'has a title that is not in "Group — Menu item" form, such as "# Overview — What Is It"',
		];
	}
	const expectedFileName = toKebabCase(match[2]);
	const fileName = path.posix.parse(filePath).name;
	return fileName === expectedFileName
		? []
		: [
				`is named ${fileName}, but its menu item "${match[2]}" makes it ${expectedFileName}`,
			];
};

const checkDocument = ({ projectDirectory, filePath }) => {
	const markdown = readTextFile({ projectDirectory, filePath }) ?? "";
	const problems = [
		...checkTitle({ filePath, headings: readTopHeadings(markdown) }),
	];
	if (!STATUS_PATTERN.test(markdown)) {
		problems.push(
			"has no **Status:** · **Updated:** line with a standard status",
		);
	}
	const missingSections = REQUIRED_SECTIONS.filter(
		(section) => !markdown.includes(`\n## ${section}\n`),
	);
	if (missingSections.length > 0) {
		problems.push(`is missing ## ${missingSections.join(", ## ")}`);
	}
	return problems.map((problem) => ({
		standard: "18",
		message: `${filePath} ${problem}`,
		page: PAGE,
	}));
};

export const checkDocs = ({ projectDirectory, projectFiles }) =>
	projectFiles
		.filter((filePath) => DOC_PATTERN.test(filePath))
		.flatMap((filePath) =>
			checkDocument({ projectDirectory, filePath }),
		);
