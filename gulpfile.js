'use strict';
var gulp,
    help,
    Config,
    tsc,
    srcmaps,
    showtasks,
    del,
    config,
    indent,
    concat,
    minify,
    beautify,
    tsconfig,
    pkg,
    serve,
    tsd,
    tslint,
    libname,
    browsersync;


/*
 * module loading start
 */

// the base module for gulp build files:
gulp = require('gulp-help')(require('gulp'));

// a file that contains the project's layout:
Config = require('./gulpfile.config');

// the typescript compiler
tsc = require('gulp-typescript');

// module for generating source maps linking (unminified/unuglified) typescript
// to the JavaScript (helpful in debugging)
srcmaps = require('gulp-sourcemaps');

// a module that lets you print the available tasks from this file at the
// command line
showtasks = require('gulp-task-listing');

// a module that lets you delete files and directories
del = require('del');

// a module that lets you concatenate files
concat = require('gulp-concat');

// a module that lets you minify files, including file name mangling
minify = require('gulp-minify');

// a module that is able to parse the tsconfig file into a JavaScript object
tsconfig = require('tsconfig');

// a module that lets you read in the contents of package.json, such as the
// package name and version
pkg = require('./package.json');

// webserver
serve = require('gulp-serve');

// this module lets you get TypeScript Definitions/typings from DefinitelyTyped
tsd = require('gulp-tsd');

// this module lets you lint the typescript code according to the rules from
tslint = require('gulp-tslint'),

// use browser-sync for reloading
browsersync = require('browser-sync');
var reload = browsersync.reload;

libname = pkg.name + '-' + pkg.version + '.js';


/*
 * module loading end
 */


// make a new configuration instance:
config = new Config();

// the indent size for gulp's command line stdout
indent = '           ';


/*
 *
 * from here on, it's just task definitions
 * (you can get a list by entering
 * gulp tasks
 * at the command line)
 *
 */


gulp.watch([
    'src/**/*.ts',
    'src/**/*.css'
]).on('change', reload);


gulp.task('assemble',['_copyhtml', '_copycss', '_minify'],function() {

    process.stdout.write(indent + 'TODO: Errors may arise due to the order in which JS files were concatenated.' + '\n');

});




gulp.task('build',['_transpile'],function() {

});




gulp.task('checkout',['clean'],function() {

    process.stdout.write(indent + 'See https://www.npmjs.com/package/del' + '\n');
    return del(['node_modules']).then(function(paths) {
        if (paths.length === 0) {
            process.stdout.write(indent + 'Nothing to clean.\n');
        }
        else {
            process.stdout.write(indent + 'Deleted files and folders:' + '\n');
            for (var path of paths) {
                process.stdout.write(indent + path + '\n');
            }
        };
    });

});




gulp.task('clean',function() {

    process.stdout.write(indent + 'See https://www.npmjs.com/package/del' + '\n');
    return del([config.build, config.dist, config.typings]).then(function(paths) {
        if (paths.length === 0) {
            process.stdout.write(indent + 'Nothing to clean.\n');
        }
        else {
            // (you need console.log here for some reason)
            process.stdout.write(indent + 'Deleted files and folders:' + '\n');
            for (var path of paths) {
                process.stdout.write(indent + path + '\n');
            }
        };
    });

});





gulp.task('_concatenate', ['build'], function() {

    process.stdout.write(indent + 'See https://www.npmjs.com/package/gulp-concat'  + '\n');
    var s,
        d;

    // take all unminified js sources from build
    s = [config.build + '**/' + config.alljs, '!' + config.build + '**/' + config.allminjs];
    d = config.dist;

    return gulp.src(s)
        .pipe(concat(libname))
        .pipe(gulp.dest(d));

});




gulp.task('_copycss',function() {

    var s,
        d;

    s = config.build + '**/' + config.allcss;
    d = config.dist;

    return gulp.src(s).pipe(gulp.dest(d));

});




gulp.task('_copyhtml',function() {

    var s,
        d;

    s = config.build + config.allhtml;
    d = config.dist;

    return gulp.src(s).pipe(gulp.dest(d));

});




gulp.task('default',['assemble'],function() {
    // set default as an alias for assemble
});


// (for some reason, showtasks does not work when it's inside a function)
// process.stdout.write(indent + 'See https://www.npmjs.com/package/gulp-task-listing'  + '\n');
gulp.task('help', showtasks.withFilters(/^[_]{1}/gi) );



gulp.task('_tslint',function() {

    process.stdout.write(indent + 'See https://www.npmjs.com/package/tslint'  + '\n');

    var s = config.src + 'ts/' + config.allts;

    return gulp.src(s)
        .pipe(tslint())
        .pipe(tslint.report('verbose'));

});




gulp.task('_minify',['_concatenate'],function() {

    process.stdout.write(indent + 'See https://www.npmjs.com/package/gulp-minify'  + '\n');

    var s,
        d;

    s = config.dist + libname;
    d = config.dist;

    return gulp.src(s)
        .pipe(minify({
            ignoreFiles: ['-min.js'],
            mangle: true
        }))
        .pipe(gulp.dest(d));

});




gulp.task('_tsd', function (callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});




gulp.task('serve-build', serve({
    root: config.build,
    port: 8087
}));




gulp.task('serve-dist', serve({
    root: config.dist,
    port: 8088
}));




gulp.task('showconfig',function() {

    process.stdout.write('Configuration from ./gulpfile.config.js: '  + '\n');
    process.stdout.write(config);
});




gulp.task('_srctobuild',function() {

    var s,
        d;

    s = config.src + '**/*';
    d = config.build;

    return gulp.src(s, {base: config.src}).pipe(gulp.dest(d));

});




gulp.task('test',function() {

    process.stdout.write('test: not yet implemented.'  + '\n');

});




gulp.task('tasks',function() {

    process.stdout.write(indent + 'See https://www.npmjs.com/package/gulp-task-listing'  + '\n');
    showtasks();

});




gulp.task('_transpile',['_srctobuild','_tsd', '_tslint'],function() {

    process.stdout.write(indent + 'See https://www.npmjs.com/package/tsconfig'  + '\n');
    process.stdout.write(indent + 'See https://www.npmjs.com/package/gulp-typescript'  + '\n');
    process.stdout.write(indent + 'See https://www.npmjs.com/package/gulp-sourcemaps'  + '\n');

    var tsconfDir,
        tsconfFile,
        tsconfObj,
        s,
        d,
        tscResult,
        options;

    // the location of the directory that holds tsconfig.json
    tsconfDir = config.build + 'ts/';

    // let the tsconfig module find the tsconfig file in tsconfDir
    tsconfFile = tsconfig.resolveSync(tsconfDir);

    // provide feedback on which file we are using
    process.stdout.write(indent + 'Using file: ' + tsconfFile + '\n');

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

    d = config.build + 'ts/';

    tscResult = gulp.src(s)       // Take the TypeScript sources...
        .pipe(srcmaps.init())     // generate source maps (in memory)...
        .pipe(tsc(options));      // transpile the TypeScript into JavaScript (in memory)

    return tscResult.js           // Take the JavaScript that was just generated...
        .pipe(srcmaps.write('.')) // write the source maps next to where the JavaScript will be...
        .pipe(gulp.dest(d));      // write the JavaScript files.

});


