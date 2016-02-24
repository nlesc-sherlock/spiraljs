var gulp = require('gulp-help')(require('gulp'));
var tslint = require('gulp-tslint');
var eslint = require('gulp-eslint');
var beautify = require('gulp-beautify');
var sourcemaps = require("gulp-sourcemaps");
var ts = require('gulp-typescript');
var concatCss = require('gulp-concat-css');
var watch = require('gulp-watch');
var browsersync = require('browser-sync').create();
var rimraf = require('rimraf');

// tasks
// lint javascript and typescript
gulp.task('eslint', 'Lints javascript files with eslint', function() {
    return gulp.src(['**/*.js', '!node_modules/**', '!bower_components/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
})
gulp.task('tslint',
    'Lints typescript with tslint according to tslint.json present',
    function() {
        return gulp.src('src/**/*.ts')
            .pipe(tslint())
            .pipe(tslint.report('verbose'));
    });

// cleanup files
gulp.task('beautify-js', false, function() {
    gulp.src('*.js')
        .pipe(beautify())
        .pipe(gulp.dest('./'));
});
gulp.task('beautify-ts', false, function() {
    gulp.src('src/ts/*.ts')
        .pipe(beautify())
        .pipe(gulp.dest('src/ts'));
});

// compile javascript from typescript
var tsProject = ts.createProject('tsconfig.json');
// compile typescript
gulp.task('ts',
    'Compiles typescript to javascript according to tsconfig.json', ['tslint'],
    function() {
        var tsResult = tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

        return tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("./"));
    });


//concatenate css files
gulp.task('concat-css',
    'Concatenates css files',
    function() {
        return gulp.src('src/**/*.css')
            .pipe(concatCss('bundle.css'))
            .pipe(gulp.dest('build/styles/'));
    });

// copy html and css files to build
gulp.task('copy-build',
    'Copies html to build directory',
    function() {
        gulp.src('./src/*.html').pipe(gulp.dest('./build/'))
    });


// watch and build on change
gulp.task('watch', false, ['ts'], function() {
    gulp.watch('src/**/*.ts', ['ts']);
    gulp.watch('./*.js', ['eslint', 'beautify-js']);
    gulp.watch(['src/*.html'], ['copy-build']);
    gulp.watch(['./src/styles/*.css'], ['concat-css']);
});

// run BrowserSync
gulp.task('browser-sync',
    'Serves files with BrowserSync, starts and restarts browser on changes',
    function() {
        browsersync.init({
            server: {
                baseDir: ['./', 'build'],
                index: 'build/index.html'
            },
            files: ['build/**/*.js', 'build/**/*.css', 'build/**/*.html'],
            browser: []
        });

        gulp.watch(['build/**/*.js', 'build/**/*.css', 'build/**/*.html'])
            .on('change', browsersync.reload);
    });

gulp.task('clean',
    'Remove files generated in build process',
    function(cb) {
        rimraf('./build', cb);
    });

gulp.task('dev-watch',
    'Watches files for development', ['ts', 'concat-css', 'copy-build', 'watch', 'browser-sync']);