import path from "path";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import * as lightningcss from "lightningcss";
import browserslist from "browserslist";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default {
  mode: "production",

  devtool: "source-map",

  entry: {
    main: "./src/js/index.js", // JS entry
    styles: "./src/sass/index.scss", // SASS entry
  },

  output: {
    filename: "[name].js",
    path: path.resolve(process.cwd(), "dist"),
    chunkFormat: "module", // explicitly set chunk format to ES module
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          "sass-loader",
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: "async",
    },
    runtimeChunk: false,
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.lightningCssMinify,
        minimizerOptions: {
          targets: lightningcss.browserslistToTargets(
            browserslist(">0.3%, last 2 major versions, not dead")
          ),
          preset: ["default", { discardComments: { removeAll: true } }],
        },
      }),

      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false, // Remove comments
          },
        },
        extractComments: false,
      }),
    ],
  },

  resolve: {
    extensions: [".js", ".scss"],
  },
};
