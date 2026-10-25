// Standard 21: AGENTS.md, its code standards section and version,
// and the agent skills.
import { readdirSync } from "node:fs";
import path from "node:path";

import { readTextFile } from "./projectFiles.mjs";

const SECTION_START = "<!-- code-standards:start -->";
const SECTION_END = "<!-- code-standards:end -->";
const VERSION_LINE_START = "**Code standards version:**";
const VERSION_PATTERN =
	/\*\*Code standards version:\*\*\s*(\d+(?:\.\d+){0,2})/;
const VERSION_PART_COUNT = 3;
const SKILL_FOLDERS = [".agents/skills", ".claude/commands"];
const PAGE = "docs/Standards/agent-specs.md";

// The text between the markers, without the version line: the project
// fills that line in, and everything else is copied unchanged.
const readStandardsSection = (agentsText) => {
	const startIndex = agentsText.indexOf(SECTION_START);
	const endIndex = agentsText.indexOf(SECTION_END);
	const hasMarkers = startIndex !== -1 && endIndex !== -1;
	return hasMarkers
		? agentsText
				.slice(startIndex + SECTION_START.length, endIndex)
				.replaceAll("\r\n", "\n")
				.split("\n")
				.filter((line) => !line.startsWith(VERSION_LINE_START))
				.join("\n")
				.trim()
		: undefined;
};

const toVersionParts = (version) =>
	Array.from({ length: VERSION_PART_COUNT }, (_unused, index) =>
		Number(version.split(".")[index] ?? 0),
	);

// Below zero when the project's version is older than the package's,
// above zero when it is newer, and zero when they match.
const compareVersions = ({ projectVersion, packageVersion }) => {
	const projectParts = toVersionParts(projectVersion);
	const packageParts = toVersionParts(packageVersion);
	const differentIndex = projectParts.findIndex(
		(part, index) => part !== packageParts[index],
	);
	return differentIndex === -1
		? 0
		: projectParts[differentIndex] - packageParts[differentIndex];
};

const checkVersion = ({ agentsText, packageVersion }) => {
	const match = VERSION_PATTERN.exec(agentsText);
	if (!match) {
		return [
			{
				standard: "21",
				message:
					"AGENTS.md has no code standards version. Set **Code standards version:** to the full version the code follows, such as 3.2.2",
				page: "docs/Guides/setup.md",
			},
		];
	}
	const projectVersion = match[1];
	if (projectVersion.split(".").length < VERSION_PART_COUNT) {
		return [
			{
				standard: "21",
				message: `AGENTS.md records version ${projectVersion}, not a full version. Record the full version the project last applied, such as 3.1.0: read the @activatus/code-standards version in pnpm-lock.yaml at the last commit that changed the version line, then update from there`,
				page: "docs/version-history.md#updating-a-project-to-a-new-version",
			},
		];
	}
	const comparison = compareVersions({
		projectVersion,
		packageVersion,
	});
	if (comparison < 0) {
		return [
			{
				standard: "21",
				message: `AGENTS.md says version ${projectVersion}, and the installed package is version ${packageVersion}. Follow "Updating to a newer version"`,
				page: "docs/Guides/setup.md#updating-to-a-newer-version",
			},
		];
	}
	if (comparison > 0) {
		return [
			{
				standard: "21",
				message: `AGENTS.md says version ${projectVersion}, newer than the installed package, version ${packageVersion}. Correct the version in AGENTS.md, or install the package with @latest`,
				page: "docs/Guides/setup.md#2-work-out-where-the-project-is",
			},
		];
	}
	return [];
};

const checkStandardsSection = ({
	agentsText,
	templatesDirectory,
}) => {
	const projectSection = readStandardsSection(agentsText);
	if (projectSection === undefined) {
		return [
			{
				standard: "21",
				message: `AGENTS.md has no ${SECTION_START} and ${SECTION_END} markers. Copy the Code standards section from the template, markers included`,
				page: PAGE,
			},
		];
	}
	const templateSection = readStandardsSection(
		readTextFile({
			projectDirectory: templatesDirectory,
			filePath: "AGENTS.md",
		}) ?? "",
	);
	if (projectSection === templateSection) {
		return [];
	}
	return [
		{
			standard: "21",
			message:
				"The Code standards section of AGENTS.md differs from the template. Copy it again, and record any project exception in docs/development/coding-standards.md instead",
			page: PAGE,
		},
	];
};

const checkSkills = ({ projectDirectory, templatesDirectory }) => {
	const skillNames = readdirSync(
		path.join(templatesDirectory, "skills"),
	);
	const findings = [];
	for (const folder of SKILL_FOLDERS) {
		for (const skillName of skillNames) {
			const template = readTextFile({
				projectDirectory: templatesDirectory,
				filePath: path.join("skills", skillName),
			});
			const projectSkill = readTextFile({
				projectDirectory,
				filePath: path.join(folder, skillName),
			});
			if (projectSkill === undefined) {
				findings.push({
					standard: "21",
					message: `${folder}/${skillName} is missing`,
					page: "docs/Standards/agent-skills.md",
				});
				continue;
			}
			if (projectSkill.trimEnd() !== template?.trimEnd()) {
				findings.push({
					standard: "21",
					message: `${folder}/${skillName} differs from the template`,
					page: "docs/Standards/agent-skills.md",
				});
			}
		}
	}
	return findings;
};

export const checkAgentFiles = ({
	projectDirectory,
	templatesDirectory,
	packageVersion,
}) => {
	const agentsText = readTextFile({
		projectDirectory,
		filePath: "AGENTS.md",
	});
	if (agentsText === undefined) {
		return [
			{
				standard: "21",
				message: "AGENTS.md is missing. Follow Setup",
				page: "docs/Guides/setup.md",
			},
		];
	}
	return [
		...checkVersion({ agentsText, packageVersion }),
		...checkStandardsSection({ agentsText, templatesDirectory }),
		...checkSkills({ projectDirectory, templatesDirectory }),
	];
};
