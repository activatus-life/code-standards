// The regression check: proves a refactor changed nothing visible.
// See "Regression Checks for Refactors" in the code standards.
import { defineConfig } from "@playwright/test";

// The baseline always comes from the live production site, never from
// the branch being tested. Set it before running test:visual:update.
const PRODUCTION_URL = process.env.VISUAL_PRODUCTION_URL;
const isUpdatingBaseline = process.env.VISUAL_UPDATE === "true";
// The project's own production build, on a port of its own.
const LOCAL_PORT = 3100;
const LOCAL_URL = `http://localhost:${LOCAL_PORT}`;
const SERVER_START_TIMEOUT_MILLISECONDS = 300_000;

if (isUpdatingBaseline && !PRODUCTION_URL) {
	throw new Error(
		"Set VISUAL_PRODUCTION_URL to the live site before updating the baseline.",
	);
}

/** @type {import("@playwright/test").PlaywrightTestConfig} */
const config = {
	testDir: ".",
	testMatch: "*.visual.ts",
	snapshotPathTemplate: "{testDir}/baseline/{projectName}/{arg}{ext}",
	fullyParallel: true,
	use: {
		baseURL: isUpdatingBaseline ? PRODUCTION_URL : LOCAL_URL,
	},
	projects: [
		{
			name: "desktop",
			use: { viewport: { width: 1440, height: 900 } },
		},
		{
			name: "tablet",
			use: { viewport: { width: 768, height: 1024 } },
		},
		{
			name: "mobile",
			use: {
				viewport: { width: 390, height: 844 },
				isMobile: true,
				hasTouch: true,
			},
		},
		{
			name: "desktopReducedMotion",
			use: {
				viewport: { width: 1440, height: 900 },
				contextOptions: { reducedMotion: "reduce" },
			},
		},
	],
	// Rebuilt before every run, so a stale build is never measured.
	webServer: isUpdatingBaseline
		? undefined
		: {
				command: `pnpm build && pnpm start --port ${LOCAL_PORT}`,
				url: LOCAL_URL,
				reuseExistingServer: false,
				timeout: SERVER_START_TIMEOUT_MILLISECONDS,
			},
};

export default defineConfig(config);
