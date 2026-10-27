import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { checkConstants } from "./checkConstants.mjs";

const REQUIRED_FILES = [
	"lib/constants/index.ts",
	"lib/constants/routes.ts",
	"lib/constants/strings.ts",
];

const check = (projectFiles) => checkConstants({ projectFiles });

describe("checkConstants", () => {
	it("passes r, s and the index", () => {
		assert.deepEqual(check(REQUIRED_FILES), []);
	});

	it("passes any other shared constants file", () => {
		assert.deepEqual(
			check([
				...REQUIRED_FILES,
				"lib/constants/numbers.ts",
				"lib/constants/status.ts",
			]),
			[],
		);
	});

	it("leaves values kept with the code that uses them", () => {
		assert.deepEqual(
			check([...REQUIRED_FILES, "components/shared/card/Card.tsx"]),
			[],
		);
	});

	it("flags a missing file", () => {
		const findings = check(REQUIRED_FILES.slice(0, -1));
		assert.equal(findings.length, 1);
		assert.match(findings[0].message, /strings\.ts is missing/);
	});

	it("flags values still waiting in unsortedValues.ts", () => {
		const findings = check([
			...REQUIRED_FILES,
			"lib/constants/unsortedValues.ts",
		]);
		assert.equal(findings.length, 1);
		assert.match(findings[0].message, /Ask the person/);
	});
});
