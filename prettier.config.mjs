// The Activatus Prettier standard, without the Tailwind plugin: this site does not use Tailwind.
// See docs/Standards/prettier.md.
/** @type {import("prettier").Config} */
const config = {
	// Short lines, so code reads well on a phone.
	printWidth: 70,
	// Tabs indent. A tab counts as 2 characters towards the line width.
	useTabs: true,
	tabWidth: 2,
	singleQuote: false,
	trailingComma: "all",
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: "always",
	semi: true,
	endOfLine: "lf",
	overrides: [
		{
			// YAML does not allow tabs, and Markdown reads a tab as four spaces.
			files: ["*.md", "*.mdx", "*.yml", "*.yaml"],
			options: { useTabs: false },
		},
		{
			// Code samples in the docs are copied from static/templates/. Leave them exactly as they are.
			files: ["*.md", "*.mdx"],
			options: { embeddedLanguageFormatting: "off" },
		},
	],
};

export default config;
