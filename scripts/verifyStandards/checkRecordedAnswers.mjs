// What setup asks the person and writes down: the four agent answers
// (standard 21) and the colour palette (standard 11).
import {
	CODING_STANDARDS_PATH,
	readSection,
	readTextFile,
} from "./projectFiles.mjs";

const DESIGN_SYSTEM_PATH = "docs/design/design-system.md";
const AGENT_ANSWERS = [
	{ name: "the GitHub repo", pattern: /github/i },
	{ name: "the Linear project", pattern: /linear/i },
	{ name: "the status circles", pattern: /status circles?/i },
	{ name: "asking before committing", pattern: /commit/i },
];
// The template's unfilled line: "[link or None]", "[yes or no]".
const UNFILLED_ANSWER_PATTERN = /\[[^\]]+ or [^\]]+\]/;
const TABLE_ROW_PATTERN = /^\|/;
const TABLE_SEPARATOR_PATTERN = /^\|[\s:|-]+\|$/;
const PLACEHOLDER_ROW_PATTERN = /^\|\s*\[/;
// The header row comes before the separator.
const HEADER_ROW_COUNT = 1;

const checkAgentAnswers = ({ projectDirectory }) => {
	const markdown = readTextFile({
		projectDirectory,
		filePath: CODING_STANDARDS_PATH,
	});
	if (markdown === undefined) {
		return [];
	}
	const details = readSection({ markdown, heading: "Details" })
		.split("\n")
		.filter((line) => !UNFILLED_ANSWER_PATTERN.test(line))
		.join("\n");
	return AGENT_ANSWERS.filter(
		({ pattern }) => !pattern.test(details),
	).map(({ name }) => ({
		standard: "21",
		message: `${CODING_STANDARDS_PATH} does not record ${name} under "Details". Ask the person, and write their answer down, even if it is "None" or "No"`,
		page: "docs/Guides/setup.md#4-working-with-the-agent",
	}));
};

const readPaletteRows = ({ section }) =>
	section
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => TABLE_ROW_PATTERN.test(line))
		.filter((line) => !TABLE_SEPARATOR_PATTERN.test(line))
		.slice(HEADER_ROW_COUNT);

const checkPalette = ({ projectDirectory }) => {
	const markdown = readTextFile({
		projectDirectory,
		filePath: DESIGN_SYSTEM_PATH,
	});
	if (markdown === undefined) {
		return [];
	}
	const section = readSection({
		markdown,
		heading: "Colour palette",
	});
	const rows = readPaletteRows({ section });
	const isFilledIn =
		rows.length > 0 &&
		rows.every((row) => !PLACEHOLDER_ROW_PATTERN.test(row));
	return isFilledIn
		? []
		: [
				{
					standard: "11",
					message: `${DESIGN_SYSTEM_PATH} has no filled-in "## Colour palette" table. List each colour, its value, its class names and what it is for`,
					page: "docs/Standards/styling.md#-colours-always-come-from-global-variables",
				},
			];
};

export const checkRecordedAnswers = ({ projectDirectory }) => [
	...checkAgentAnswers({ projectDirectory }),
	...checkPalette({ projectDirectory }),
];
