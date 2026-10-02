/* eslint-env node */
'use strict';

module.exports = function(config) {
  config.set({
    files: [
      { pattern: 'test/support/**/*', included: false },
      'test/**/*.test.js'
    ],

    browsers: ['ChromeHeadless'],

    // GitHub Actions' ubuntu-24.04 runners block Chrome's user-namespace
    // sandbox, so CI launches with --no-sandbox (see .github/workflows/ci.yml).
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    frameworks: ['browserify', 'mocha'],

    // Listed explicitly so karma doesn't auto-load karma-sauce-launcher, which
    // only karma.conf.ci.js uses and which fails to load without its install
    // scripts (CI installs with --ignore-scripts).
    plugins: [
      'karma-browserify',
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-spec-reporter'
    ],

    reporters: ['spec'/* , 'coverage' */],

    preprocessors: {
      'test/**/*.js': 'browserify'
    },

    client: {
      mocha: {
        grep: process.env.GREP
      }
    },

    browserify: {
      debug: true
      // FIXME(ndhoule): IE7/8 choke on coverage instrumentation; enable after
      // dropping support for those browsers
      // transform: [
      //   [
      //     'browserify-istanbul',
      //     {
      //       instrumenterConfig: {
      //         embedSource: true
      //       }
      //     }
      //   ]
      // ]
    }

    // coverageReporter: {
    //   reporters: [
    //     { type: 'text' },
    //     { type: 'html' },
    //     { type: 'json' }
    //   ]
    // }
  });
};
