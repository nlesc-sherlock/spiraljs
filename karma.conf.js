// Karma configuration
// Generated on Thu Aug 11 2016 15:00:14 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'fixture'],


    // list of files / patterns to load in the browser
    files: [
        {pattern: 'node_modules/d3/d3.js', included: true},
        {pattern: 'node_modules/lodash/index.js', included: true}, 
        {pattern: 'dist/spiral.js', included: true},
        {pattern: 'test/*.unit.js', included: true}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        '**/*.html': ['html2js'],
        '**/*.json': ['json_fixtures'],
        'dist/spiral.js': ['coverage']
    },

    // I think this next property is a custom field (not part of the default
    // karma configuration, but it is needed by the json fixtures preprocessor.
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },

    // This is also a custom property AFAICT.
    coverageReporter: {
      // specify a common output directory
      dir: './docs/sites/coverage',
      reporters: [
        { type: 'json', subdir: '.', file: 'coverage.json' }
      ]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage', 'progress'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
