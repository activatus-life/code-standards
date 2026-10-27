import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { checkStructure } from "./checkStructure.mjs";

const FLAT_CARD = [
	"components/shared/card/Card.tsx",
	"components/shared/card/components/cardHeader/CardHeader.tsx",
	"components/shared/card/components/cardTitleArrow/CardTitleArrow.tsx",
	"app/(homepage)/page.tsx",
];

describe("checkStructure", () => {
	it("passes flat sub-components and the homepage route group", () => {
		assert.deepEqual(checkStructure({ projectFiles: FLAT_CARD }), []);
	});

	it("flags a sub-component sitting directly in its parent", () => {
		const findings = checkStructure({
			projectFiles: [
				"components/shared/card/Card.tsx",
				"components/shared/card/cardHeader/CardHeader.tsx",
			],
		});
		assert.equal(findings.length, 1);
		assert.match(
			findings[0].message,
			/Move it to components\/shared\/card\/components\/cardHeader/,
		);
	});

	it("flags a components folder inside a sub-component", () => {
		const findings = checkStructure({
			projectFiles: [
				"components/shared/card/Card.tsx",
				"components/shared/card/components/cardHeader/CardHeader.tsx",
				"components/shared/card/components/cardHeader/components/cardTitleArrow/CardTitleArrow.tsx",
			],
		});
		assert.equal(findings.length, 1);
		assert.match(
			findings[0].message,
			/Move it to components\/shared\/card\/components\/cardTitleArrow/,
		);
	});

	it("flags a sub-component inside a grouping folder", () => {
		const findings = checkStructure({
			projectFiles: [
				"components/shared/card/Card.tsx",
				"components/shared/card/parts/cardHeader/CardHeader.tsx",
			],
		});
		assert.equal(findings.length, 1);
		assert.match(
			findings[0].message,
			/Move it to components\/shared\/card\/components\/cardHeader/,
		);
	});

	it("ignores test and story files", () => {
		assert.deepEqual(
			checkStructure({
				projectFiles: [
					...FLAT_CARD,
					"components/shared/card/Card.test.tsx",
					"components/shared/card/Card.stories.tsx",
				],
			}),
			[],
		);
	});

	it("flags the homepage outside its route group", () => {
		const findings = checkStructure({
			projectFiles: ["app/page.tsx"],
		});
		assert.equal(findings.length, 1);
		assert.match(findings[0].message, /app\/\(homepage\)/);
	});

	it("flags a folder loose in components/", () => {
		const findings = checkStructure({
			projectFiles: [
				"components/ui/button/Button.tsx",
				"components/layout/siteHeader/SiteHeader.tsx",
				"components/projectTabs/ProjectTabs.tsx",
				"components/projectTabs/ProjectTabs.types.ts",
				"src/components/statusBadge/StatusBadge.tsx",
				"app/(billing)/components/invoiceTable/InvoiceTable.tsx",
			],
		});
		assert.deepEqual(
			findings.map((finding) => finding.file),
			["components/projectTabs/", "src/components/statusBadge/"],
		);
		assert.match(findings[0].message, /loose in components\//);
	});
});
