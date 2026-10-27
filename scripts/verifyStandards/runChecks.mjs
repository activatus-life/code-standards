// Runs every check, and separates the findings the project has
// recorded as skipped or changed.
import { readFileSync } from "node:fs";
import path from "node:path";

import { checkAgentFiles } from "./checkAgentFiles.mjs";
import { checkComponents } from "./checkComponents.mjs";
import { checkConfigFiles } from "./checkConfigFiles.mjs";
import { checkDocs } from "./checkDocs.mjs";
import { checkConstants } from "./checkConstants.mjs";
import { checkRecordedAnswers } from "./checkRecordedAnswers.mjs";
import { checkRequiredFiles } from "./checkRequiredFiles.mjs";
import { checkStructure } from "./checkStructure.mjs";
import {
	listProjectFiles,
	PACKAGE_DIRECTORY,
} from "./projectFiles.mjs";
import {
	isRecordedFinding,
	readRecordedExceptions,
} from "./recordedExceptions.mjs";

const readPackageVersion = () => {
	const packageText = readFileSync(
		path.join(PACKAGE_DIRECTORY, "package.json"),
		"utf8",
	);
	return JSON.parse(packageText).version;
};

export const runChecks = ({ projectDirectory }) => {
	const templatesDirectory = path.join(
		PACKAGE_DIRECTORY,
		"static/templates",
	);
	const standardsDocsDirectory = path.join(PACKAGE_DIRECTORY, "docs");
	const projectFiles = listProjectFiles({ projectDirectory });
	const recordedExceptions = readRecordedExceptions({
		projectDirectory,
	});
	const findings = [
		...checkAgentFiles({
			projectDirectory,
			templatesDirectory,
			packageVersion: readPackageVersion(),
		}),
		...checkConfigFiles({ projectDirectory, templatesDirectory }),
		...checkRequiredFiles({ templatesDirectory, projectFiles }),
		...checkConstants({ projectFiles }),
		...checkStructure({ projectFiles }),
		...checkRecordedAnswers({ projectDirectory }),
		...checkComponents({
			projectDirectory,
			projectFiles,
			standardsDocsDirectory,
			recordedExceptions,
		}),
		...checkDocs({ projectDirectory, projectFiles }),
	];
	const isRecorded = (finding) =>
		isRecordedFinding({
			finding,
			exceptions: recordedExceptions.exceptions,
		});
	// A line misread as an exception could hide any standard, so it is
	// never hidden itself.
	const unreadLineFindings = recordedExceptions.unreadLines.map(
		(unreadLine) => ({
			standard: "21",
			message: `Under "Details" in docs/development/coding-standards.md: ${unreadLine}`,
			page: "docs/Guides/setup.md#3-agree-the-standards",
		}),
	);
	return {
		failures: [
			...unreadLineFindings,
			...findings.filter((finding) => !isRecorded(finding)),
		],
		recorded: findings.filter((finding) => isRecorded(finding)),
		unfinishedChanges: recordedExceptions.unfinishedChanges,
	};
};
