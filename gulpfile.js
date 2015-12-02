var gulp = require("gulp");
var tslint = require("gulp-tslint");
var eslint = require("gulp-eslint");
var beautify = require("gulp-beautify");
var ts = require("gulp-typescript");

// tasks
// lint
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

gulp.task('beautify', function() {
    gulp.src('*.js')
        .pipe(beautify())
        .pipe(gulp.dest('./'));
    gulp.src('src/ts/*.ts')
        .pipe(beautify())
        .pipe(gulp.dest('src/ts'));
});


var tsProject = ts.createProject('tsconfig.json');
// compile typescript
gulp.task('ts', function() {
    var tsResult = tsProject.src() // instead of gulp.src(...) 
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest("./"));
});

gulp.task('copy-build', function() {
    gulp.src('./src/*.html').pipe(gulp.dest('./build/'))
    gulp.src('./src/styles/*.css').pipe(gulp.dest('./build/styles/'))
});