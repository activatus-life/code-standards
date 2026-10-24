import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { checkConstants } from "./checkConstants.mjs";

const REQUIRED_FILES = [
	"lib/constants/index.ts",
	"lib/constants/routes.ts",
	"lib/constants/strings.ts",
	"lib/constants/numbers.ts",
];

const check = (projectFiles) => checkConstants({ projectFiles });

describe("checkConstants", () => {
	it("passes the four starting files", () => {
		assert.deepEqual(check(REQUIRED_FILES), []);
	});

	it("passes all seven files", () => {
		assert.deepEqual(
			check([
				...REQUIRED_FILES,
				"lib/constants/noData.ts",
				"lib/constants/animation.ts",
				"lib/constants/artwork.ts",
				"lib/constants/classNames.ts",
			]),
			[],
		);
	});

	it("flags a missing starting file", () => {
		const findings = check(REQUIRED_FILES.slice(0, -1));
		assert.equal(findings.length, 1);
		assert.match(findings[0].message, /numbers\.ts is missing/);
	});

	it("flags any other file in lib/constants/", () => {
		const findings = check([
			...REQUIRED_FILES,
			"lib/constants/otherValues.ts",
		]);
		assert.equal(findings.length, 1);
		assert.match(findings[0].message, /not one of the seven/);
	});

	it("flags a component constants file and leaves the choice to the project", () => {
		const findings = check([
			...REQUIRED_FILES,
			"components/shared/card/constants.ts",
		]);
		assert.equal(findings.length, 1);
		assert.match(
			findings[0].message,
			/the Constants table says fits/,
		);
	});
});
