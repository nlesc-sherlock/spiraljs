'use strict';
var gulp,
    Config,
    tsc,
    srcmaps,
    taskListing,
    del,
    config,
    indent,
    tscoptions,
    concat,
    minify;


// load modules
gulp        = require('gulp'),
Config      = require('./gulpfile.config'),
tsc         = require('gulp-typescript'),
srcmaps     = require('gulp-sourcemaps'),
taskListing = require('gulp-task-listing'),
del         = require('del') ;
concat      = require('gulp-concat');
minify      = require('gulp-minify');
// end load modules


// make a new configuration instance:
config = new Config();

// the indent size for gulp's command line stdout
indent = "           ";


// the options that are passed to the typescript compiler:
tscoptions = {
    outDir: config.build,
    noImplicitAny: true,
    target: "es5",
    removeComments: false
}




// from here on, it's just task definitions:
gulp.task('assemble',['uglify'],function() {
});




gulp.task('build',['transpile', 'copy-html'],function() {

});




gulp.task('clean',function() {

    process.stdout.write(indent + "see https://www.npmjs.com/package/del" + "\n");
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

    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-typescript"  + "\n");

    var src,
        dest,
        tsResult;

    src = config.src + 'ts/' + config.allts;
    dest = config.build;

    tsResult = gulp.src(src)
                       .pipe(srcmaps.init()) // This means sourcemaps will be generated
                       .pipe(tsc(tscoptions));

    return tsResult.js
                .pipe(srcmaps.write('.')) // Now the sourcemaps are added to the .js file
                .pipe(gulp.dest(dest));

});

