import { createMDXLoaderRule } from "@docusaurus/mdx-loader";
import path from "node:path";

// The pages plugin only compiles Markdown inside src/pages, so the
// home page could not import the README without this. One README
// means GitHub, npm and the home page never drift apart.
/** @type {import('@docusaurus/types').PluginModule} */
export const readmeLoader = async (context) => {
	const { siteConfig, siteDir } = context;
	const readmePath = path.join(siteDir, "README.md");

	const readmeRule = await createMDXLoaderRule({
		include: [readmePath],
		options: {
			siteDir,
			staticDirs: siteConfig.staticDirectories.map((directory) =>
				path.resolve(siteDir, directory),
			),
			markdownConfig: siteConfig.markdown,
			isMDXPartial: () => true,
			resolveMarkdownLink: () => undefined,
		},
	});

	return {
		name: "readme-loader",
		configureWebpack: () => ({
			module: { rules: [readmeRule] },
		}),
	};
};
