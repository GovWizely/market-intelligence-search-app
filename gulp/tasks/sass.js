var sass = require('gulp-sass'),
    minify = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    util = require('gulp-util'),
    plumber = require('gulp-plumber'),
    taskName = require('../taskname.js');

module.exports = function(gulp, config) {
  var buildTaskName = taskName('sass:build', config);
  var watchTaskName = taskName('sass:watch', config);

  gulp.task(buildTaskName, function() {
    var output = gulp.src(config.sass.path)
      .pipe(plumber())
      .pipe(sass({
        style: 'compressed',
        loadPath: config.sass.loadPaths
      }))
      .pipe(gulp.dest(config.dist.style))
      .pipe(config.serverStream ? config.serverStream() : util.noop());

    if (config.env === 'production') {
      return gulp.src(config.dist.style + '/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(minify())
        .on('error', util.log)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dist.style));
    }
    return output;
  });

  gulp.task(watchTaskName, function() {
    gulp.watch(config.sass.path, [buildTaskName]);
  });
};