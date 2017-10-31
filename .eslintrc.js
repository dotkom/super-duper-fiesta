module.exports = {
  extends: "airbnb",

  env: {
    browser: true,
    jest: true,
  },

  rules: {
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [
          ".js",
          ".jsx",
        ],
      },
    ],
    // Doesn't allow nested input inside label
    "jsx-a11y/label-has-for": [0],
    // Disabled until eslint-plugin-import gets proper support for webpack externals
    // https://github.com/benmosher/eslint-plugin-import/issues/479
    // https://github.com/benmosher/eslint-plugin-import/issues/605
    "import/no-extraneous-dependencies": 0,
    "import/extensions": 0,
    // Allows us to reference mongodb '_id' field without whitelisting each line.
    "no-underscore-dangle": [2, { allow: ['_id'] }],
    // allow arrow functions if wrapping with parentheses
    "no-confusing-arrow": ["error", {"allowParens": true}]
  },

  settings: {
    "import/resolver": {
      webpack: {
        config: "webpack.config.js",
      },
    },
  },
};
