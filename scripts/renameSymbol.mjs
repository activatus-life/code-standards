#!/usr/bin/env node
// Renames a TypeScript symbol everywhere it is used, with TypeScript's own rename: the same engine as an
// editor's Rename Symbol (F2). For agents working from the command line. Never use find-and-replace.
//
// Run it from the project root, with the file where the symbol is declared:
//   node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs <file> <currentName> <newName>
// For example:
//   node node_modules/@activatus/code-standards/scripts/renameSymbol.mjs components/ui/button/types.ts ButtonProperties ButtonProps
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

// process.argv starts with the node binary and this script's path.
const FIRST_ARGUMENT_INDEX = 2;
const USAGE =
	"Usage: node renameSymbol.mjs <file> <currentName> <newName>";

// Uses the project's own TypeScript, so the rename matches the project's compiler exactly.
const requireFromProject = createRequire(
	path.join(process.cwd(), "package.json"),
);
const typescript = requireFromProject("typescript");

const readProjectSettings = () => {
	const configPath = typescript.findConfigFile(
		process.cwd(),
		typescript.sys.fileExists,
		"tsconfig.json",
	);

	if (!configPath) {
		throw new Error(
			"No tsconfig.json found. Run this from the project root.",
		);
	}

	const configFile = typescript.readConfigFile(
		configPath,
		typescript.sys.readFile,
	);

	return typescript.parseJsonConfigFileContent(
		configFile.config,
		typescript.sys,
		path.dirname(configPath),
	);
};

const createLanguageService = ({ projectSettings }) => {
	const host = {
		getScriptFileNames: () => projectSettings.fileNames,
		getScriptVersion: () => "0",
		getScriptSnapshot: (fileName) =>
			typescript.sys.fileExists(fileName)
				? typescript.ScriptSnapshot.fromString(
						typescript.sys.readFile(fileName),
					)
				: undefined,
		getCurrentDirectory: () => process.cwd(),
		getCompilationSettings: () => projectSettings.options,
		getDefaultLibFileName: (options) =>
			typescript.getDefaultLibFilePath(options),
		fileExists: typescript.sys.fileExists,
		readFile: typescript.sys.readFile,
		readDirectory: typescript.sys.readDirectory,
		directoryExists: typescript.sys.directoryExists,
		getDirectories: typescript.sys.getDirectories,
	};

	return typescript.createLanguageService(
		host,
		typescript.createDocumentRegistry(),
	);
};

// The first place the name appears as a declaration in the file: an interface, type, function, variable or parameter.
const findDeclarationPosition = ({ sourceFile, currentName }) => {
	const visit = (node) => {
		const isDeclarationName =
			typescript.isIdentifier(node) &&
			node.text === currentName &&
			node.parent?.name === node;

		return isDeclarationName
			? node.getStart(sourceFile)
			: typescript.forEachChild(node, visit);
	};

	return visit(sourceFile);
};

const endOf = (location) =>
	location.textSpan.start + location.textSpan.length;

const applyEdits = ({ renameLocations, newName }) => {
	const locationsByFile = Map.groupBy(
		renameLocations,
		(location) => location.fileName,
	);

	for (const [fileName, locations] of locationsByFile) {
		const originalText = readFileSync(fileName, "utf8");
		const sortedFromStart = locations.toSorted(
			(first, second) => first.textSpan.start - second.textSpan.start,
		);
		const pieces = sortedFromStart.flatMap((location, index) => {
			const previousEnd =
				index === 0 ? 0 : endOf(sortedFromStart[index - 1]);
			const replacement = `${location.prefixText ?? ""}${newName}${location.suffixText ?? ""}`;

			return [
				originalText.slice(previousEnd, location.textSpan.start),
				replacement,
			];
		});
		const lastLocation = sortedFromStart.at(-1);

		writeFileSync(
			fileName,
			pieces.join("") + originalText.slice(endOf(lastLocation)),
		);
	}

	return locationsByFile.size;
};

const renameSymbol = ({ filePath, currentName, newName }) => {
	const projectSettings = readProjectSettings();
	const languageService = createLanguageService({ projectSettings });
	const fileName = path.resolve(filePath);
	const sourceFile = languageService
		.getProgram()
		?.getSourceFile(fileName);

	if (!sourceFile) {
		throw new Error(
			`${filePath} is not part of the TypeScript project in tsconfig.json.`,
		);
	}

	const position = findDeclarationPosition({
		sourceFile,
		currentName,
	});

	if (position === undefined) {
		throw new Error(`${currentName} is not declared in ${filePath}.`);
	}

	const renameInfo = languageService.getRenameInfo(
		fileName,
		position,
		{
			allowRenameOfImportPath: false,
		},
	);

	if (!renameInfo.canRename) {
		throw new Error(
			`TypeScript cannot rename ${currentName}: ${renameInfo.localizedErrorMessage}`,
		);
	}

	const renameLocations = languageService.findRenameLocations(
		fileName,
		position,
		false,
		false,
		{
			providePrefixAndSuffixTextForRename: true,
		},
	);
	const fileCount = applyEdits({ renameLocations, newName });
	const fileWord = fileCount === 1 ? "file" : "files";

	return `Renamed ${currentName} to ${newName}: ${renameLocations.length} places in ${fileCount} ${fileWord}.`;
};

const [filePath, currentName, newName] = process.argv.slice(
	FIRST_ARGUMENT_INDEX,
);

if (filePath && currentName && newName) {
	console.log(renameSymbol({ filePath, currentName, newName }));
} else {
	console.error(USAGE);
	process.exitCode = 1;
}
