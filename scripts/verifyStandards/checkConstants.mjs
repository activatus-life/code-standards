// Standard 12.1: lib/constants/ has r, s and the index that exports
// them, and nothing is left waiting in unsortedValues.ts.
const REQUIRED_FILES = [
	"lib/constants/index.ts",
	"lib/constants/routes.ts",
	"lib/constants/strings.ts",
];
const UNSORTED_VALUES_FILE = "lib/constants/unsortedValues.ts";
const PAGE = "docs/Structure/folder-structure.md#constants";

const checkMissingFiles = ({ projectFileSet }) =>
	REQUIRED_FILES.filter(
		(filePath) => !projectFileSet.has(filePath),
	).map((filePath) => ({
		standard: "12.1",
		file: filePath,
		message: `${filePath} is missing`,
		page: PAGE,
	}));

const checkUnsortedValues = ({ projectFileSet }) =>
	projectFileSet.has(UNSORTED_VALUES_FILE)
		? [
				{
					standard: "12.1",
					file: UNSORTED_VALUES_FILE,
					message: `${UNSORTED_VALUES_FILE} still holds values. Ask the person where each one goes, move it there, and delete the file`,
					page: PAGE,
				},
			]
		: [];

export const checkConstants = ({ projectFiles }) => {
	const projectFileSet = new Set(projectFiles);
	return [
		...checkMissingFiles({ projectFileSet }),
		...checkUnsortedValues({ projectFileSet }),
	];
};
