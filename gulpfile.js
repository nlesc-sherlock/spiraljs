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
var jasmine = require('gulp-jasmine');
var tapcolorize = require('tap-colorize');
var tapspec = require('tap-spec');

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
gulp.task('ts', ['tslint'],
    function() {
        'Compiles typescript to javascript according to tsconfig.json'
        var tsResult = tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

        return tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("./"));
    });

var tsProjectTests = ts.createProject('src/tests/tsconfig.json')

// compile typescript
gulp.task('build-tests', ['ts'],
    function() {
        'Compiles typescript to javascript according to tsconfig.json'
        var tsResult = tsProjectTests.src()
            .pipe(sourcemaps.init())
            .pipe(ts(tsProjectTests));

        return tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("./src/tests"));
    });

gulp.task('test', ['build-tests'],
    function() {
      'Runs tests'
      return gulp.src('build/js/**/*.spec.js')
          .pipe(jasmine())
          .pipe(tapcolorize())
          .pipe(tapspec());
    });

var typedoc = require("gulp-typedoc");
gulp.task("typedoc", function() {
    return gulp
        .src(["src/ts/**/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: "spiral-js"
        }));
});

//concatenate css files
gulp.task('concat-css',
    function() {
        'Concatenates css files'
        return gulp.src('src/**/*.css')
            .pipe(concatCss('bundle.css'))
            .pipe(gulp.dest('build/styles/'));
    });

// copy html and css files to build
gulp.task('copy-build',
    function() {
        'Copies html to build directory'
        gulp.src('./src/*.html').pipe(gulp.dest('./build/'))
    });


// watch and build on change
gulp.task('watch', false, ['ts'], function() {
    gulp.watch('src/**/*.ts', ['ts']);
    gulp.watch('src/tests/**/*.ts', ['build-tests']);
    gulp.watch('./*.js', ['eslint', 'beautify-js']);
    gulp.watch(['src/*.html'], ['copy-build']);
    gulp.watch(['./src/styles/*.css'], ['concat-css']);
});

// run BrowserSync
gulp.task('browser-sync', ['copy-build', 'concat-css'],
    function() {
        'Serves files with BrowserSync, starts and restarts browser on changes'
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
    function(cb) {
        'Remove files generated in build process'
        rimraf('./build', cb);
    });

// Watches files for development
gulp.task('dev-watch',
    ['browser-sync']);
