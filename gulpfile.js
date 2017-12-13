var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

var dgFileModuleSrc = [
  './src/*.js',
  './src/classes/class.*.js',
  './src/includes/include.*.js',
  './src/forms/form.*.js',
  './src/widgets/widget.*.js'
];

// Task to build the dg_file.min.js file.
gulp.task('minifyJS', function(){
  return gulp.src(dgFileModuleSrc)
      .pipe(gp_concat('concat.js'))
      .pipe(gulp.dest(''))
      .pipe(gp_rename('dg_file.min.js'))
      .pipe(gp_uglify())
      .pipe(gulp.dest(''));
});

gulp.task('default', function () {
  watch(dgFileModuleSrc, function(event) { gulp.start('minifyJS') });
  gulp.start('minifyJS');
});
