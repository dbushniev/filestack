require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/* const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')
 *   .BundleAnalyzerPlugin; */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

module.exports = {
  mode: nodeEnv,
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    historyApiFallback: true,
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      'react-dom': isProduction ? 'react-dom' : '@hot-loader/react-dom',
      '@app': path.join(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s(x)?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'file-loader',
        },
      },
      {
        test: /\.(otf|eot|ttf|woff|woff2)(\??\#?v=[.0-9]+)?$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      GDRIVE_CLIENT_ID: process.env.GDRIVE_CLIENT_ID,
      GDRIVE_API_KEY: process.env.GDRIVE_API_KEY,
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      title: 'studyedge web',
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].bundle.css',
    }),
    /* new WebpackBundleAnalyzer(), */
  ],
};
