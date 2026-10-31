/**
@type {import("stylelint").Config}
*/
const config = {
	// Generated CSS, and the docs viewer, which is the standard template
	// with its own build. Only the project's hand-written CSS is linted.
	ignoreFiles: [
		".next/**",
		"out/**",
		"build/**",
		"coverage/**",
		"docsSite/**",
		"**/vendor/**",
	],
	extends: [
		"stylelint-config-standard-scss",
		"stylelint-config-recess-order",
	],
	rules: {
		"selector-max-id": 0,
		"property-no-vendor-prefix": true,
		"color-function-notation": "modern",
	},
};

export default config;
