/*
 * grunt-commits
 * https://github.com/tixz/grunt-git-commits
 *
 * Copyright (c) 2014 Emil Bay
 * Licensed under the ISC license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('commits', 'Enforce commit message format', function() {
    var done = this.async();

    var options = this.options({
      //Validate commits exclusive after sha
      begin: null,
      //Conform to
      format: /.*/,
      //Ignore merge commits
      noMerges: true,
      //Fail on incorrect format
      strict: true,
      //Change cwd
      cwd: '.'
    });

    var logArgs = ['log'];
    logArgs.push('--pretty=format:"%h - %s"'); //'sha - message'
    if(options.noMerges) {
      logArgs.push('--no-merges');
    }
    if(options.begin) {
      logArgs.push(options.begin + '..HEAD');
    }

    //Currently using the git command line, however another option might be to
    //parse the log files in .git/logs/**/* which are in the format:
    //prev-commit-sha commit-sha author unix-time timezone commit-message
    grunt.util.spawn({
      cmd: 'git',
      args: logArgs,
      opts: {
        cwd: options.cwd
      }
     }, function(err, log) {
      if(err) {
        grunt.log.error(err);
        return done(false);
      }

      if(log.stdout) {
        //Map each log line to a boolean. As .every exits as soon as it
        //encounters a falsy, we check this after to check as many log lines
        //as possible.
        var res = log.stdout.split('\n').map(function(line) {
          if(line && !line.split(' - ')[1].match(options.format)) {
            grunt.log.error('Incorrect format: ' + line);
            return false;
          }
          return true;
        })
        //Check that all booleans are true
        .every(Boolean);

        //If strict, res matters, otherwise always true
        return done(!options.strict || res);
      }

      grunt.log.writeln('No logs to parse');
      return done(true);
    });
  });



};
