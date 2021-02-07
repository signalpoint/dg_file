var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

var moduleSrc = [
  './src/*.js',
  './src/classes/class.*.js',
  './src/includes/include.*.js',
  './src/widgets/widget.*.js'
];

// Minify JavaScript
function minifyJs() {
  console.log('compressing dg_file.js...');
  var moduleJs = gulp.src(moduleSrc)
    .pipe(gp_concat('dg_file.js'))
    .pipe(gulp.dest('./'));
    console.log('compressing dg_file.min.js...');
  return moduleJs.pipe(gp_rename('dg_file.min.js'))
    .pipe(gp_uglify())
    .pipe(gulp.dest('./'));
}
gulp.task(minifyJs);

gulp.task('default', function(done) {

  gulp.watch(moduleSrc, gulp.series('minifyJs'));

  done();

});
