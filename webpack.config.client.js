const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const paths = {
  src: path.resolve(__dirname, "src"),
  app: path.resolve(__dirname, "src", "app"),
  build: path.resolve(__dirname, "build"),
  public: path.resolve(__dirname, "build", "public"),
  node_modules: path.resolve(__dirname, "node_modules")
};

const config = {
  target: "web",
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  entry: {
    vendor: ["react", "react-dom"],
    app: [paths.app]
  },
  output: {
    path: paths.public,
    filename: "[name].js",
    publicPath: "/"
  },
  resolve: {
    modules: [paths.src, paths.node_modules],
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  optimization: {
    ...(isProduction
      && {
          splitChunks: {
            cacheGroups: {
              commons: {
                name: "vendors",
                chunks: "all"
              }
            }
          }
        }
      )
  },
  devServer: {
    stats: "minimal",
    overlay: true,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    https: false,
    port: 4000
  },
  plugins: [
    new ESLintPlugin(),
    ...(isProduction
      ? [
          // Production plugins
          new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
          }),
          new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
          }),
          new HtmlWebpackPlugin({
            template: path.resolve(paths.app, "index.html"),
            favicon: path.resolve(paths.app, "favicon.ico"),
            hash: true,
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true
            }
          }),
          new ESLintPlugin()
        ]
      : [
          // Development plugins
          new HtmlWebpackPlugin({
            template: path.resolve(paths.app, "index.html"),
            favicon: path.resolve(paths.app, "favicon.ico"),
            hash: true
          })
        ])
  ],
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: "babel-loader"
      },
      {
        test: /\.(scss|css)$/,
        use: [
          ...(isProduction
            ? [
                MiniCssExtractPlugin.loader,
                {
                  loader: "sass-loader",
                }
              ]
            : [
                {
                  loader: "sass-loader",
                  options: {
                    sourceMap: true
                  }
                }
              ])
        ]
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: "url-loader"
        }
      }
    ]
  }
};

module.exports = config;
