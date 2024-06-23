const WebpackDevServer = require("webpack-dev-server"),
  webpack = require("webpack"),
  config = require("../webpack.config"),
  env = require("./env"),
  path = require("path"),
  debounce = require("lodash").debounce,
  SSEStream = require("ssestream").default;

config.entry["background"] = [
  path.resolve(
    __dirname,
    `autoReloadClients/backgroundClient.js?port=${env.PORT}`
  ),
].concat(config.entry["background"]);

config.entry["player"] = [
  path.resolve(__dirname, "autoReloadClients/contentScriptClient.js"),
].concat(config.entry["player"]);

const compiler = webpack(config);

const server = new WebpackDevServer(
  {
    hot: false,
    liveReload: false,
    compress: false,
    webSocketServer: false,
    host: "localhost",
    port: env.PORT,

    static: {
      directory: path.join(__dirname, "../build"),
    },
    devMiddleware: {
      publicPath: `http://localhost:${env.PORT}/`,
      writeToDisk: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    allowedHosts: "all",

    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }

      // imagine you are using app.use(path, middleware) in express.
      // in fact, devServer is an express server.
      middlewares.push({
        path: "/__server_sent_events__", // you can find this path requested by backgroundClient.js.
        middleware: (req, res) => {
          const sseStream = new SSEStream(req);
          sseStream.pipe(res);

          sseStream.write("message from webserver.");

          let closed = false;

          const compileDoneHook = debounce((stats) => {
            const { modules } = stats.toJson({ all: false, modules: true });
            const updatedJsModules = modules.filter(
              (module) =>
                module.type === "module" &&
                module.moduleType === "javascript/auto"
            );

            const isBackgroundUpdated = updatedJsModules.some((module) =>
              module.nameForCondition.startsWith(
                path.resolve(__dirname, "../src/background")
              )
            );
            const isContentScriptsUpdated = updatedJsModules.some((module) =>
              module.nameForCondition.startsWith(
                path.resolve(__dirname, "../src/content")
              )
            );

            const shouldBackgroundReload =
              !stats.hasErrors() && isBackgroundUpdated;
            const shouldContentScriptsReload =
              !stats.hasErrors() && isContentScriptsUpdated;

            if (shouldBackgroundReload) {
              sseStream.writeMessage(
                {
                  event: "background-updated",
                  data: {}, // "data" key should be reserved though it is empty.
                },
                "utf-8"
              );
            }
            if (shouldContentScriptsReload) {
              sseStream.writeMessage(
                {
                  event: "content-scripts-updated",
                  data: {},
                },
                "utf-8"
              );
            }
          }, 1000);

          const plugin = (stats) => {
            if (!closed) {
              compileDoneHook(stats);
            }
          };

          // a mini webpack plugin just born!
          // this plugin will be triggered after each compilation done.
          compiler.hooks.done.tap("extension-auto-reload-plugin", plugin);

          res.on("close", () => {
            closed = true;
            sseStream.unpipe(res);
          });
        },
      });

      return middlewares;
    },
  },
  compiler
);

server.start();
