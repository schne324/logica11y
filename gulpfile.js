'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babel = require('gulp-babel');

gulp.task('default', ['build']);
gulp.task('build', ['babelify']);

gulp.task('browserify', () => {
  return browserify('./logica11y.js', {
    standalone: 'logica11y'
  })
    .bundle()
    .pipe(source('logica11y.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('babelify', ['browserify'], () => {
  return gulp.src('./dist/logica11y.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', () => {
  return gulp
    .src('./test/runner.html')
    .pipe(mochaPhantomJS({
      reporter: 'spec'
    }));
});

gulp.task('watch', () => {
  gulp.watch(['./logica11y.js', 'lib/**/*.js'], ['build']);
});
