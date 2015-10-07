'use strict';

var gulp = require('gulp');
var path = require('path');
var del = require('del');
var $ = require('gulp-load-plugins')();

var assetPath = 'vendor/assets/javascripts/rolodex_angular';
var distPath = 'dist';
var tmpPath = '.tmp';

// Compiles coffee to js, annotates Angular dependencies
gulp.task('js', function() {
  return gulp.src(path.join(assetPath, '/src/**/*.coffee'))
    .pipe($.coffee())
    .pipe($.ngAnnotate())
    .pipe(gulp.dest(tmpPath))
});

// Compiles haml to js for Angular templateCache
gulp.task('templates', function() {
  return gulp.src(path.join(assetPath, '/template/**/*.haml'))
    .pipe($.haml())
    .pipe($.rename(function(path) { path.extname = '.html'; }))
    .pipe($.minifyHtml({ empty: true, spare: true, quotes: true }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'rolodex',
      root: 'rolodex_angular/template',
      transformUrl: function(url) {
        return url.replace(/\.ngt\.html$/, '')
      }
    }))
    .pipe(gulp.dest(tmpPath));
});

// Builds the dist files
gulp.task('build', ['js', 'templates'], function() {
  return gulp.src(path.join(tmpPath, '/**/*.js'))
    .pipe($.concat('rolodex.js'))
    .pipe(gulp.dest(distPath))
    .pipe($.uglify())
    .pipe($.rename({extname: ".min.js"}))
    .pipe(gulp.dest(distPath))
});

// Cleans the build folder and tmp folder for development
gulp.task('clean', function (done) {
  del([tmpPath, distPath], done);
});

gulp.task('default', ['js']);
