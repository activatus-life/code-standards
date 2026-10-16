import { themes as prismThemes } from "prism-react-renderer";

const TITLE_SEPARATOR = " — ";
const FIRST_GROUP = "overview";

// Each doc is titled "# Group — Menu item". The folder is the menu group and the
// part after the dash is the menu item. Overview comes first; everything else is alphabetical.
const generateSidebarItems = async ({
	defaultSidebarItemsGenerator,
	docs: pages,
	...remainingArguments
}) => {
	const items = await defaultSidebarItemsGenerator({
		docs: pages,
		...remainingArguments,
	});
	const titleById = new Map(
		pages.map((page) => [page.id, page.title]),
	);

	const labelled = items.map((item) => {
		if (item.type !== "category") {
			return item;
		}

		const children = item.items
			.map((child) => {
				if (child.type !== "doc") {
					return child;
				}
				const title = titleById.get(child.id) ?? child.id;
				const label = title.includes(TITLE_SEPARATOR)
					? title.split(TITLE_SEPARATOR)[1]
					: title;
				return { ...child, label };
			})
			.sort((first, second) =>
				first.label.localeCompare(second.label),
			);

		const firstDoc = item.items.find((child) => child.type === "doc");
		const firstTitle = firstDoc
			? (titleById.get(firstDoc.id) ?? "")
			: "";
		const label = firstTitle.includes(TITLE_SEPARATOR)
			? firstTitle.split(TITLE_SEPARATOR)[0]
			: item.label;
		const folder = firstDoc ? firstDoc.id.split("/")[0] : item.label;

		return {
			...item,
			label,
			items: children,
			customProps: { folder },
		};
	});

	return labelled.sort((first, second) => {
		const firstFolder = first.customProps?.folder ?? "";
		const secondFolder = second.customProps?.folder ?? "";
		if (firstFolder === FIRST_GROUP) {
			return -1;
		}
		if (secondFolder === FIRST_GROUP) {
			return 1;
		}
		return String(first.label).localeCompare(String(second.label));
	});
};

// TODO: set the project name
const PROJECT_NAME = "Project Name";

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: `${PROJECT_NAME} Docs`,
	favicon: "images/logo.svg",

	// The docs are only ever served behind the app's /docs route, so this URL is a placeholder.
	url: "http://localhost:3000",
	baseUrl: "/docs/",

	// Internal docs must never be indexed by search engines.
	noIndex: true,

	onBrokenLinks: "throw",

	markdown: {
		// Plain .md files are read as CommonMark, so < and { in a doc never break the build.
		format: "detect",
		mermaid: true,
	},

	presets: [
		[
			"classic",
			/** @type {import('@docusaurus/preset-classic').Options} */ ({
				docs: {
					// The Markdown lives in the project's root docs/ folder, not inside this site.
					path: "../docs",
					routeBasePath: "/",
					sidebarPath: "./sidebars.mjs",
					sidebarItemsGenerator: generateSidebarItems,
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
			colorMode: {
				defaultMode: "light",
				respectPrefersColorScheme: true,
			},
			navbar: {
				title: `${PROJECT_NAME} Docs`,
				logo: {
					alt: "Logo",
					src: "images/logo.svg",
				},
				items: [],
			},
			prism: {
				theme: prismThemes.oneLight,
				darkTheme: prismThemes.oneDark,
				additionalLanguages: ["bash", "json"],
			},
		}),
};

export default config;
