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
  },

  settings: {
    "import/resolver": {
      webpack: {
        config: "webpack.config.js",
      },
    },
  },
};
