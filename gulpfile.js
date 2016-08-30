var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


//script paths
var jsFiles = 'js/*.js',
    jsDest = '';


gulp.task('default', function() {
    return gulp.src(jsFiles)
        .pipe(concat('app13.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

