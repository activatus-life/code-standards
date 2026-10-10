/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard-scss", "stylelint-config-recess-order"],
  rules: {
    "selector-max-id": 0,
    "property-no-vendor-prefix": true,
    "color-function-notation": "modern",
  },
};
