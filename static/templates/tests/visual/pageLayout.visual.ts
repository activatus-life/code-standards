// Measures every page at every half-screen scroll stop: each element's
// box and opacity, the element count, the page height and a screenshot.
// A refactor passes only when every measurement matches the baseline.
import { expect, type Page, test } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { VISUAL_PAGES } from "./visualPages.mjs";

const BOX_TOLERANCE_PIXELS = 1;
const OPACITY_TOLERANCE = 0.02;
const SCREENSHOT_DIFFERENCE_RATIO = 0.005;
const SCROLL_STEP_FRACTION = 0.5;
// The page clock is frozen and moved on by hand, so every run sees the
// same frames. A timing change between frames is not caught: see the
// guide's blind spot.
const FIXED_TIME = new Date("2026-01-01T00:00:00Z");
const SETTLE_MILLISECONDS = 2000;
const MAXIMUM_DIFFERENCES_SHOWN = 20;

const isUpdatingBaseline = process.env.VISUAL_UPDATE === "true";

type ElementMeasurementType = {
	x: number;
	y: number;
	width: number;
	height: number;
	opacity: number;
};

type PageProps = { page: Page };

type ScrollStopType = {
	scrollTop: number;
	pageHeight: number;
	elements: Record<string, ElementMeasurementType>;
};

const settlePage = async ({ page }: PageProps) => {
	await page.clock.runFor(SETTLE_MILLISECONDS);
	await page.evaluate(async () => {
		const finiteAnimations = document
			.getAnimations()
			.filter(
				(animation) =>
					animation.effect?.getTiming().iterations !== Infinity,
			);
		for (const animation of finiteAnimations) {
			animation.finish();
		}
		const images = [...document.images];
		await Promise.all(
			images.map((image) => image.decode().catch(() => null)),
		);
	});
};

const measurePage = ({ page }: PageProps) =>
	page.evaluate(() => {
		const describePath = (element: Element): string => {
			const parent = element.parentElement;
			if (!parent) {
				return element.tagName.toLowerCase();
			}
			const position = [...parent.children].indexOf(element) + 1;
			return `${describePath(parent)}>${element.tagName.toLowerCase()}:${position}`;
		};
		const elements = Object.fromEntries(
			[...document.body.querySelectorAll("*")].map((element) => {
				const box = element.getBoundingClientRect();
				return [
					describePath(element),
					{
						x: box.x,
						y: box.y,
						width: box.width,
						height: box.height,
						opacity: Number(getComputedStyle(element).opacity),
					},
				];
			}),
		);
		return {
			scrollTop: window.scrollY,
			pageHeight: document.documentElement.scrollHeight,
			elements,
		};
	});

type DescribeDifferencesProps = {
	baseline: ScrollStopType;
	current: ScrollStopType;
};

const describeDifferences = ({
	baseline,
	current,
}: DescribeDifferencesProps) => {
	const differences: string[] = [];
	if (baseline.pageHeight !== current.pageHeight) {
		differences.push(
			`page height ${baseline.pageHeight} → ${current.pageHeight}`,
		);
	}
	const baselineKeys = Object.keys(baseline.elements);
	const currentKeys = Object.keys(current.elements);
	if (baselineKeys.length !== currentKeys.length) {
		differences.push(
			`element count ${baselineKeys.length} → ${currentKeys.length}`,
		);
	}
	for (const key of baselineKeys) {
		const before = baseline.elements[key];
		const after = current.elements[key];
		if (!after) {
			differences.push(`${key} is missing`);
			continue;
		}
		const isBoxMoved = (["x", "y", "width", "height"] as const).some(
			(side) =>
				Math.abs(before[side] - after[side]) > BOX_TOLERANCE_PIXELS,
		);
		const isOpacityChanged =
			Math.abs(before.opacity - after.opacity) > OPACITY_TOLERANCE;
		if (isBoxMoved || isOpacityChanged) {
			differences.push(`${key} moved or faded`);
		}
	}
	return differences.slice(0, MAXIMUM_DIFFERENCES_SHOWN);
};

const toFileName = (pagePath: string) =>
	pagePath === "/" ? "home" : pagePath.replaceAll(/[^a-z0-9]+/gi, "-");

for (const pagePath of VISUAL_PAGES) {
	test(`${pagePath} looks exactly as before`, async ({
		page,
	}, testInfo) => {
		await page.clock.install({ time: FIXED_TIME });
		await page.goto(pagePath);
		await settlePage({ page });

		const viewportHeight = page.viewportSize()?.height ?? 0;
		const scrollStep = viewportHeight * SCROLL_STEP_FRACTION;
		const stops: ScrollStopType[] = [];
		// eslint-disable-next-line no-restricted-syntax -- the scroll position moves down the page one stop at a time
		let scrollTop = 0;
		const pageHeight = await page.evaluate(
			() => document.documentElement.scrollHeight,
		);
		while (scrollTop <= pageHeight - viewportHeight) {
			await page.evaluate(
				(top) => window.scrollTo(0, top),
				scrollTop,
			);
			await settlePage({ page });
			stops.push(await measurePage({ page }));
			await expect(page).toHaveScreenshot(
				`${toFileName(pagePath)}-${stops.length}.png`,
				{ maxDiffPixelRatio: SCREENSHOT_DIFFERENCE_RATIO },
			);
			scrollTop += scrollStep;
		}

		// Saved beside the screenshots: baseline/<project>/<page>.json
		const baselinePath = testInfo.snapshotPath(
			`${toFileName(pagePath)}.json`,
		);
		if (isUpdatingBaseline) {
			mkdirSync(path.dirname(baselinePath), { recursive: true });
			writeFileSync(baselinePath, JSON.stringify(stops));
			return;
		}
		const baseline: ScrollStopType[] = JSON.parse(
			readFileSync(baselinePath, "utf8"),
		);
		expect(stops.length, "number of scroll stops").toBe(
			baseline.length,
		);
		const differences = baseline.flatMap((baselineStop, index) =>
			describeDifferences({
				baseline: baselineStop,
				current: stops[index],
			}).map((difference) => `stop ${index + 1}: ${difference}`),
		);
		expect(differences).toEqual([]);
	});
}
