// Checks the standards are ready to publish: lint, tests, templates
// (linted and formatted as a project would), formatting, types and
// the site build. Run it before every publish.
//
// Run: pnpm devtest
import { spawnSync } from "node:child_process";

// The lint packages a project installs from the ESLint page. A project
// gets the latest of each, so the templates are checked against the
// latest too.
const LINT_PACKAGES = [
	"eslint",
	"@eslint/js",
	"globals",
	"@eslint-community/eslint-plugin-eslint-comments",
	"eslint-config-prettier",
	"eslint-plugin-import-x",
	"eslint-plugin-unicorn",
	"typescript-eslint",
	"eslint-import-resolver-typescript",
	"eslint-plugin-react",
	"eslint-plugin-react-hooks",
	"eslint-config-next",
];

const STEPS = [
	{ name: "Tests", command: ["test"] },
	{
		name: "Lint: scripts and templates pass the code standards",
		command: ["check:eslint-templates"],
	},
	{
		name: "Templates are formatted as a project formats them",
		command: ["check:template-formatting"],
	},
	{ name: "Formatting", command: ["format:check"] },
	{ name: "Type check", command: ["typecheck"] },
	{ name: "Site builds with no broken links", command: ["build"] },
];

const runPnpm = (command) =>
	spawnSync("pnpm", command, { encoding: "utf8" });

const listOutdatedLintPackages = () => {
	const { stdout } = runPnpm([
		"outdated",
		"--format",
		"json",
		...LINT_PACKAGES,
	]);
	// pnpm prints nothing when every package is the latest.
	const outdated = stdout.trim() === "" ? {} : JSON.parse(stdout);
	return Object.entries(outdated).map(
		([name, versions]) =>
			`${name} ${versions.current} → ${versions.latest}`,
	);
};

const outdatedLintPackages = listOutdatedLintPackages();
const isLintCurrent = outdatedLintPackages.length === 0;
console.log(
	isLintCurrent
		? "✓ Lint packages are the latest, as a project installs them"
		: `✗ Lint packages are behind what a project installs. Run pnpm add -D ${LINT_PACKAGES.join(" ")} --latest, then check again:\n  ${outdatedLintPackages.join("\n  ")}`,
);

const failedSteps = STEPS.filter((step) => {
	const result = runPnpm(["-s", ...step.command]);
	const isPassed = result.status === 0;
	console.log(`${isPassed ? "✓" : "✗"} ${step.name}`);
	if (!isPassed) {
		console.log(`${result.stdout}${result.stderr}`);
	}
	return !isPassed;
});

if (!isLintCurrent || failedSteps.length > 0) {
	console.error("\nNot ready to publish.");
	process.exitCode = 1;
} else {
	console.log("\nReady to publish.");
}
