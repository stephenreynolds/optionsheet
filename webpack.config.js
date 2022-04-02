const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === "production";

const paths = {
  src: path.resolve(__dirname, "src"),
  public: path.resolve(__dirname, "public"),
  build: path.resolve(__dirname, "build"),
  node_modules: path.resolve(__dirname, "node_modules")
};

module.exports = (env) => {
  return {
    target: "web",
    mode: "production",
    devtool: isProduction ? "source-map" : "cheap-module-source-map",
    entry: {
      app: path.resolve(paths.src, "index.tsx")
    },
    output: {
      path: paths.build,
      publicPath: "/",
      filename: "static/js/[name].[contenthash:8].js",
      chunkFilename: "static/js/[name].[chunkhash:8].js",
      clean: true
    },
    resolve: {
      modules: [paths.node_modules],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        "react/jsx-runtime.js": "react/jsx-runtime",
        "react/jsx-dev-runtime.js": "react/jsx-dev-runtime"
      }
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        automaticNameDelimiter: "-",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            filename: "static/js/vendor-[chunkhash:8].js",
            priority: -10
          }
        }
      }
    },
    devServer: {
      client: {
        logging: "warn",
        overlay: true
      },
      historyApiFallback: true,
      headers: { "Access-Control-Allow-Origin": "*" },
      https: false,
      port: 4000,
      static: false
    },
    plugins: [
      new ESLintPlugin(),
      new LodashModuleReplacementPlugin(),
      ...(isProduction ?
        new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      }) : []),
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
      }),
      new HtmlWebpackPlugin(
        Object.assign({},
          {
            template: path.resolve(paths.public, "index.html"),
            inject: true
          },
          isProduction ? {
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
            }
            : undefined
        )
      ),
      new CopyPlugin({
        patterns: [
          {
            from: paths.public,
            to: paths.build,
            globOptions: {
              ignore: [
                "**/index.html"
              ]
            }
          }
        ]
      }),
      ...(env.stats ? [
        new BundleAnalyzerPlugin({
          generateStatsFile: true
        })
      ] : [])
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
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader"
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    "postcss-flexbugs-fixes",
                    [
                      "postcss-preset-env",
                      {
                        autoprefixer: {
                          flexbox: "no-2009"
                        },
                        stage: 3
                      }
                    ],
                    "postcss-normalize"
                  ]
                }
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: false
              }
            }
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
};