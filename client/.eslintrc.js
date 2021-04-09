/* eslint-disable */

const { readFileSync } = require("fs");

const generalRules = {
  "no-plusplus": "off",

  // Allow leading underscores in identifiers (e.g. _id in MongoDB).
  "no-underscore-dangle": "off",

  // Some APIs use snake_case identifiers.
  camelcase: "off",

  // Depending on the context, using bracket notation might be clearer.
  "dot-notation": "off",

  /**
   * Unused variables and arguments should be removed in most cases, but sometimes they are
   * unavoidable. Prefix variable names with an underscore to suppress the error.
   */
  "no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],

  // Not necessary for some APIs (consistency reasons)
  "import/prefer-default-export": "off",
};

const reactRules = {
  "react/jsx-filename-extension": "off",
  "react/prop-types": "off",
  "react/destructuring-assignment": "off",

  "react/sort-comp": "warn",

  // Use warnings instead of errors for issues that aren't deal-breakers.
  "react/prefer-stateless-function": "warn",
  "react/no-array-index-key": "warn",
};

/**
 * Return a rules object which produces warnings instead of errors for accessibility problems.
 */
function getAccessibilityWarningRules() {
  const oldRules = require("eslint-plugin-jsx-a11y").rules;

  const newRules = {};
  Object.entries(oldRules).forEach(([name, _rule]) => {
    newRules[`jsx-a11y/${name}`] = "warn";
  });
  return newRules;
}

/**
 * Return a rules object which allows for...of statements to be used, since this syntax produces
 * errors with the default airbnb config.
 */
function getAllowForOfRules() {
  const airbnbStyleRules = require("eslint-config-airbnb-base/rules/style.js").rules;
  return {
    "no-restricted-syntax": airbnbStyleRules["no-restricted-syntax"].filter(
      (item) => item.selector !== "ForOfStatement"
    ),
  };
}

/**
 * Load the .eslintrc.json file, which contains frontend/backend-specific configuration.
 */
function loadConfig() {
  const path = ".eslintrc.json";
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    throw new Error(
      `File '${path}' does not exist. Generate it by running 'npx eslint --init'. When prompted to choose the file format, select JSON.`
    );
  }
}

const jsonConfig = loadConfig();

/**
 * Return whether this part of the project is using React.
 */
function usingReact() {
  return jsonConfig.plugins !== undefined && jsonConfig.plugins.includes("react");
}

/**
 * Generate the complete rules object.
 */
function generateRules() {
  const rules = { ...generalRules };
  Object.assign(rules, getAllowForOfRules());
  if (usingReact()) {
    Object.assign(rules, reactRules);
    Object.assign(rules, getAccessibilityWarningRules());
  }
  return rules;
}

if (process.env.NODE_ENV === "production") {
  // In production (e.g. on Heroku), sometimes dev-dependencies are not installed
  // This results in errors with the rule generation process
  // Since linting isn't necessary in production, we can just ignore it
  module.exports = {};
} else {
  const rules = generateRules();
  module.exports = {
    settings: {
      react: {
        version: "detect",
      },
    },
    ...jsonConfig,
    ...(usingReact() ? { parser: "babel-eslint" } : {}),
    extends: ["eslint:recommended", usingReact() ? "airbnb" : "airbnb-base", "prettier"],
    rules,
  };
}
