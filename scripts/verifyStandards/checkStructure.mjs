// Standard 13: components sit at most two levels deep, the component
// then its sub-components, and the homepage is in app/(homepage)/.
import path from "node:path";

const COMPONENT_FILE_PATTERN = /^[A-Z][A-Za-z0-9]*\.(?:tsx|jsx)$/;
const COMPONENTS_FOLDER = "components";
const UNGROUPED_HOMEPAGE_PATTERN =
	/^(?:src\/)?app\/page\.(?:tsx|jsx)$/;
const NESTED_PAGE =
	"docs/Structure/component-organization.md#nested-components";

// A component folder holds a PascalCase component file, Card.tsx.
const listComponentFolders = ({ projectFiles }) =>
	new Set(
		projectFiles
			.filter((filePath) => !filePath.startsWith("node_modules/"))
			.filter((filePath) =>
				COMPONENT_FILE_PATTERN.test(path.posix.basename(filePath)),
			)
			.map((filePath) => path.posix.dirname(filePath)),
	);

// The topmost component folder above this one, or undefined for a
// component that is not inside another.
const findRootComponent = ({ folder, componentFolders }) => {
	const ancestors = [];
	// eslint-disable-next-line no-restricted-syntax -- walks up one folder at a time
	let parent = path.posix.dirname(folder);
	while (parent !== ".") {
		ancestors.push(parent);
		parent = path.posix.dirname(parent);
	}
	return ancestors.findLast((ancestor) =>
		componentFolders.has(ancestor),
	);
};

// A sub-component's only home is its root component's components/
// folder: card/components/cardHeader/. Never card/cardHeader/,
// card/parts/cardHeader/ or card/components/cardHeader/components/.
const checkSubComponentFolders = ({ componentFolders }) =>
	[...componentFolders]
		.map((folder) => ({
			folder,
			rootComponent: findRootComponent({ folder, componentFolders }),
		}))
		.filter(({ rootComponent }) => rootComponent !== undefined)
		.map(({ folder, rootComponent }) => ({
			folder,
			rootComponent,
			flatFolder: path.posix.join(
				rootComponent,
				COMPONENTS_FOLDER,
				path.posix.basename(folder),
			),
		}))
		.filter(({ folder, flatFolder }) => folder !== flatFolder)
		.map(({ folder, rootComponent, flatFolder }) => ({
			standard: "13",
			message: `${folder} is not flat in ${rootComponent}/${COMPONENTS_FOLDER}/. Move it to ${flatFolder}`,
			page: NESTED_PAGE,
		}));

const checkHomepage = ({ projectFiles }) =>
	projectFiles
		.filter((filePath) => UNGROUPED_HOMEPAGE_PATTERN.test(filePath))
		.map((filePath) => ({
			standard: "13",
			message: `${filePath} is the homepage outside its route group. Move it to app/(homepage)/`,
			page: "docs/Structure/folder-structure.md#-where-components-live",
		}));

export const checkStructure = ({ projectFiles }) => {
	const componentFolders = listComponentFolders({ projectFiles });
	return [
		...checkSubComponentFolders({ componentFolders }),
		...checkHomepage({ projectFiles }),
	];
};
