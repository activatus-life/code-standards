/** @type {import("prettier").Config & import("@ianvs/prettier-plugin-sort-imports").PluginConfig & import("prettier-plugin-tailwindcss").PluginOptions} */
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
	// The Tailwind plugin must stay last.
	plugins: [
		"@ianvs/prettier-plugin-sort-imports",
		"prettier-plugin-tailwindcss",
	],
	// Node's own modules, packages, the project's @/ aliases, then
	// ../ and ./, with a blank line between groups. Side-effect
	// imports, such as CSS, never move.
	importOrder: [
		"<BUILTIN_MODULES>",
		"",
		"<THIRD_PARTY_MODULES>",
		"",
		"^@/",
		"",
		"^[.][.]/",
		"",
		"^[.]/",
	],
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
