var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'hidden-source-map',

    output: {
        path: helpers.root('static'),
        publicPath: 'static/',
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[id].[hash].chunk.js'
    },

    htmlLoader: {
        minimize: false
    },

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                keep_fnames: true
            }
        }),
        new ExtractTextPlugin('css/[name].[hash].css')
    ]
});