import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { checkComponents } from "./checkComponents.mjs";
import {
	createTestProject,
	STANDARDS_DOCS_DIRECTORY,
} from "./testProject.mjs";

const COMPONENT = "export const Button = () => <button />;\n";
const DATA_ONLY = "export const POINTS = [1, 2];\n";

const check = ({ files, componentsText = "" }) =>
	checkComponents({
		projectDirectory: createTestProject({ files }),
		projectFiles: Object.keys(files),
		standardsDocsDirectory: STANDARDS_DOCS_DIRECTORY,
		recordedExceptions: { componentsText },
	});

describe("checkComponents", () => {
	it("passes a listed component with its test", () => {
		const findings = check({
			files: {
				"components/ui/button/Button.tsx": COMPONENT,
				"components/ui/button/Button.test.tsx": "",
			},
		});
		assert.deepEqual(findings, []);
	});

	it("matches either name of a two-name component", () => {
		const findings = check({
			files: { "components/ui/divider/index.ts": "" },
		});
		assert.deepEqual(findings, []);
	});

	it("flags an unlisted ui component", () => {
		const findings = check({
			files: { "components/ui/fancyThing/index.ts": "" },
		});
		assert.equal(findings[0].standard, "15");
	});

	it("accepts a component recorded for the standards", () => {
		const findings = check({
			files: { "components/ui/fancyThing/index.ts": "" },
			componentsText: "- fancy thing: label (text)",
		});
		assert.deepEqual(findings, []);
	});

	it("flags a component without a test", () => {
		const findings = check({
			files: { "components/shared/card/Card.tsx": COMPONENT },
		});
		assert.equal(findings[0].standard, "4");
	});

	it("does not ask for tests of data-only files", () => {
		const findings = check({
			files: { "components/shared/card/points.ts": DATA_ONLY },
		});
		assert.deepEqual(findings, []);
	});
});
