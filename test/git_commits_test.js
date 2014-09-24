/*

The commit tree of our fixture:


  *   228ce1f - (HEAD, master) Merge branch 'merge-branch'
  |\
  | * 5e5bce3 - (merge-branch) Fix: on some branch
  * | 9ce75de - Remove: start valid messages
  * | d3c07d9 - Deps: start valid messages
  * | f1c4c51 - Docs: start valid messages
  * | bffffa4 - Fixed: subtle invalid messages
  |/
  * c07edbe - Fix: valid message
  * de988f5 - Added: invalid message
  * 8f47515 - Add: valid messages
  * da6ec5b - Start scatterede invalid messages
  * 3f17ab0 - Update: valid format
  * 15158e7 - Second invalid format
  * ca770d8 - Initial invalid format

  We assume the format "Tag: message", so the commit tree is divided into the
  following regions:

  ca770d8 + 15158e7   are clearly incorrect
  3f17ab0..bffffa4    are mixed
  f1c4c51..HEAD       are correct
  HEAD                is a merge commit

*/

'use strict';

var grunt = require('grunt');

var commitTree = [
  '228ce1f - Merge branch \'merge-branch\'',
  '5e5bce3 - Fix: on some branch',
  '9ce75de - Remove: start valid messages',
  'd3c07d9 - Deps: start valid messages',
  'f1c4c51 - Docs: start valid messages',
  'bffffa4 - Fixed: subtle invalid messages',
  'c07edbe - Fix: valid message',
  'de988f5 - Added: invalid message',
  '8f47515 - Add: valid messages',
  'da6ec5b - Start scatterede invalid messages',
  '3f17ab0 - Update: valid format',
  '15158e7 - Second invalid format',
  'ca770d8 - Initial invalid format'
];

var incorrectCommits = [commitTree[5], commitTree[7], commitTree[9],
                        commitTree[11], commitTree[12]];

var afterBeginIncorrectCommits = incorrectCommits.slice(0, 1);
var incorrectCommitsWithMerge = incorrectCommits.concat(commitTree[0]);

module.exports = {
  fail: function(test) {
    test.expect(incorrectCommits.length + 2);
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['commits:fail', '--no-color']
    }, function(err, result) {
      test.ok(err === null);

      incorrectCommits.forEach(function(msg) {
        test.ok(result.stdout.indexOf(msg) !== -1);
      });

      test.ok(result.code === 3);

      test.done();
    });
  },
  proceedBuild: function(test) {
    test.expect(incorrectCommits.length + 2);
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['commits:proceedBuild', '--no-color']
    }, function(err, result) {
      test.ok(err === null);

      incorrectCommits.forEach(function(msg) {
        test.ok(result.stdout.indexOf(msg) !== -1);
      });

      test.ok(result.code === 0);

      test.done();
    });
  },
  beginAfter: function(test) {
    test.expect(afterBeginIncorrectCommits.length + 2);
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['commits:beginAfter', '--no-color']
    }, function(err, result) {
      test.ok(err === null);

      afterBeginIncorrectCommits.forEach(function(msg) {
        test.ok(result.stdout.indexOf(msg) !== -1);
      });

      test.ok(result.code === 3);

      test.done();
    });
  },
  includeMerges: function(test) {
    test.expect(incorrectCommitsWithMerge.length + 2);
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['commits:includeMerges', '--no-color']
    }, function(err, result) {
      test.ok(err === null);

      incorrectCommitsWithMerge.forEach(function(msg) {
        test.ok(result.stdout.indexOf(msg) !== -1);
      });

      test.ok(result.code === 3);

      test.done();
    });
  }
};
