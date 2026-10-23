import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { checkAgentFiles } from "./checkAgentFiles.mjs";
import {
	createTestProject,
	TEMPLATES_DIRECTORY,
} from "./testProject.mjs";

const PACKAGE_MAJOR_VERSION = 3;
const OLDER_VERSION = 2;

const agentsFile = ({ version }) =>
	readFileSync(
		path.join(TEMPLATES_DIRECTORY, "AGENTS.md"),
		"utf8",
	).replace(
		/\*\*Code standards version:\*\*.*/,
		() => `**Code standards version:** ${version}`,
	);

const skillFiles = () =>
	Object.fromEntries(
		readdirSync(path.join(TEMPLATES_DIRECTORY, "skills")).flatMap(
			(skillName) => {
				const contents = readFileSync(
					path.join(TEMPLATES_DIRECTORY, "skills", skillName),
					"utf8",
				);
				return [
					[`.agents/skills/${skillName}`, contents],
					[`.claude/commands/${skillName}`, contents],
				];
			},
		),
	);

const check = (files) =>
	checkAgentFiles({
		projectDirectory: createTestProject({ files }),
		templatesDirectory: TEMPLATES_DIRECTORY,
		packageMajorVersion: PACKAGE_MAJOR_VERSION,
	});

describe("checkAgentFiles", () => {
	it("passes the template with its version filled in", () => {
		const findings = check({
			"AGENTS.md": agentsFile({ version: PACKAGE_MAJOR_VERSION }),
			...skillFiles(),
		});
		assert.deepEqual(findings, []);
	});

	it("allows project sections outside the markers", () => {
		const findings = check({
			"AGENTS.md": `<!-- Next.js block -->\n${agentsFile({ version: PACKAGE_MAJOR_VERSION })}\n## Our own notes\n`,
			...skillFiles(),
		});
		assert.deepEqual(findings, []);
	});

	it("flags an older version", () => {
		const findings = check({
			"AGENTS.md": agentsFile({ version: OLDER_VERSION }),
			...skillFiles(),
		});
		assert.match(findings[0].message, /Updating to a newer version/);
	});

	it("flags a rule edited inside the markers", () => {
		const findings = check({
			"AGENTS.md": agentsFile({
				version: PACKAGE_MAJOR_VERSION,
			}).replace("Arrow functions everywhere", "Any functions"),
			...skillFiles(),
		});
		assert.equal(findings.length, 1);
	});

	it("flags missing skills", () => {
		const findings = check({
			"AGENTS.md": agentsFile({ version: PACKAGE_MAJOR_VERSION }),
		});
		assert.ok(findings.length > 0);
		assert.ok(findings.every((finding) => finding.standard === "21"));
	});

	it("flags a missing AGENTS.md", () => {
		assert.equal(check({}).length, 1);
	});
});
