'use strict';

var gulp = require('gulp');
var path = require('path');
var del = require('del');
var source = require('vinyl-source-stream');
var $ = require('gulp-load-plugins')();

var assetPath = 'vendor/assets/javascripts/rolodex_angular';
var distPath = 'dist';
var tmpPath = '.tmp';

// Compiles coffee to js, annotates Angular dependencies
gulp.task('js', ['js-hack'], function() {
  return gulp.src(path.join(assetPath, '/**/*.coffee'))
    .pipe($.coffee())
    .pipe($.ngAnnotate())
    .pipe(gulp.dest(tmpPath))
});

// A hack for non-Ruby projects to fake the templates namespace (which lives in a gem)
gulp.task('js-hack', function() {
  var stream = source('templates.js');
  stream.end("(function() { angular.module('templates', []); }).call(this);");
  stream.pipe(gulp.dest(tmpPath));
});

// Compiles haml to js for Angular templateCache
gulp.task('templates', function() {
  return gulp.src(path.join(assetPath, '/template/**/*.ngt'))
    .pipe($.minifyHtml({ empty: true, spare: true, quotes: true }))
    .pipe($.angularTemplatecache('templates.js', {
      module: 'rolodex',
      root: 'rolodex_angular/template',
      transformUrl: function(url) {
        return url.replace(/\.ngt$/, '')
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

gulp.task('default', ['clean', 'build']);
