// Standard 21: AGENTS.md, its code standards section and version,
// and the agent skills.
import { readdirSync } from "node:fs";
import path from "node:path";

import { readTextFile } from "./projectFiles.mjs";

const SECTION_START = "<!-- code-standards:start -->";
const SECTION_END = "<!-- code-standards:end -->";
const VERSION_LINE_START = "**Code standards version:**";
const VERSION_PATTERN = /\*\*Code standards version:\*\*\s*(\d+)/;
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

const checkVersion = ({ agentsText, packageMajorVersion }) => {
	const match = VERSION_PATTERN.exec(agentsText);
	if (!match) {
		return [
			{
				standard: "21",
				message:
					"AGENTS.md has no code standards version. Set **Code standards version:** to the major version the code follows",
				page: "docs/Guides/setup.md",
			},
		];
	}
	const projectVersion = Number(match[1]);
	if (projectVersion < packageMajorVersion) {
		return [
			{
				standard: "21",
				message: `AGENTS.md says version ${projectVersion}, and the installed package is version ${packageMajorVersion}. Follow "Updating to a newer version"`,
				page: "docs/Guides/setup.md#updating-to-a-newer-version",
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
	packageMajorVersion,
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
		...checkVersion({ agentsText, packageMajorVersion }),
		...checkStandardsSection({ agentsText, templatesDirectory }),
		...checkSkills({ projectDirectory, templatesDirectory }),
	];
};
