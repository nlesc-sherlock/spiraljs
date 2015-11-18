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
    tsconfig;


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
// end load modules


// make a new configuration instance:
config = new Config();

// the indent size for gulp's command line stdout
indent = "           ";

/*
 *   from here on, it's just task definitions:
 */


gulp.task('assemble',['uglify'],function() {
});




gulp.task('beautify',function() {
    process.stdout.write(indent + "See https://www.npmjs.com/package/js-beautify" + "\n");
    process.stdout.write("beautify: not yet implemented."  + "\n");

});




gulp.task('build',['transpile', 'copy-html'],function() {

});




gulp.task('clean',function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/del" + "\n");
    del([config.build, config.dist]).then(paths => {
        if (false) {
            process.stdout.write('Nothing to clean.\n');
        }
        else {
            // (you need console.log here for some reason)
            console.log('Deleted files and folders:\n', paths.join('\n'));
        };
    });

});





gulp.task('concatenate',['minify'],function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-concat"  + "\n");
    var src,
        dest;

    src = config.build + config.allminjs;
    dest = config.build;

    return gulp.src(src)
        .pipe(concat('concatenated.js'))
        .pipe(gulp.dest(dest));

});




gulp.task('copy-html',function() {

    var src,
        dest;

    src = config.src + config.allhtml;
    dest = config.build;

    return gulp.src(src)
        .pipe(gulp.dest(dest));

});




gulp.task('default',['build'],function() {
});




gulp.task('help',function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-task-listing"  + "\n");
    taskListing();

});




gulp.task('minify',['build'],function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-minify"  + "\n");

    var src,
        dest;

    src = config.build + config.alljs;
    dest = config.build;

    gulp.src(src)
        .pipe(minify({
            ignoreFiles: ['*-min.js'],
            mangle: true
        }))
        .pipe(gulp.dest(dest));

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




gulp.task('transpile',function() {

    process.stdout.write(indent + "See https://www.npmjs.com/package/tsconfig"  + "\n");
    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-typescript"  + "\n");

    var tsconfDir,
        tsconfFile,
        tsconfObj,
        src,
        dest,
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

    // define the tsc options
    options = tsconfObj.compilerOptions;

    // define the sources that you want tsc to compile
    src = tsconfObj.files;

    // tsconfDir contains the directory where tsconfig.json lives (relative to
    // the root directory); options.outDir contains the directory where the
    // TypeScript compiler should output its files (relative to the directory
    // containing tsconfig.json); by concatenating them, you get the location
    // that can be passed to gulp.dest():
    dest = tsconfDir + options.outDir;

    tscResult = gulp.src(src)     // Take the TypeScript sources...
        .pipe(srcmaps.init())     // generate source maps (in memory)...
        .pipe(tsc(options));      // transpile the TypeScript into JavaScript (in memory)

    return tscResult.js           // Take the JavaScript that was just generated...
        .pipe(srcmaps.write('.')) // write the source maps next to where the JavaScript will be...
        .pipe(gulp.dest(dest));   // write the JavaScript files.

});


