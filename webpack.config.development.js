var path = require('path');
var webpack = require('webpack');
var assign = require('object-assign');
var base = require('./webpack.config.base');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = assign({}, base, {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({ template: './index.html' })
  ]
});
