// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  target: "web",
  entry: "./dist/mod.js",
  output: {
    library: "spamwatch",
    filename: "spamwatch.js",
    path: path.resolve(__dirname, "out"),
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
