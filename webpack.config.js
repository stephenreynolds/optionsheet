const dotenv = require("dotenv");
const nodeExternals = require("webpack-node-externals");
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const paths = {
  build: path.resolve(__dirname, "build"),
  src: path.resolve(__dirname, "src"),
  node_modules: path.resolve(__dirname, "node_modules")
};

const config = {
  target: "node",
  mode: "production",
  externals: [nodeExternals()],
  entry: {
    server: path.resolve(paths.src, "server.ts")
  },
  output: {
    path: paths.build,
    filename: "server.js",
    clean: true
  },
  resolve: {
    modules: [__dirname, paths.node_modules],
    extensions: [".js", ".ts"]
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.config().parsed)
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, "node_modules/swagger-ui-dist/"),
        to: "swagger-ui-dist",
        globOptions: {
          test: /\.(js|css|html|png)$/i,
          ignore: ["index.js", "absolute-path.js", "*.map"]
        }
      }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  }
};

module.exports = config;