// Standards 18 and 21: the docs every project has.
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

import { CODING_STANDARDS_PATH } from "./projectFiles.mjs";

// Setup renames this file after the project: what-is-launchpad.md.
const RENAMED_OVERVIEW_PATH = "overview/what-is-it.md";
const RENAMED_OVERVIEW_PATTERN = /^docs\/overview\/what-is-.+\.md$/;

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
	];
};
