'use strict';
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var notify = require("gulp-notify");
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');

var config = {
   sassPath: './src/scss',
  npmDir: './node_modules'
}

gulp.task('compile-scss', function () {
  gulp.src('vegeta.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({includePaths: [
    'src/scss',
    config.npmDir + '/font-awesome/scss'
  ]}))
  //.pipe(sass({outputStyle: 'compressed'}))
  .pipe(sass({outputStyle: 'nested'}))
  .on("error", notify.onError(function (error) {
    return "Error: " + error.message;
  }))
  .pipe(postcss([
      require('autoprefixer')({}),
      //require('cssnano')
  ]))
  .pipe(gulp.dest('dist/css'));
});

// apply PostCSS plugins
gulp.task('minify-css', function() {
  return gulp.src('dist/css/vegeta.css')
    .pipe(postcss([
      require('autoprefixer')({}),
      require('cssnano')
    ]))
    .pipe(gulp.dest('dist/css/vegeta.min.css'));
});

gulp.task('font-awesome', function() { 
    return gulp.src(config.npmDir + '/font-awesome/fonts/**.*') .pipe(gulp.dest('./dist/fonts')); 
});

gulp.task('default', ['font-awesome', 'compile-scss', 'browser-sync'], function () {
  gulp.watch("src/scss/**/*.scss", ['compile-scss']).on('change', browserSync.reload);
  gulp.watch('./*.html').on('change', browserSync.reload);
});