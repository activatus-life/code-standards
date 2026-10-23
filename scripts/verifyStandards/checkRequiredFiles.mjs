// Standards 12.1 and 18: the files every project has.
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

import { CODING_STANDARDS_PATH } from "./projectFiles.mjs";

const CONSTANTS_FILES = [
	"lib/constants/index.ts",
	"lib/constants/routes.ts",
	"lib/constants/strings.ts",
	"lib/constants/numbers.ts",
];
// Setup renames this file after the project: what-is-launchpad.md.
const RENAMED_OVERVIEW_PATH = "overview/what-is-it.md";
const RENAMED_OVERVIEW_PATTERN = /^docs\/overview\/what-is-.+\.md$/;
const COMPONENT_CONSTANTS_PATTERN = /(^|\/)constants\.tsx?$/;

const listTemplateDocs = ({ directory, prefix = "" }) =>
	readdirSync(directory).flatMap((entry) => {
		const entryPath = path.join(directory, entry);
		const relativePath = path.posix.join(prefix, entry);
		return statSync(entryPath).isDirectory()
			? listTemplateDocs({
					directory: entryPath,
					prefix: relativePath,
				})
			: [relativePath];
	});

const checkDocsFiles = ({ templatesDirectory, projectFiles }) => {
	const projectFileSet = new Set(projectFiles);
	const templateDocuments = listTemplateDocs({
		directory: path.join(templatesDirectory, "docs"),
	});
	const isOverviewRenamed = projectFiles.some((filePath) =>
		RENAMED_OVERVIEW_PATTERN.test(filePath),
	);
	return templateDocuments
		.filter(
			(templateDocument) =>
				!projectFileSet.has(`docs/${templateDocument}`),
		)
		.filter(
			(templateDocument) =>
				!(
					templateDocument === RENAMED_OVERVIEW_PATH &&
					isOverviewRenamed
				),
		)
		.map((templateDocument) => ({
			standard: "18",
			message: `docs/${templateDocument} is missing. Copy it from the doc templates`,
			page: "docs/Standards/documentation.md#every-file-exists-from-the-start",
		}));
};

const checkConstantsFiles = ({ projectFiles }) => {
	const projectFileSet = new Set(projectFiles);
	const missing = CONSTANTS_FILES.filter(
		(filePath) => !projectFileSet.has(filePath),
	).map((filePath) => ({
		standard: "12.1",
		message: `${filePath} is missing`,
		page: "docs/Structure/folder-structure.md#constants",
	}));
	const componentConstants = projectFiles
		.filter((filePath) => !filePath.startsWith("lib/constants/"))
		.filter((filePath) => !filePath.startsWith("node_modules/"))
		.filter((filePath) => COMPONENT_CONSTANTS_PATTERN.test(filePath))
		.map((filePath) => ({
			standard: "12.1",
			message: `${filePath}: there is no component-level constants file. Move its values into r, s and numbers.ts in lib/constants/`,
			page: "docs/Structure/folder-structure.md#constants",
		}));
	return [...missing, ...componentConstants];
};

export const checkRequiredFiles = ({
	templatesDirectory,
	projectFiles,
}) => {
	const codingStandards = projectFiles.includes(CODING_STANDARDS_PATH)
		? []
		: [
				{
					standard: "21",
					message: `${CODING_STANDARDS_PATH} is missing. It records the standards this project skips or changes`,
					page: "docs/Guides/setup.md#3-agree-the-standards",
				},
			];
	return [
		...codingStandards,
		...checkDocsFiles({ templatesDirectory, projectFiles }),
		...checkConstantsFiles({ projectFiles }),
	];
};
