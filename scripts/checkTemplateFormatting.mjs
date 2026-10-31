// Checks every template is already formatted the way a project
// formats it: with the template prettier.config.mjs, so import sorting
// and Tailwind class sorting included. A project copies a template,
// runs pnpm format, and pnpm standards:check then compares it word for
// word, so a template Prettier would change fails in every project.
//
// Run: pnpm check:template-formatting
// Format the templates: add --write
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { format, getFileInfo } from "prettier";

const repoDirectory = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const templatesDirectory = path.join(
	repoDirectory,
	"static/templates",
);
const shouldWrite = process.argv.includes("--write");

// The template .prettierignore keeps Prettier off these in a project.
const PRETTIER_IGNORED_PATTERN = /^(?:AGENTS\.md|skills\/)/;

// The template config, with the stylesheet a project would have.
const readTemplateConfig = async () => {
	const { default: config } = await import(
		path.join(templatesDirectory, "prettier.config.mjs")
	);
	return {
		...config,
		tailwindStylesheet: path.join(templatesDirectory, "globals.css"),
	};
};

const listFormattedTemplates = async () => {
	const templateFiles = await readdir(templatesDirectory, {
		recursive: true,
		withFileTypes: true,
	});
	const filePaths = templateFiles
		.filter((entry) => entry.isFile())
		.map((entry) =>
			path.relative(
				templatesDirectory,
				path.join(entry.parentPath, entry.name),
			),
		)
		.filter((filePath) => !PRETTIER_IGNORED_PATTERN.test(filePath));
	const fileInfos = await Promise.all(
		filePaths.map(async (filePath) => ({
			filePath,
			fileInfo: await getFileInfo(
				path.join(templatesDirectory, filePath),
			),
		})),
	);
	return fileInfos
		.filter(({ fileInfo }) => fileInfo.inferredParser !== null)
		.map(({ filePath }) => filePath);
};

const config = await readTemplateConfig();
const templatePaths = await listFormattedTemplates();
const results = await Promise.all(
	templatePaths.map(async (filePath) => {
		const fullPath = path.join(templatesDirectory, filePath);
		const text = await readFile(fullPath, "utf8");
		const formatted = await format(text, {
			...config,
			filepath: fullPath,
		});
		if (shouldWrite && formatted !== text) {
			await writeFile(fullPath, formatted);
		}
		return { filePath, isFormatted: formatted === text };
	}),
);
const unformatted = results
	.filter((result) => !result.isFormatted)
	.map((result) => `  static/templates/${result.filePath}`);

if (!shouldWrite && unformatted.length > 0) {
	console.error(
		`These templates are not formatted with the template Prettier config. Run pnpm check:template-formatting --write:\n${unformatted.join("\n")}`,
	);
	process.exitCode = 1;
} else {
	console.log(
		shouldWrite && unformatted.length > 0
			? `Formatted:\n${unformatted.join("\n")}`
			: "Every template is formatted with the template Prettier config.",
	);
}
