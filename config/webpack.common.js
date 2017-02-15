var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    entry: {
        'polyfills': './app/polyfills.ts',
        'vendor': './app/vendor.ts',
        'app': './app/main.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js'],
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=/assets/[name].[hash].[ext]'
            },
            {
                test: /\.less$/,
                exclude: helpers.root('app'),
                loader: ExtractTextPlugin.extract('style', 'css-loader?sourcemap!less-loader?sourcemap')
            },
            {
                test: /\.css$/,
                include: helpers.root('app'),
                loader: 'raw'
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['static'], {
            root: helpers.root()
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            inject: false,
            filename: 'chunks/chunk-css.cshtml',
            template: './config/chunk-css.ejs'
        }),

        new HtmlWebpackPlugin({
            inject: false,
            filename: 'chunks/chunk-js.cshtml',
            template: './config/chunk-js.ejs'
        })
    ]
};
