// Karma configuration

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // Dependent libs for testing
      'spec/test_lib/jquery-2.1.1.js',
      'spec/test_lib/angular.js',
      'spec/test_lib/angular-mocks.js',
      'spec/test_lib/lodash.js',

      // The actual apps/modules/templates
      'vendor/assets/javascripts/rolodex_angular/**/*.coffee',
      'vendor/assets/javascripts/rolodex_angular/**/*.html',

      // Specs!
      'spec/javascripts/**/*.spec.coffee'
    ],


    // list of files to exclude
    exclude: [
    ],

    ngHtml2JsPreprocessor: {
      stripPrefix: 'source/',
      moduleName: 'templates'
    },

    coverageReporter: {
      type: 'html',
      dir: 'spec/javascripts/rolodex_angular/coverage/'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.html': ['ng-html2js'],
      'vendor/assets/javascripts/rolodex_angular/**/*.coffee': ['coverage'],
      'spec/javascripts/rolodex_angular/**/*.coffee': ['coffee']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox', 'Safari'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
