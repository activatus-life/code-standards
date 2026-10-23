// Runs every check, and separates the findings for standards the
// project has recorded as skipped or changed.
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
	readRecordedExceptions,
} from "./projectFiles.mjs";

const readPackageMajorVersion = () => {
	const packageText = readFileSync(
		path.join(PACKAGE_DIRECTORY, "package.json"),
		"utf8",
	);
	const [majorVersion] = JSON.parse(packageText).version.split(
		".",
		1,
	);
	return Number(majorVersion);
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
			packageMajorVersion: readPackageMajorVersion(),
		}),
		...checkConfigFiles({ projectDirectory, templatesDirectory }),
		...checkRequiredFiles({ templatesDirectory, projectFiles }),
		...checkConstants({ projectDirectory, projectFiles }),
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
		recordedExceptions.standardNumbers.has(finding.standard);
	return {
		failures: findings.filter((finding) => !isRecorded(finding)),
		recorded: findings.filter((finding) => isRecorded(finding)),
		unfinishedChanges: recordedExceptions.unfinishedChanges,
	};
};
