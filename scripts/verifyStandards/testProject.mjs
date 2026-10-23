// Test support: builds a throwaway project folder from a list of files.
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const TEMPLATES_DIRECTORY = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../../static/templates",
);

export const STANDARDS_DOCS_DIRECTORY = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../../docs",
);

export const createTestProject = ({ files }) => {
	const projectDirectory = mkdtempSync(
		path.join(tmpdir(), "verifyStandards-"),
	);
	for (const [filePath, contents] of Object.entries(files)) {
		const fullPath = path.join(projectDirectory, filePath);
		mkdirSync(path.dirname(fullPath), { recursive: true });
		writeFileSync(fullPath, contents);
	}
	return projectDirectory;
};
