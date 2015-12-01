var gulp = require("gulp");
var eslint = require("gulp-eslint");
var ts = require("gulp-typescript");
var merge = require("merge2");


// tasks
// lint
gulp.task('lint', function(){
    return gulp.src(['**/*.js', '!node_modules/**', '!bower_components/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
})

var tsProject = ts.createProject('tsconfig.json');
// compile typescript
gulp.task('ts', function () {
    var tsResult = tsProject.src() // instead of gulp.src(...) 
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest("./"));
});
