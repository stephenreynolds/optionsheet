const dotenv = require("dotenv");
const nodeExternals = require("webpack-node-externals");
const path = require("path");
const webpack = require("webpack");

const paths = {
  build: path.resolve(__dirname, "build"),
  node_modules: path.resolve(__dirname, "node_modules"),
  server: path.resolve(__dirname, "src/server")
};

const config = {
  target: "node",
  externals: [nodeExternals()],
  entry: {
    server: path.resolve(paths.server, "server.ts")
  },
  output: {
    path: paths.build,
    filename: "server.js"
  },
  resolve: {
    modules: [paths.server, paths.node_modules],
    extensions: [".js", ".ts"]
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.config().parsed)
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
