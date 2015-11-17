'use strict';
var gulp        = require('gulp'),
    Config      = require('./gulpfile.config'),
    tsc         = require('gulp-typescript'),
    srcmaps     = require('gulp-sourcemaps'),
    taskListing = require('gulp-task-listing');


var config = new Config();
var indent = "           ";



// gulp.task
// gulp.src
// gulp.dest
// gulp.watch
// gulp.run
// gulp.env


gulp.task('clean',function() {
    // do cleaning
});




gulp.task('default',function() {
    // do the default task
    var src,
        dest;

    src = config.source + config.allts;
    dest = config.build;

    // copy src to dest
    gulp.src(src)
        .pipe(gulp.dest(dest));

});




gulp.task('help',taskListing);




gulp.task('minify',function() {
    //
    process.stdout.write("minify: not yet implemented."  + "\n");
});




gulp.task('showconfig',function() {
    process.stdout.write("Configuration from ./gulpfile.config.js: "  + "\n");
    process.stdout.write(config);
});




gulp.task('sourcemaps',function() {
    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-sourcemaps"  + "\n");
});




gulp.task('test',function() {
    // do testing
    process.stdout.write("test: not yet implemented."  + "\n");
});





gulp.task('tasks',function() {
    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-task-listing"  + "\n");
    taskListing();
});





gulp.task('transpile',function() {
    process.stdout.write(indent + "See https://www.npmjs.com/package/gulp-typescript"  + "\n");

});




gulp.task('uglify',function() {
    //
    process.stdout.write("uglify: not yet implemented."  + "\n");
});




