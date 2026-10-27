// Standards 4 and 15: every function and component has a test file,
// and every components/ui/ component is on the Design System list.
import path from "node:path";

import { readTextFile } from "./projectFiles.mjs";

const SOURCE_FOLDERS = [
	"app/",
	"components/",
	"hooks/",
	"lib/",
	"services/",
	"utils/",
];
const SOURCE_FILE_PATTERN = /\.(ts|tsx|js|jsx)$/;
// Files that hold no function or component of their own.
const NO_TEST_NEEDED_PATTERN =
	/(\.test\.|\.stories\.|\.d\.ts$|\.config\.|\.types\.tsx?$|(^|\/)(index|types|constants)\.tsx?$)/;
// A file needs a test when it exports a function or a component.
// A file of data only, such as an illustration's points, does not.
const EXPORTS_FUNCTION_PATTERN =
	/export\s+(default\s+)?(async\s+)?function\b|export\s+const\s+\w+\s*(:[^=]+)?=\s*(async\s+)?(\([^)]*\)|\w+)\s*(:[^=]+)?=>/;
const UI_FOLDER_PATTERN = /^components\/ui\/([^/]+)\//;
const LISTED_COMPONENT_PATTERN = /^\|\s*\d+\s*\|\s*\*\*(.+?)\*\*/;

// "Spacer / Divider" → ["spacerdivider", "spacer", "divider"]
const toComparableNames = (componentName) => {
	const parts = componentName.split("/");
	return [componentName, ...parts].map((name) =>
		name.toLowerCase().replaceAll(/[^a-z0-9]/g, ""),
	);
};

const toComparableName = (folderName) =>
	folderName.toLowerCase().replaceAll(/[^a-z0-9]/g, "");

const readListedComponents = ({ standardsDocsDirectory }) => {
	const markdown =
		readTextFile({
			projectDirectory: standardsDocsDirectory,
			filePath: "design-system-components.md",
		}) ?? "";
	return new Set(
		markdown
			.split("\n")
			.map((line) => LISTED_COMPONENT_PATTERN.exec(line)?.[1])
			.filter(Boolean)
			.flatMap((componentName) => toComparableNames(componentName)),
	);
};

const checkUiComponents = ({
	projectFiles,
	standardsDocsDirectory,
	recordedExceptions,
}) => {
	const listedComponents = readListedComponents({
		standardsDocsDirectory,
	});
	const recordedComponents = toComparableName(
		recordedExceptions.componentsText,
	);
	const uiFolders = new Set(
		projectFiles
			.map((filePath) => UI_FOLDER_PATTERN.exec(filePath)?.[1])
			.filter(Boolean),
	);
	return [...uiFolders]
		.filter(
			(folder) =>
				!listedComponents.has(toComparableName(folder)) &&
				!recordedComponents.includes(toComparableName(folder)),
		)
		.map((folder) => ({
			standard: "15",
			file: `components/ui/${folder}/`,
			message: `components/ui/${folder} is not on the Design System Components list. If it takes everything through props, record it under "Components for the standards" in docs/development/coding-standards.md; otherwise move it out of components/ui/`,
			page: "docs/design-system-components.md",
		}));
};

const isSourceFile = (filePath) =>
	SOURCE_FOLDERS.some((folder) => filePath.startsWith(folder)) &&
	SOURCE_FILE_PATTERN.test(filePath) &&
	!NO_TEST_NEEDED_PATTERN.test(filePath) &&
	!filePath.startsWith("lib/constants/") &&
	!filePath.startsWith("lib/types/");

const findTestFile = ({ filePath, projectFileSet }) => {
	const { dir, name } = path.posix.parse(filePath);
	return [".ts", ".tsx", ".js", ".jsx"].some((extension) =>
		projectFileSet.has(
			path.posix.join(dir, `${name}.test${extension}`),
		),
	);
};

const doesExportFunction = ({ projectDirectory, filePath }) =>
	EXPORTS_FUNCTION_PATTERN.test(
		readTextFile({ projectDirectory, filePath }) ?? "",
	);

const checkTestFiles = ({ projectDirectory, projectFiles }) => {
	const projectFileSet = new Set(projectFiles);
	return projectFiles
		.filter((filePath) => isSourceFile(filePath))
		.filter((filePath) =>
			doesExportFunction({ projectDirectory, filePath }),
		)
		.filter((filePath) => !findTestFile({ filePath, projectFileSet }))
		.map((filePath) => ({
			standard: "4",
			file: filePath,
			message: `${filePath} has no test file beside it`,
			page: "docs/Standards/readable-code.md#every-function-and-component-has-a-test-file",
		}));
};

export const checkComponents = ({
	projectDirectory,
	projectFiles,
	standardsDocsDirectory,
	recordedExceptions,
}) => [
	...checkUiComponents({
		projectFiles,
		standardsDocsDirectory,
		recordedExceptions,
	}),
	...checkTestFiles({ projectDirectory, projectFiles }),
];
