import path from "path";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import * as lightningcss from "lightningcss";
import browserslist from "browserslist";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

// e.g. BROWSERS_ENV=aggressive webpack ...
const BROWSERS_ENV = process.env.BROWSERS_ENV || "baseline";

const BROWSERS_QUERIES = {
  aggressive:
    ">= 0.5%, last 2 major versions, not dead, Chrome >= 60, Firefox >= 60, Firefox ESR, iOS >= 12, Safari >= 12, not Explorer <= 11, not kaios <= 2.5",
  baseline: "baseline widely available",
};

const browsersQuery = BROWSERS_QUERIES[BROWSERS_ENV] || BROWSERS_QUERIES.wide;

const lightningTargets = lightningcss.browserslistToTargets(
  browserslist(browsersQuery),
);

export default {
  mode: "production",
  devtool: "source-map",

  entry: {
    main: "./src/js/index.js",
    styles: "./src/sass/index.scss",
  },

  output: {
    filename: "[name].js",
    path: path.resolve(process.cwd(), "dist"),
    chunkFormat: "module",
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
          targets: lightningTargets,
          preset: ["default", { discardComments: { removeAll: true } }],
        },
      }),

      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
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
