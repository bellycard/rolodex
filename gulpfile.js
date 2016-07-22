'use strict';

var gulp = require('gulp');
var path = require('path');
var del = require('del');
var fs = require('fs');
var $ = require('gulp-load-plugins')();

var paths = {
  assets: 'assets', // assets folder
  javascripts: 'javascripts/rolodex_angular', // js files
  stylesheets: 'stylesheets', // sass files

  tmp: '.tmp', // tmp dir for building the dist files
  dist: 'assets/dist', // where compiled files will go
}

// Compiles coffee to js, annotates Angular dependencies
gulp.task('sass', function(callback) {
  return gulp.src(path.join(paths.assets, paths.stylesheets, '**/*.{sass,scss}'))
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe($.cleancss())
    .pipe($.concat('rolodex.css'))
    .pipe(gulp.dest(paths.dist))
});

// Compiles coffee to js, annotates Angular dependencies
gulp.task('coffee', function(callback) {
  return gulp.src(path.join(paths.assets, 'rolodex_angular', '**/*.coffee'))
    .pipe($.coffee())
    .pipe($.ngAnnotate())
    .pipe(gulp.dest(paths.tmp))
});

// Compiles ngt to js for Angular templateCache
gulp.task('templates', function(callback) {
  return gulp.src(path.join(paths.assets, 'rolodex_angular/template', '**/*.ngt'))
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe($.angularTemplatecache('templates.js', {
      module: 'rolodex',
      root: 'rolodex_angular/template',
      transformUrl: function(url) {
        return url.replace(/\.ngt$/, '');
      }
    }))
    .pipe(gulp.dest(paths.tmp));
});

// Builds the dist files
gulp.task('js', ['coffee', 'templates'], function(callback) {
  return gulp.src(path.join(paths.tmp, '**/*.js'))
    .pipe($.concat('rolodex.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe($.uglify())
    .pipe($.rename({extname: '.min.js'}))
    .pipe(gulp.dest(paths.dist))
    .on('finish', function(err) {
      del(paths.tmp, callback);
    })
});

gulp.task('build', ['sass', 'js']);
gulp.task('default', ['build']);
