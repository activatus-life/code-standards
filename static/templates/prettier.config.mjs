/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
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
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindStylesheet: "./app/globals.css",
	overrides: [
		{
			// YAML does not allow tabs, and Markdown reads a tab as four spaces.
			files: ["*.md", "*.mdx", "*.yml", "*.yaml"],
			options: { useTabs: false },
		},
	],
};

export default config;
