/*
 * grunt-git-commits
 * https://github.com/tixz/grunt-git-commits
 *
 * Copyright (c) 2014 Emil Bay
 * Licensed under the ISC license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    eslint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= tape.files %>'
      ]
    },

    // Configuration to be run (and then tested).
    commits: {
      default: {
        options: {
          format: /^(Add|Update|Fix|Remove|Docs|Deps):/
        },
        files: [{
          cwd: 'test/fixtures'
        }]
      },
      fail: {
        options: {
          format: /^(Add|Update|Fix|Remove|Docs|Deps):/,
          strict: true,
          cwd: 'test/fixtures'
        }
      },
      proceedBuild: {
        options: {
          format: /^(Add|Update|Fix|Remove|Docs|Deps):/,
          strict: false,
          cwd: 'test/fixtures'
        }
      },
      beginAfter: {
        options: {
          format: /^(Add|Update|Fix|Remove|Docs|Deps):/,
          begin: 'de988f5',
          strict: true,
          cwd: 'test/fixtures'
        }
      },
      includeMerges: {
        options: {
          format: /^(Add|Update|Fix|Remove|Docs|Deps):/,
          noMerges: false,
          strict: true,
          cwd: 'test/fixtures'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['eslint', 'test']);

};