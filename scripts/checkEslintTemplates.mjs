// Checks the ESLint templates before they reach a project:
// 1. Each template passes its own rules.
// 2. The Next.js template lets route.ts take (request, context),
//    and still stops two parameters everywhere else.
// 3. The ESLint page shows each template exactly as it is.
//
// Run: pnpm check:eslint-templates
// Copy the templates into the ESLint page: add --update-docs
import { ESLint } from "eslint";
import {
	copyFile,
	mkdir,
	readFile,
	writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoDirectory = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const templatesDirectory = path.join(
	repoDirectory,
	"static/templates/eslint",
);
const nextjsFixtureDirectory = path.join(
	repoDirectory,
	"scripts/eslintTemplateFixtures/nextjs",
);
const eslintPagePath = path.join(
	repoDirectory,
	"docs/Standards/eslint.md",
);
// In a project, eslint.config.mjs and eslint.overrides.mjs sit side
// by side. Here the templates sit in their own folders, so each is
// copied beside the overrides template before it is loaded. Inside
// node_modules, so the configs still find this repo's packages.
const stagedDirectory = path.join(
	repoDirectory,
	"node_modules/.cache/eslintTemplates",
);
const overridesTemplatePath = path.join(
	repoDirectory,
	"static/templates/eslint.overrides.mjs",
);
const shouldUpdateDocs = process.argv.includes("--update-docs");

const TEMPLATES = [
	{ name: "base", heading: "### Base (JavaScript / Node.js)" },
	{ name: "typescript", heading: "### TypeScript" },
	{ name: "react", heading: "### React + TypeScript" },
	{ name: "nextjs", heading: "### Next.js" },
];
const CONFIG_FILE_NAME = "eslint.config.mjs";
const OVERRIDES_FILE_NAME = "eslint.overrides.mjs";
const CODE_BLOCK_START = '```js title="eslint.config.mjs"\n';
const CODE_BLOCK_END = "\n```";

const getTemplatePath = (templateName) =>
	path.join(templatesDirectory, templateName, CONFIG_FILE_NAME);

const getStagedPath = (templateName) =>
	path.join(stagedDirectory, templateName, CONFIG_FILE_NAME);

const stageTemplate = async (templateName) => {
	const folder = path.join(stagedDirectory, templateName);
	await mkdir(folder, { recursive: true });
	await copyFile(
		getTemplatePath(templateName),
		getStagedPath(templateName),
	);
	await copyFile(
		overridesTemplatePath,
		path.join(folder, OVERRIDES_FILE_NAME),
	);
};

// A project has one config. This script loads four in one process,
// so typescript-eslint is told each one's folder. The Next.js rules
// look for an app folder, so they are pointed at the fixture.
const createLinter = ({ templateName, workingDirectory }) =>
	new ESLint({
		cwd: workingDirectory,
		overrideConfigFile: getStagedPath(templateName),
		overrideConfig: {
			settings: { next: { rootDir: nextjsFixtureDirectory } },
			...(templateName !== "base" && {
				languageOptions: {
					parserOptions: { tsconfigRootDir: workingDirectory },
				},
			}),
		},
	});

const describeProblems = (results) =>
	results.flatMap((result) =>
		result.messages.map(
			(message) =>
				`  ${path.relative(repoDirectory, result.filePath)}:${message.line}:${message.column} ${message.message} (${message.ruleId})`,
		),
	);

const lintTemplateAgainstItself = async (templateName) => {
	const linter = createLinter({
		templateName,
		workingDirectory: path.join(stagedDirectory, templateName),
	});
	const results = await linter.lintFiles([
		CONFIG_FILE_NAME,
		OVERRIDES_FILE_NAME,
	]);
	return describeProblems(results).map(
		(problem) => `${templateName} fails its own rules:\n${problem}`,
	);
};

const checkNextjsRouteHandlers = async () => {
	const linter = createLinter({
		templateName: "nextjs",
		workingDirectory: nextjsFixtureDirectory,
	});
	const [routeResult, otherFileResult] = await linter.lintFiles([
		"app/api/example/route.ts",
		"app/api/example/handleRequest.ts",
	]);
	const failures = describeProblems([routeResult]).map(
		(problem) =>
			`nextjs should allow (request, context) in route.ts:\n${problem}`,
	);
	const isTwoParametersStopped = otherFileResult.messages.some(
		(message) => message.ruleId === "no-restricted-syntax",
	);
	if (!isTwoParametersStopped) {
		failures.push(
			"nextjs should stop two parameters outside route.ts, but handleRequest.ts passed.",
		);
	}
	return failures;
};

const replaceCodeBlock = ({ page, heading, code }) => {
	const headingIndex = page.indexOf(`\n${heading}\n`);
	const blockStart =
		page.indexOf(CODE_BLOCK_START, headingIndex) +
		CODE_BLOCK_START.length;
	const blockEnd = page.indexOf(CODE_BLOCK_END, blockStart);
	return {
		shownCode: page.slice(blockStart, blockEnd),
		updatedPage:
			page.slice(0, blockStart) + code + page.slice(blockEnd),
	};
};

const checkEslintPage = async () => {
	// eslint-disable-next-line no-restricted-syntax -- each template updates the page in turn
	let page = await readFile(eslintPagePath, "utf8");
	const failures = [];
	for (const template of TEMPLATES) {
		const templateCode = (
			await readFile(getTemplatePath(template.name), "utf8")
		).trimEnd();
		const { shownCode, updatedPage } = replaceCodeBlock({
			page,
			heading: template.heading,
			code: templateCode,
		});
		if (shownCode !== templateCode) {
			failures.push(
				`The ESLint page shows an old copy of the ${template.name} template. Run pnpm check:eslint-templates --update-docs.`,
			);
		}
		page = updatedPage;
	}
	if (shouldUpdateDocs) {
		await writeFile(eslintPagePath, page);
		return [];
	}
	return failures;
};

await Promise.all(
	TEMPLATES.map((template) => stageTemplate(template.name)),
);
const templateFailures = await Promise.all(
	TEMPLATES.map((template) =>
		lintTemplateAgainstItself(template.name),
	),
);
const failures = [
	...templateFailures.flat(),
	...(await checkNextjsRouteHandlers()),
	...(await checkEslintPage()),
];

if (failures.length > 0) {
	console.error(failures.join("\n\n"));
	process.exitCode = 1;
} else {
	console.log(
		"All four ESLint templates pass their own rules, and the ESLint page matches them.",
	);
}
