var helpers = require('./helpers');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript-loader?sourceMap=false,inlineSourceMap=true'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null'
            },
            {
                test: /\.less$/,
                exclude: helpers.root('app'),
                loader: 'null'
            },
            {
                test: /\.css$/,
                include: helpers.root('app'),
                loader: 'raw'
            }
        ],
        postLoaders: [
            {
                test: /\.ts$/,
                exclude: /(node_modules|app\\spec)/,
                loader: 'istanbul-instrumenter'
            }
        ]
    }
};
