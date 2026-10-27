// Turns the findings into the report printed for the person or agent:
// grouped by standard, with the page to read for each.
import path from "node:path";

import { PACKAGE_DIRECTORY } from "./projectFiles.mjs";

// The names from the numbered list in docs/Guides/setup.md.
export const STANDARD_NAMES = {
	4: "Every function and component has a test file",
	6: "ESLint",
	7: "Prettier",
	8: "Stylelint",
	9: "EditorConfig",
	10: "Node version",
	11: "Styling",
	12.1: "Constants",
	13: "Components live where they are used",
	15: "Design System Components",
	18: "Docs",
	21: "AGENTS.md and the agent skills",
};

const toPagePath = ({ page, projectDirectory }) =>
	path.relative(projectDirectory, path.join(PACKAGE_DIRECTORY, page));

const formatStandard = ({ standard, findings, projectDirectory }) => {
	const standardFindings = findings.filter(
		(finding) => finding.standard === standard,
	);
	const lines = standardFindings.map(
		(finding) => `  - ${finding.message}`,
	);
	const pages = [
		...new Set(
			standardFindings.map((finding) => finding.page).filter(Boolean),
		),
	].map(
		(page) => `  Read: ${toPagePath({ page, projectDirectory })}`,
	);
	const heading = `${standard}. ${STANDARD_NAMES[standard] ?? ""}`;
	return [heading, ...lines, ...pages].join("\n");
};

const formatGroup = ({ findings, projectDirectory }) => {
	const standards = [
		...new Set(findings.map((finding) => finding.standard)),
	];
	return standards
		.map((standard) =>
			formatStandard({ standard, findings, projectDirectory }),
		)
		.join("\n\n");
};

export const formatReport = ({ result, projectDirectory }) => {
	const sections = [];
	if (result.failures.length > 0) {
		sections.push(
			`To fix (${result.failures.length}):\n\n${formatGroup({ findings: result.failures, projectDirectory })}`,
		);
	}
	if (result.recorded.length > 0) {
		sections.push(
			`Recorded exceptions in docs/development/coding-standards.md. Check each one matches what was agreed (${result.recorded.length}):\n\n${formatGroup({ findings: result.recorded, projectDirectory })}`,
		);
	}
	if (result.unfinishedChanges) {
		sections.push(
			`Unfinished changes, from docs/development/coding-standards.md. If none are left, the section says only "None":\n\n${result.unfinishedChanges}`,
		);
	}
	if (result.failures.length === 0) {
		sections.push(
			"The project follows the code standards, with its recorded exceptions.",
		);
	}
	return sections.join("\n\n---\n\n");
};
