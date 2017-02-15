var webpackConfig = require('./webpack.test');

module.exports = function(config) {
    config.set({
        basePath: '',

        frameworks: ['jasmine', 'fixture'],

        // list of files / patterns to load in the browser
        files: [
            {pattern: '../node_modules/d3/d3.js', included: true},
            {pattern: '../node_modules/lodash/index.js', included: true},
            {pattern: '../dist/spiral.js', included: true},
            {pattern: '../test/*.unit.js', included: true}
        ],

        preprocessors: {
            '../**/*.html': ['html2js'],
            '../**/*.json': ['json_fixtures'],
            '../dist/spiral.js': ['coverage'],
            '../src/**/*(.ts|.js)': ['sourcemap']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true
        },

        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                options: {
                    windowName: 'my-window',
                    settings: {
                        webSecurityEnabled: false
                    },
                },
                flags: ['--load-images=true'],
                debug: false
            }
        },

        coverageReporter: {
            dir: '../docs/sites/coverage',
            reporters: [
                {
                    type: 'json',
                    subdir: '.',
                    file: 'coverage.json'
                }
            ]
        },

        reporters: ['spec', 'progress', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS_custom'], // ['IE', 'Chrome', 'PhantomJS_custom', 'PhantomJS', ]
        singleRun: true
    });
};
