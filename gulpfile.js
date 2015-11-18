'use strict';
var gulp,
    Config,
    tsc,
    srcmaps,
    taskListing,
    del,
    config,
    indent,
    concat,
    minify,
    beautify,
    tsconfig,
    readjson,
    pkg;


// load modules
gulp        = require('gulp'),
Config      = require('./gulpfile.config'),
tsc         = require('gulp-typescript'),
srcmaps     = require('gulp-sourcemaps'),
taskListing = require('gulp-task-listing'),
del         = require('del'),
concat      = require('gulp-concat'),
minify      = require('gulp-minify'),
beautify    = require('js-beautify');
tsconfig    = require('tsconfig');
readjson    = require('read-package-json');
pkg         = require('./package.json');
// end load modules


// make a new configuration instance:
config = new Config();

// the indent size for gulp's command line stdout
indent = "           ";

/*
 *   from here on, it's just task definitions:
 */


gulp.task('assemble',['_concatenate'],function() {

    var s,
        d,
        libname;

    // copy the html
    s = config.build + config.allhtml;
    d = config.dist;
    gulp.src(s).pipe(gulp.dest(d));

    // copy the javascript:
    libname = pkg.name + "-" + pkg.version + ".js";
    s = config.build + libname;
    d = config.dist;

    gulp.src(s).pipe(gulp.dest(d));

});




gulp.task('_beautify',function() {
    process.stdout.write(indent + "See https://www.npmjs.com/package/js-beautify" + "\n");
    process.stdout.write("beautify: not yet implemented."  + "\n");

});




gulp.task('build',['_transpile', '_copyhtml'],function() {

});




gulp.task('clean',function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/del" + "\n");
    return del([config.build, config.dist]).then(paths => {
        if (false) {
            process.stdout.write('Nothing to clean.\n');
        }
        else {
            // (you need console.log here for some reason)
            console.log('Deleted files and folders:\n', paths.join('\n'));
        };
    });

});





gulp.task('_concatenate', ['_minify'], function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-concat"  + "\n");
    var s,
        d,
        libname;

    s = config.build + config.allminjs;
    d = config.build;
    libname = pkg.name + "-" + pkg.version + ".js";

    return gulp.src(s)
        .pipe(concat(libname))
        .pipe(gulp.dest(d));

});




gulp.task('_copyhtml',function() {

    var s,
        d;

    s = config.src + config.allhtml;
    d = config.build;

    return gulp.src(s)
        .pipe(gulp.dest(d));

});




gulp.task('default',['build'],function() {
});




gulp.task('help',function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-task-listing"  + "\n");
    taskListing();

});




gulp.task('_minify',['build'],function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-minify"  + "\n");

    var s,
        d;

    s = config.build + config.alljs;
    d = config.build;

    return gulp.src(s)
        .pipe(minify({
            ignoreFiles: ['-min.js'],
            mangle: true
        }))
        .pipe(gulp.dest(d));

});




gulp.task('serve',function() {

    process.stdout.write("serve: not yet implemented."  + "\n");

});




gulp.task('showconfig',function() {

    process.stdout.write("Configuration from ./gulpfile.config.js: "  + "\n");
    process.stdout.write(config);
});




gulp.task('test',function() {

    process.stdout.write("test: not yet implemented."  + "\n");

});





gulp.task('tasks',function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-task-listing"  + "\n");
    taskListing();

});




gulp.task('_transpile',function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/tsconfig"  + "\n");
    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-typescript"  + "\n");
    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-sourcemaps"  + "\n");

    var tsconfDir,
        tsconfFile,
        tsconfObj,
        s,
        d,
        tscResult,
        options;

    // the location of the directory that holds tsconfig.json
    tsconfDir = config.src + "ts/";

    // let the tsconfig module find the tsconfig file in tsconfDir
    tsconfFile = tsconfig.resolveSync(tsconfDir);

    // provide feedback on which file we are using
    process.stdout.write(indent + "Using file: " + tsconfFile + "\n");

    // parse the tsconfig file into an object
    tsconfObj = tsconfig.readFileSync(tsconfFile);

    // define the gulp-typescript options
    options = tsconfObj.compilerOptions;

    // source map generation is not supported by gulp-typescript, so we will use
    // gulp-sourcemaps instead. I'm setting the sourceMap option to false here,
    // in order to be more explicit about what we do.
    options.sourceMap = false;

    // define the sources that you want gulp-typescript to compile
    s = tsconfObj.files;

    // tsconfDir contains the directory where tsconfig.json lives (relative to
    // the root directory); options.outDir contains the directory where the
    // TypeScript compiler should output its files (relative to the directory
    // containing tsconfig.json); by concatenating them, you get the location
    // that can be passed to gulp.dest():
    d = tsconfDir + options.outDir;

    tscResult = gulp.src(s)       // Take the TypeScript sources...
        .pipe(srcmaps.init())     // generate source maps (in memory)...
        .pipe(tsc(options));      // transpile the TypeScript into JavaScript (in memory)

    return tscResult.js           // Take the JavaScript that was just generated...
        .pipe(srcmaps.write('.')) // write the source maps next to where the JavaScript will be...
        .pipe(gulp.dest(d));      // write the JavaScript files.

});


