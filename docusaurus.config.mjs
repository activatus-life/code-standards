import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: "Activatus Code Standards",
	tagline: "Shared code standards for every Activatus project.",
	favicon: "images/favicon.svg",

	url: "https://activatus-code-standards.vercel.app",
	baseUrl: "/",

	onBrokenLinks: "throw",

	markdown: {
		mermaid: true,
		format: "detect",
		hooks: {
			onBrokenMarkdownLinks: "warn",
		},
	},

	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	presets: [
		[
			"classic",
			/** @type {import('@docusaurus/preset-classic').Options} */ ({
				docs: {
					path: "docs",
					sidebarPath: "./sidebars.mjs",
					routeBasePath: "docs",
				},
				blog: false,
				theme: {
					customCss: "./src/css/custom.css",
				},
			}),
		],
	],

	themes: [
		["@getcanary/docusaurus-theme-search-pagefind", {}],
		"@docusaurus/theme-mermaid",
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */ ({
			tableOfContents: {
				minHeadingLevel: 2,
				maxHeadingLevel: 3,
			},
			metadata: [
				{
					name: "description",
					content: "Code Standards for Activatus",
				},
				{ name: "author", content: "Activatus" },
				{ name: "og:site_name", content: "Activatus Code Standards" },
				{ name: "og:locale", content: "en_AU" },
				{ name: "og:type", content: "website" },
			],
			colorMode: {
				defaultMode: "light",
				respectPrefersColorScheme: true,
			},
			navbar: {
				title: "Activatus Code Standards",
				logo: {
					alt: "Activatus Logo",
					src: "images/logo.svg",
				},
				items: [{ to: "/docs", label: "Docs", position: "left" }],
			},
			prism: {
				theme: prismThemes.oneLight,
				darkTheme: prismThemes.oneDark,
				additionalLanguages: ["bash", "json"],
			},
		}),
};

export default config;
