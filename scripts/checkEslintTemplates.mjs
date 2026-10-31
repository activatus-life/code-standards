// Checks the ESLint templates before they reach a project:
// 1. Each template passes its own rules.
// 2. The Next.js template lets route.ts take (request, context),
//    and still stops two parameters everywhere else.
// 3. Every TypeScript template stops `as const`.
// 4. Every other template a project copies in, such as
//    prettier.config.mjs, passes the rules it meets in the project.
// 5. This repo's own scripts pass the base template.
// 6. The ESLint page shows each template exactly as it is.
//
// Run: pnpm check:eslint-templates
// Copy the templates into the ESLint page: add --update-docs
import { ESLint } from "eslint";
import {
	copyFile,
	mkdir,
	readdir,
	readFile,
	rm,
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
const allTemplatesDirectory = path.join(
	repoDirectory,
	"static/templates",
);
const projectDirectory = path.join(stagedDirectory, "project");
const shouldUpdateDocs = process.argv.includes("--update-docs");

const TEMPLATES = [
	{ name: "base", heading: "### Base (JavaScript / Node.js)" },
	{ name: "typescript", heading: "### TypeScript" },
	{ name: "react", heading: "### React + TypeScript" },
	{ name: "nextjs", heading: "### Next.js" },
];
const CONFIG_FILE_NAME = "eslint.config.mjs";
const OVERRIDES_FILE_NAME = "eslint.overrides.mjs";
const CODE_FILE_PATTERN = /\.(?:mjs|js|ts|tsx)$/;
// The ESLint templates are checked on their own, above.
const ESLINT_TEMPLATE_PATTERN = /^eslint[./]/;
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
const createLinter = ({
	templateName,
	workingDirectory,
	rules = {},
}) =>
	new ESLint({
		cwd: workingDirectory,
		overrideConfigFile: getStagedPath(templateName),
		overrideConfig: {
			settings: { next: { rootDir: nextjsFixtureDirectory } },
			rules,
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

// Each template a project copies in, at its path under
// static/templates, beside the Next.js config: the template with the
// most rules. Its ignores apply, so docsSite/ is skipped as it is in a
// project.
const stageProject = async () => {
	await rm(projectDirectory, { recursive: true, force: true });
	const allTemplateFiles = await readdir(allTemplatesDirectory, {
		recursive: true,
	});
	const templateFiles = allTemplateFiles.filter(
		(filePath) =>
			CODE_FILE_PATTERN.test(filePath) &&
			!ESLINT_TEMPLATE_PATTERN.test(filePath),
	);
	await Promise.all(
		templateFiles.map(async (filePath) => {
			const stagedFilePath = path.join(projectDirectory, filePath);
			await mkdir(path.dirname(stagedFilePath), { recursive: true });
			await copyFile(
				path.join(allTemplatesDirectory, filePath),
				stagedFilePath,
			);
		}),
	);
};

const lintProjectTemplates = async () => {
	await stageProject();
	const linter = createLinter({
		templateName: "nextjs",
		workingDirectory: projectDirectory,
		// A project installs the packages a template imports, such as
		// @playwright/test. This repo does not, so only paths are checked.
		rules: {
			"import-x/no-unresolved": ["error", { ignore: ["^[^./]"] }],
		},
	});
	const results = await linter.lintFiles(["."]);
	return describeProblems(results).map(
		(problem) =>
			`A template fails the rules it meets in a project:\n${problem.replace(path.relative(repoDirectory, projectDirectory), "static/templates")}`,
	);
};

// This repo's own scripts follow the standards too.
const lintRepoScripts = async () => {
	const linter = createLinter({
		templateName: "base",
		workingDirectory: repoDirectory,
	});
	const results = await linter.lintFiles(["scripts/**/*.mjs"]);
	return describeProblems(results).map(
		(problem) => `A script fails the base template:\n${problem}`,
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

const AS_CONST_FIXTURE = "lib/statusNames.ts";
const AS_CONST_MESSAGE = "not as const";

const checkAsConstBanned = async (templateName) => {
	const linter = createLinter({
		templateName,
		workingDirectory: nextjsFixtureDirectory,
	});
	const [result] = await linter.lintFiles([AS_CONST_FIXTURE]);
	const isAsConstStopped = result.messages.some((message) =>
		message.message.includes(AS_CONST_MESSAGE),
	);
	return isAsConstStopped
		? []
		: [
				`${templateName} should stop as const, but ${AS_CONST_FIXTURE} passed.`,
			];
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
		const templateText = await readFile(
			getTemplatePath(template.name),
			"utf8",
		);
		const templateCode = templateText.trimEnd();
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
const asConstFailures = await Promise.all(
	TEMPLATES.filter((template) => template.name !== "base").map(
		(template) => checkAsConstBanned(template.name),
	),
);
const failures = [
	...templateFailures.flat(),
	...(await checkNextjsRouteHandlers()),
	...asConstFailures.flat(),
	...(await lintProjectTemplates()),
	...(await lintRepoScripts()),
	...(await checkEslintPage()),
];

if (failures.length > 0) {
	console.error(failures.join("\n\n"));
	process.exitCode = 1;
} else {
	console.log(
		"All four ESLint templates pass their own rules, every other template passes the rules it meets in a project, this repo's scripts pass the base template, and the ESLint page matches them.",
	);
}
