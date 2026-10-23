import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { checkConfigFiles } from "./checkConfigFiles.mjs";
import {
	createTestProject,
	TEMPLATES_DIRECTORY,
} from "./testProject.mjs";

const readTemplate = (filePath) =>
	readFileSync(path.join(TEMPLATES_DIRECTORY, filePath), "utf8");

const FORMAT_COMMAND =
	"git ls-files -z --cached --others --exclude-standard | xargs -0 prettier";
const FORMAT_FLAGS =
	"--ignore-unknown --no-error-on-unmatched-pattern";

const standardFiles = () => ({
	"eslint.config.mjs": readTemplate(
		"eslint/nextjs/eslint.config.mjs",
	),
	"eslint.overrides.mjs": readTemplate("eslint.overrides.mjs"),
	"prettier.config.mjs": readTemplate("prettier.config.mjs"),
	".editorconfig": readTemplate(".editorconfig"),
	".envrc": readTemplate(".envrc"),
	".nvmrc": "24\n",
	"package.json": JSON.stringify({
		scripts: {
			format: `${FORMAT_COMMAND} --write ${FORMAT_FLAGS}`,
			"format:check": `${FORMAT_COMMAND} --check ${FORMAT_FLAGS}`,
		},
	}),
});

const check = (files) =>
	checkConfigFiles({
		projectDirectory: createTestProject({ files }),
		templatesDirectory: TEMPLATES_DIRECTORY,
	});

describe("checkConfigFiles", () => {
	it("passes copies of the templates", () => {
		assert.deepEqual(check(standardFiles()), []);
	});

	it("ignores rewrapped comments", () => {
		const files = standardFiles();
		files["prettier.config.mjs"] = files[
			"prettier.config.mjs"
		].replace("/** @type", "/**\n@type");
		assert.deepEqual(check(files), []);
	});

	it("allows the project's stylesheet path", () => {
		const files = standardFiles();
		files["prettier.config.mjs"] = files[
			"prettier.config.mjs"
		].replace("./app/globals.css", "./src/app/globals.css");
		assert.deepEqual(check(files), []);
	});

	it("flags a changed ESLint config and a missing overrides file", () => {
		const files = standardFiles();
		files["eslint.config.mjs"] += "\nconst extraRule = 1;\n";
		delete files["eslint.overrides.mjs"];
		const findings = check(files);
		assert.equal(findings.length, 2);
		assert.ok(findings.every((finding) => finding.standard === "6"));
	});

	it("flags a non-standard format script", () => {
		const files = standardFiles();
		files["package.json"] = JSON.stringify({
			scripts: { format: "prettier --write ." },
		});
		const findings = check(files);
		assert.equal(findings.length, 2);
	});

	it("only checks Stylelint when the project has it", () => {
		const files = standardFiles();
		files["stylelint.config.mjs"] = "export default {};\n";
		const findings = check(files);
		assert.equal(findings[0].standard, "8");
	});
});
