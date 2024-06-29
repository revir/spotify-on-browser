var webpack = require("webpack"),
  path = require("path"),
  fileSystem = require("fs"),
  env = require("./utils/env"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  // WriteFilePlugin = require("write-file-webpack-plugin"),
  TerserPlugin = require("terser-webpack-plugin");

// load the secrets
var alias = {};

var fileExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "eot",
  "otf",
  "svg",
  "ttf",
  "woff",
  "woff2",
];
alias.utils = path.join(__dirname, "src/utils.coffee");
// alias['needsharebutton.m ``in.js'] = path.join(__dirname, 'needsharebutton.min.js');
// alias['needsharebutton.css'] = path.join(__dirname, 'needsharebutton.css');
// alias['font-awesome.css'] = path.join(__dirname, 'css/font-awesome.css');
// alias['needsharebutton.css'] = path.join(__dirname, 'needsharebutton.css');

var options = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    option: path.join(__dirname, "src", "option", "option.coffee"),
    player: path.join(__dirname, "src", "content", "player.coffee"),
    authorized: path.join(__dirname, "src", "content", "authorized.coffee"),
    background: path.join(__dirname, "src", "background", "main.js"),
    offplayer: path.join(__dirname, "src", "background", "offplayer.js"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js",
    clean: true,
    publicPath: "/",
  },
  resolve: {
    fallback: { crypto: false },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
      {
        test: new RegExp(".(" + fileExtensions.join("|") + ")$"),
        type: "asset/resource",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.coffee$/,
        loader: "coffee-loader",
      },
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: {
              exposes: [
                {
                  globalName: "$",
                  override: true,
                },
                {
                  globalName: "jQuery",
                  override: true,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: alias,
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: path.join(__dirname, "build"),
          force: true,
          transform: function (content) {
            // generates the manifest file using the package.json informations
            const json = {
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            };
            json.name = `Spotify on ${env.BROWSER}`;
            if (env.BROWSER === "Firefox") {
              json.browser_specific_settings = {
                gecko: {
                  id: "revir.qing@gmail.com",
                  strict_min_version: "109.0",
                },
              };
              json.background = {
                scripts: ["background.bundle.js", "offplayer.bundle.js"],
              };
              json.permissions = json.permissions.filter(
                (x) => x !== "offscreen"
              );
              for (x in json.commands) {
                delete json.commands[x].global;
              }
            }

            return Buffer.from(JSON.stringify(json));
          },
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/images",
          to: path.join(__dirname, "build/images"),
          force: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "offscreen.html"),
      filename: "offscreen.html",
      chunks: ["offplayer"],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "player.html"),
      filename: "player.html",
      chunks: ["player"],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "authorized.html"),
      filename: "authorized.html",
      chunks: ["authorized"],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "option.html"),
      filename: "option.html",
      chunks: ["option"],
      cache: false,
    }),
  ],
  infrastructureLogging: {
    level: "info",
  },
};

if (env.NODE_ENV === "development") {
  console.log("Run in dev");
  options.devtool = "cheap-module-source-map";
} else {
  console.log("Run in prod");
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;
