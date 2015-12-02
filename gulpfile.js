var gulp = require("gulp");
var tslint = require("gulp-tslint");
var eslint = require("gulp-eslint");
var beautify = require("gulp-beautify");
var ts = require("gulp-typescript");
var watch = require("gulp-watch");
var browsersync = require("browser-sync").create();

// tasks
// lint javascript and typescript
gulp.task('eslint', function() {
    return gulp.src(['**/*.js', '!node_modules/**', '!bower_components/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
})
gulp.task('tslint', function() {
    return gulp.src('src/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

// cleanup files
gulp.task('beautify-js', function() {
    gulp.src('*.js')
        .pipe(beautify())
        .pipe(gulp.dest('./'));
});
gulp.task('beautify-ts', function() {      
    gulp.src('src/ts/*.ts')
        .pipe(beautify())
        .pipe(gulp.dest('src/ts'));
});

// compile javascript from typescript
var tsProject = ts.createProject('tsconfig.json');
// compile typescript
gulp.task('ts', ['tslint'], function() {
    var tsResult = tsProject.src() // instead of gulp.src(...) 
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest("./"));
});

// copy html and css files to build
gulp.task('copy-build', function() {
    gulp.src('./src/*.html').pipe(gulp.dest('./build/'))
    gulp.src('./src/styles/*.css').pipe(gulp.dest('./build/styles/'))
});


// watch and build on change
gulp.task('watch', ['ts'], function(){
   gulp.watch('src/**/*.ts', ['ts']);
   gulp.watch('./*.js', ['eslint', 'beautify-js']);
   gulp.watch(['src/*.html', './src/styles/*.css'], ['copy-build'])
});

// run BrowserSync
gulp.task('browser-sync', function() {
    browsersync.init({
        server: {
            baseDir: ['./', 'build'],
            index: 'build/index.html'
        },
        files: ['build/**/*.js', 'build/**/*.css', 'build/**/*.html']
    });
    
    gulp.watch(['build/**/*.js', 'build/**/*.css', 'build/**/*.html'])
        .on('change', browsersync.reload);
});

gulp.task('dev-watch', ['ts', 'copy-build', 'watch', 'browser-sync']);