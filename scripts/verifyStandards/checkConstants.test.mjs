import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { checkConstants } from "./checkConstants.mjs";
import { createTestProject } from "./testProject.mjs";

const REQUIRED_FILES = {
	"lib/constants/index.ts": "",
	"lib/constants/routes.ts": "",
	"lib/constants/strings.ts": "",
	"lib/constants/numbers.ts": "",
};

const COMPONENT_CONSTANTS = `export const CONFIDENCE_MOTION = {
	rounds: [{ degrees: 12, seconds: 0.6 }],
};
export const CARD_FACE_CLASS_NAME = "rounded-2xl border";
export const HERO_CANVAS = { widthPixels: 1440 };
export const PLAN_ROUTES = { starter: "/signup" };
export const TOOLTIP_SIDE_OFFSET_PIXELS = 8;
export const HEADING = "Plans";
export const TOOL_ROUTES: Partial<
	Record<string, string>
> = {};
export const NO_SCRIPT_STYLES = \`[data-rail] { position: static; }\`;
`;

const check = (files) =>
	checkConstants({
		projectDirectory: createTestProject({ files }),
		projectFiles: Object.keys(files),
	});

describe("checkConstants", () => {
	it("passes the four starting files", () => {
		assert.deepEqual(check(REQUIRED_FILES), []);
	});

	it("passes all seven files", () => {
		assert.deepEqual(
			check({
				...REQUIRED_FILES,
				"lib/constants/noData.ts": "",
				"lib/constants/animation.ts": "",
				"lib/constants/artwork.ts": "",
				"lib/constants/classNames.ts": "",
			}),
			[],
		);
	});

	it("flags a missing starting file", () => {
		const findings = check({
			"lib/constants/index.ts": "",
			"lib/constants/routes.ts": "",
			"lib/constants/strings.ts": "",
		});
		assert.equal(findings.length, 1);
		assert.match(findings[0].message, /numbers\.ts is missing/);
	});

	it("flags a topic file and says where its values go", () => {
		const findings = check({
			...REQUIRED_FILES,
			"lib/constants/motion.ts":
				"export const HERO_ENTRANCE = { seconds: 0.4 };\n",
		});
		assert.equal(findings.length, 1);
		assert.match(findings[0].message, /not one of the seven/);
		assert.match(
			findings[0].message,
			/HERO_ENTRANCE to animation\.ts/,
		);
	});

	it("sends each export of a component constants file home", () => {
		const findings = check({
			...REQUIRED_FILES,
			"components/card/constants.ts": COMPONENT_CONSTANTS,
		});
		assert.equal(findings.length, 1);
		const { message } = findings[0];
		assert.match(message, /CONFIDENCE_MOTION to animation\.ts/);
		assert.match(message, /CARD_FACE_CLASS_NAME to classNames\.ts/);
		assert.match(message, /HERO_CANVAS to artwork\.ts/);
		assert.match(
			message,
			/PLAN_ROUTES, TOOL_ROUTES to r in routes\.ts/,
		);
		assert.match(
			message,
			/TOOLTIP_SIDE_OFFSET_PIXELS to numbers\.ts/,
		);
		assert.match(message, /HEADING to s in strings\.ts/);
		assert.match(
			message,
			/NO_SCRIPT_STYLES to the file the Constants table names/,
		);
	});

	it("shortens a long list of names", () => {
		const exports = ["ONE", "TWO", "THREE", "FOUR", "FIVE"]
			.map((name) => `export const ${name}_MOTION = {};`)
			.join("\n");
		const findings = check({
			...REQUIRED_FILES,
			"components/hero/constants.ts": exports,
		});
		assert.match(findings[0].message, /and 2 more to animation\.ts/);
	});
});
