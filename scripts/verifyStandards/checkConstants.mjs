// Standard 12.1: lib/constants/ holds the seven standard files and
// nothing else, and no component keeps its own constants file.
const REQUIRED_FILES = [
	"lib/constants/index.ts",
	"lib/constants/routes.ts",
	"lib/constants/strings.ts",
	"lib/constants/numbers.ts",
];
// Created only once the project has something to put in them.
const OPTIONAL_FILES = [
	"lib/constants/noData.ts",
	"lib/constants/animation.ts",
	"lib/constants/artwork.ts",
	"lib/constants/classNames.ts",
];
const CONSTANTS_FOLDER = "lib/constants/";
const COMPONENT_CONSTANTS_PATTERN = /(^|\/)constants\.tsx?$/;
const CODE_FILE_PATTERN = /\.(?:ts|tsx|js|mjs)$/;
const PAGE = "docs/Structure/folder-structure.md#constants";
// Where each value goes is the project's call, made from the table.
const NEXT_STEP =
	"Move each of its values into the file the Constants table says fits, and record any value that fits none in docs/development/coding-standards.md";

const checkMissingFiles = ({ projectFileSet }) =>
	REQUIRED_FILES.filter(
		(filePath) => !projectFileSet.has(filePath),
	).map((filePath) => ({
		standard: "12.1",
		message: `${filePath} is missing`,
		page: PAGE,
	}));

const checkExtraFiles = ({ projectFiles }) => {
	const standardFiles = new Set([
		...REQUIRED_FILES,
		...OPTIONAL_FILES,
	]);
	return projectFiles
		.filter((filePath) => filePath.startsWith(CONSTANTS_FOLDER))
		.filter((filePath) => CODE_FILE_PATTERN.test(filePath))
		.filter((filePath) => !filePath.includes(".test."))
		.filter((filePath) => !standardFiles.has(filePath))
		.map((filePath) => ({
			standard: "12.1",
			message: `${filePath} is not one of the seven constants files. ${NEXT_STEP}`,
			page: PAGE,
		}));
};

const checkComponentFiles = ({ projectFiles }) =>
	projectFiles
		.filter((filePath) => !filePath.startsWith(CONSTANTS_FOLDER))
		.filter((filePath) => !filePath.startsWith("node_modules/"))
		.filter((filePath) => COMPONENT_CONSTANTS_PATTERN.test(filePath))
		.map((filePath) => ({
			standard: "12.1",
			message: `${filePath}: there is no component-level constants file. ${NEXT_STEP}`,
			page: PAGE,
		}));

export const checkConstants = ({ projectFiles }) => [
	...checkMissingFiles({ projectFileSet: new Set(projectFiles) }),
	...checkExtraFiles({ projectFiles }),
	...checkComponentFiles({ projectFiles }),
];
