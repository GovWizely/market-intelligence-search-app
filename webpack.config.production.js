var webpack = require('webpack');
var assign = require('object-assign');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var base = require('./webpack.config.base');

module.exports = assign({}, base, {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './src/index'
  ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('app.css'),
    new HtmlWebpackPlugin({ template: base.index })
  ]
});
