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
		projectFiles: Object.keys(files),
	});

describe("checkConfigFiles", () => {
	it("passes copies of the templates", () => {
		assert.deepEqual(check(standardFiles()), []);
	});

	it("ignores rewrapped comments", () => {
		const files = standardFiles();
		files["prettier.config.mjs"] = files[
			"prettier.config.mjs"
		].replace(/\/\*\*\n(@type .*)\n\*\//, "/** $1 */");
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

	it("flags a Stylelint config that differs from both templates", () => {
		const files = standardFiles();
		files["stylelint.config.mjs"] = "export default {};\n";
		const findings = check(files);
		assert.equal(findings[0].standard, "8");
	});

	it("passes a copy of the Stylelint template", () => {
		const files = standardFiles();
		files["app/globals.css"] = '@import "tailwindcss";\n';
		files["stylelint.config.mjs"] = readTemplate(
			"stylelint/css/stylelint.config.mjs",
		);
		assert.deepEqual(check(files), []);
	});

	it("flags hand-written CSS with no Stylelint config", () => {
		const files = standardFiles();
		files["app/globals.css"] = '@import "tailwindcss";\n';
		const findings = check(files);
		assert.equal(findings.length, 1);
		assert.equal(findings[0].standard, "8");
		assert.match(
			findings[0].message,
			/stylelint\.config\.mjs is missing/,
		);
	});

	it("needs no Stylelint for CSS in vendor/ or docsSite/", () => {
		const files = standardFiles();
		files["vendor/library/library.css"] = "a {}\n";
		files["docsSite/src/css/custom.css"] = ":root {}\n";
		assert.deepEqual(check(files), []);
	});
});
