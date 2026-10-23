// Standards 6 to 10: the copied config files match the templates.
import path from "node:path";

import { readTextFile } from "./projectFiles.mjs";

const ESLINT_TEMPLATE_NAMES = [
	"base",
	"typescript",
	"react",
	"nextjs",
];
const STYLELINT_TEMPLATE_NAMES = ["css", "scss"];
const FORMAT_SCRIPTS = {
	format:
		"git ls-files -z --cached --others --exclude-standard | xargs -0 prettier --write --ignore-unknown --no-error-on-unmatched-pattern",
	"format:check":
		"git ls-files -z --cached --others --exclude-standard | xargs -0 prettier --check --ignore-unknown --no-error-on-unmatched-pattern",
};
// Lines a project is told to change in prettier.config.mjs: the
// stylesheet path, and the plugin lines in a project without Tailwind.
const PRETTIER_PROJECT_LINES = /tailwindStylesheet|plugins:/;

// Comments and spacing may be rewrapped by the project's own
// formatting; only the settings themselves have to match.
const normaliseSettings = (text) =>
	text
		.replaceAll("\r\n", "\n")
		.replaceAll(/\/\*[\s\S]*?\*\//g, "")
		.replaceAll(/^\s*\/\/.*$/gm, "")
		.replaceAll(/\s+/g, " ")
		.trim();

const readTemplate = ({ templatesDirectory, filePath }) =>
	readTextFile({ projectDirectory: templatesDirectory, filePath });

const matchesAnyTemplate = ({
	projectText,
	templatesDirectory,
	templatePaths,
}) =>
	templatePaths.some(
		(templatePath) =>
			normaliseSettings(
				readTemplate({
					templatesDirectory,
					filePath: templatePath,
				}) ?? "",
			) === normaliseSettings(projectText),
	);

const checkEslint = ({ projectDirectory, templatesDirectory }) => {
	const config = readTextFile({
		projectDirectory,
		filePath: "eslint.config.mjs",
	});
	if (config === undefined) {
		return [
			{ standard: "6", message: "eslint.config.mjs is missing" },
		];
	}
	const isTemplateCopy = matchesAnyTemplate({
		projectText: config,
		templatesDirectory,
		templatePaths: ESLINT_TEMPLATE_NAMES.map((name) =>
			path.join("eslint", name, "eslint.config.mjs"),
		),
	});
	const findings = [];
	if (!isTemplateCopy) {
		findings.push({
			standard: "6",
			message:
				"eslint.config.mjs differs from every template. Copy the template over it, and move the project's own rules into eslint.overrides.mjs",
			page: "docs/Standards/eslint.md#project-specific-overrides",
		});
	}
	const overrides = readTextFile({
		projectDirectory,
		filePath: "eslint.overrides.mjs",
	});
	if (overrides === undefined) {
		findings.push({
			standard: "6",
			message:
				"eslint.overrides.mjs is missing. Copy it from static/templates/eslint.overrides.mjs",
			page: "docs/Standards/eslint.md#project-specific-overrides",
		});
	}
	return findings;
};

const withoutProjectLines = (text) =>
	normaliseSettings(
		text
			.split("\n")
			.filter((line) => !PRETTIER_PROJECT_LINES.test(line))
			.join("\n"),
	);

const checkPrettier = ({ projectDirectory, templatesDirectory }) => {
	const config = readTextFile({
		projectDirectory,
		filePath: "prettier.config.mjs",
	});
	if (config === undefined) {
		return [
			{ standard: "7", message: "prettier.config.mjs is missing" },
		];
	}
	const findings = [];
	const template =
		readTemplate({
			templatesDirectory,
			filePath: "prettier.config.mjs",
		}) ?? "";
	if (withoutProjectLines(config) !== withoutProjectLines(template)) {
		findings.push({
			standard: "7",
			message: "prettier.config.mjs differs from the template",
			page: "docs/Standards/prettier.md",
		});
	}
	const packageText =
		readTextFile({ projectDirectory, filePath: "package.json" }) ??
		"{}";
	const scripts = JSON.parse(packageText).scripts ?? {};
	for (const [name, command] of Object.entries(FORMAT_SCRIPTS)) {
		if (scripts[name] !== command) {
			findings.push({
				standard: "7",
				message: `The "${name}" script in package.json is not the standard one`,
				page: "docs/Standards/prettier.md#usage",
			});
		}
	}
	return findings;
};

const checkExactCopy = ({
	projectDirectory,
	templatesDirectory,
	filePath,
	standard,
	page,
}) => {
	const projectText = readTextFile({ projectDirectory, filePath });
	if (projectText === undefined) {
		return [{ standard, message: `${filePath} is missing`, page }];
	}
	const isCopy = matchesAnyTemplate({
		projectText,
		templatesDirectory,
		templatePaths: [filePath],
	});
	return isCopy
		? []
		: [
				{
					standard,
					message: `${filePath} differs from the template`,
					page,
				},
			];
};

const checkStylelint = ({ projectDirectory, templatesDirectory }) => {
	const config = readTextFile({
		projectDirectory,
		filePath: "stylelint.config.mjs",
	});
	// Stylelint is only for projects with hand-written CSS.
	if (config === undefined) {
		return [];
	}
	const isCopy = matchesAnyTemplate({
		projectText: config,
		templatesDirectory,
		templatePaths: STYLELINT_TEMPLATE_NAMES.map((name) =>
			path.join("stylelint", name, "stylelint.config.mjs"),
		),
	});
	return isCopy
		? []
		: [
				{
					standard: "8",
					message: "stylelint.config.mjs differs from both templates",
					page: "docs/Standards/stylelint.md",
				},
			];
};

export const checkConfigFiles = ({
	projectDirectory,
	templatesDirectory,
}) => {
	const nodeVersion = readTextFile({
		projectDirectory,
		filePath: ".nvmrc",
	});
	return [
		...checkEslint({ projectDirectory, templatesDirectory }),
		...checkPrettier({ projectDirectory, templatesDirectory }),
		...checkStylelint({ projectDirectory, templatesDirectory }),
		...checkExactCopy({
			projectDirectory,
			templatesDirectory,
			filePath: ".editorconfig",
			standard: "9",
			page: "docs/Standards/editorconfig.md",
		}),
		...checkExactCopy({
			projectDirectory,
			templatesDirectory,
			filePath: ".envrc",
			standard: "10",
			page: "docs/Standards/direnv.mdx",
		}),
		// The Node version itself is the project's choice.
		...(nodeVersion === undefined
			? [
					{
						standard: "10",
						message: ".nvmrc is missing",
						page: "docs/Standards/direnv.mdx",
					},
				]
			: []),
	];
};
