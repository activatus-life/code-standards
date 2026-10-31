/**
@type {import("stylelint").Config}
*/
const config = {
	ignoreFiles: ["**/vendor/**"],
	extends: [
		"stylelint-config-standard",
		"stylelint-config-recess-order",
	],
	rules: {
		"selector-max-id": 0,
		"property-no-vendor-prefix": true,
		"color-function-notation": "modern",
		"import-notation": "string",
		"at-rule-no-unknown": [
			true,
			{
				ignoreAtRules: [
					"theme",
					"utility",
					"variant",
					"custom-variant",
					"source",
					"plugin",
				],
			},
		],
	},
	overrides: [
		{
			files: ["**/*.module.css"],
			rules: {
				"color-named": "never",
				"color-no-hex": true,
				"selector-class-pattern": [
					"^[a-z][a-zA-Z0-9]*$",
					{ message: "Expected class selector to be camelCase" },
				],
			},
		},
	],
};

export default config;
