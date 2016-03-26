var path = require('path');
var cwd = process.cwd();
var fs = require('fs-extra');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var getWebpackCommon = require('./getWebpackCommon');
var HtmlWebpackPlugin = require('html-webpack-plugin');

function getEntry() {
  var exampleDir = path.join(cwd, 'examples');
  var files = fs.readdirSync(exampleDir);
  var entry = {};
  files.forEach(function (file) {
    var extname = path.extname(file);
    var name = path.basename(file, extname);
    if (extname === '.js' || extname === '.jsx') {
      entry[name] = ['./examples/' + file];
    }
  });
  return entry;
}

const entries = getEntry();
console.log('entries', entries);
const plugins = [];
const keys = Object.keys(entries);
for (var i = 0; i < keys.length; i++) {
  var entry = keys[i];
  plugins.push(new HtmlWebpackPlugin({
    inject: true,
    minify: false,
    title: entry,
    hash: true,
    filename: entry + '.html',
    chunks: ['common', entry],
    template: './examples/tpl.html',
  }));
}



plugins.push(new ExtractTextPlugin('[name].css', {
  disable: false,
  allChunks: true,
}));

plugins.push(new webpack.optimize.CommonsChunkPlugin('common', 'common.js'));

module.exports = function () {
  return {
    devtool: '#source-map',

    resolveLoader: getWebpackCommon.getResolveLoader(),

    entry: entries,

    output: {
      path: path.join(cwd, 'build', 'examples'),
      // publicPath: './',
      filename: '[name].js',
    },

    module: {
      loaders: getWebpackCommon.getLoaders().concat(getWebpackCommon.getCssLoaders(true)),
    },

    resolve: getWebpackCommon.getResolve(),

    plugins: plugins,
  };
};
