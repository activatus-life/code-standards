// Standard 12.1: lib/constants/ holds the seven standard files and
// nothing else, and no component keeps its own constants file.
import { readTextFile } from "./projectFiles.mjs";

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
const EXPORT_PATTERN =
	/^export const ([\w$]+)\s*(?::[^=]+)?=\s*(\S)/gm;
const MAXIMUM_NAMES_SHOWN = 3;
const PAGE = "docs/Structure/folder-structure.md#constants";

const UNSURE_HOME = "the file the Constants table names";

// The name says what most exports are; the first character of the
// value settles the rest. Checked in this order.
const NAME_HOMES = [
	{ pattern: /CLASS_NAMES?$/, home: "classNames.ts" },
	{
		pattern:
			/MOTION|ANIMATION|ENTRANCE|SCROLL|DRIFT|ZOOM|EASE|SPRING|TRANSITION|KEYFRAME|QUERY|QUERIES/,
		home: "animation.ts",
	},
	{
		pattern:
			/ARTWORK|LAYOUT|SHAPE|PATH|CANVAS|TILE|IMAGE|PIECE|GEOMETRY|SVG/,
		home: "artwork.ts",
	},
	{ pattern: /ROUTE|HREF|LINK|URL/, home: "r in routes.ts" },
	{ pattern: /^NO_DATA_|^DUMMY_/, home: "noData.ts" },
	// Raw CSS is not text for s, and not a class name.
	{ pattern: /STYLES?$/, home: UNSURE_HOME },
];
const VALUE_HOMES = [
	{ pattern: /[\d-]/, home: "numbers.ts" },
	{ pattern: /["'`]/, home: "s in strings.ts" },
];

const findHome = ({ name, valueStart }) =>
	NAME_HOMES.find(({ pattern }) => pattern.test(name))?.home ??
	VALUE_HOMES.find(({ pattern }) => pattern.test(valueStart))?.home ??
	UNSURE_HOME;

const describeNames = (names) => {
	const shown = names.slice(0, MAXIMUM_NAMES_SHOWN).join(", ");
	const hiddenCount = names.length - MAXIMUM_NAMES_SHOWN;
	return hiddenCount > 0 ? `${shown} and ${hiddenCount} more` : shown;
};

// "Move CONFIDENCE_MOTION to animation.ts; CARD_FACE_CLASS_NAME to
// classNames.ts".
const suggestHomes = ({ projectDirectory, filePath }) => {
	const source = readTextFile({ projectDirectory, filePath }) ?? "";
	// Map.groupBy needs Node 21, and the package supports Node 20.
	const namesByHome = new Map();
	for (const [, name, valueStart] of source.matchAll(
		EXPORT_PATTERN,
	)) {
		const home = findHome({ name, valueStart });
		namesByHome.set(home, [...(namesByHome.get(home) ?? []), name]);
	}
	const moves = [...namesByHome].map(
		([home, names]) => `${describeNames(names)} to ${home}`,
	);
	return moves.length > 0
		? `Move ${moves.join("; ")}`
		: "Move its values into the seven files in lib/constants/";
};

const checkMissingFiles = ({ projectFileSet }) =>
	REQUIRED_FILES.filter(
		(filePath) => !projectFileSet.has(filePath),
	).map((filePath) => ({
		standard: "12.1",
		message: `${filePath} is missing`,
		page: PAGE,
	}));

const checkExtraFiles = ({ projectDirectory, projectFiles }) => {
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
			message: `${filePath} is not one of the seven constants files. ${suggestHomes({ projectDirectory, filePath })}`,
			page: PAGE,
		}));
};

const checkComponentFiles = ({ projectDirectory, projectFiles }) =>
	projectFiles
		.filter((filePath) => !filePath.startsWith(CONSTANTS_FOLDER))
		.filter((filePath) => !filePath.startsWith("node_modules/"))
		.filter((filePath) => COMPONENT_CONSTANTS_PATTERN.test(filePath))
		.map((filePath) => ({
			standard: "12.1",
			message: `${filePath}: there is no component-level constants file. ${suggestHomes({ projectDirectory, filePath })}`,
			page: PAGE,
		}));

export const checkConstants = ({
	projectDirectory,
	projectFiles,
}) => [
	...checkMissingFiles({ projectFileSet: new Set(projectFiles) }),
	...checkExtraFiles({ projectDirectory, projectFiles }),
	...checkComponentFiles({ projectDirectory, projectFiles }),
];
