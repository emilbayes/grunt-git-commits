/*

The commit tree of our fixture:

  *   2f3f560 - (HEAD, master) Merge branch 'merge-branch'
  |\
  | * cd1b0b5 - (merge-branch) Fix: on some branch
  * | d685d5a - Remove: start valid messages
  * | 2678ae6 - Deps: start valid messages
  * | 3d55dc6 - Docs: start valid messages
  * | 3cf2983 - Fixed: subtle invalid messages
  |/
  * d83801f - Fix: valid message
  * 95d7298 - Added: invalid message
  * 52d45b1 - Add: valid messages
  * 499d178 - Start scatterede invalid messages
  * ed50ac6 - Update: valid format
  * 2e0da9a - Second invalid format
  * 2677c9c - Initial invalid format

  We assume the format "Tag: message", so the commit tree is divided into the
  following regions:

  2677c9c + 2e0da9a   are clearly incorrect
  ed50ac6..3cf2983    are mixed
  3d55dc6..HEAD       are correct
  HEAD                is a merge commit

*/

'use strict';

var grunt = require('grunt');

var commitTree = [
  '2f3f560 - Merge branch \'merge-branch\'',
  'cd1b0b5 - Fix: on some branch',
  'd685d5a - Remove: start valid messages',
  '2678ae6 - Deps: start valid messages',
  '3d55dc6 - Docs: start valid messages',
  '3cf2983 - Fixed: subtle invalid messages',
  'd83801f - Fix: valid message',
  '95d7298 - Added: invalid message',
  '52d45b1 - Add: valid messages',
  '499d178 - Start scatterede invalid messages',
  'ed50ac6 - Update: valid format',
  '2e0da9a - Second invalid format',
  '2677c9c - Initial commit'
];

var incorrectCommits = [commitTree[5], commitTree[7], commitTree[9],
                        commitTree[11], commitTree[12]];

var afterBeginIncorrectCommits = incorrectCommits.slice(0, 1);
var incorrectCommitsWithMerge = incorrectCommits.concat(commitTree[0]);

module.exports = {
  before: function(test) {
    grunt.util.spawn({
      cmd: 'test/fixtures/test_repo'
    }, function(err) {
      test.done(err);
    });
  },
  fail: function(test) {
    test.expect(incorrectCommits.length + 2);
    grunt.util.spawn({
      grunt: true,
      args: ['commits:fail', '--no-color']
    }, function(err, result) {
      test.ok(err !== null);

      incorrectCommits.forEach(function(msg) {
        test.ok(result.stdout.indexOf(msg) !== -1, msg);
      });

      test.ok(result.code === 3);

      test.done();
    });
  },
  proceedBuild: function(test) {
    test.expect(incorrectCommits.length + 2);
    grunt.util.spawn({
      grunt: true,
      args: ['commits:proceedBuild', '--no-color']
    }, function(err, result) {
      test.ok(err === null);

      incorrectCommits.forEach(function(msg) {
        test.ok(result.stdout.indexOf(msg) !== -1, msg);
      });

      test.ok(result.code === 0);

      test.done();
    });
  },
  beginAfter: function(test) {
    test.expect(afterBeginIncorrectCommits.length + 2);
    grunt.util.spawn({
      grunt: true,
      args: ['commits:beginAfter', '--no-color']
    }, function(err, result) {
      test.ok(err !== null);

      afterBeginIncorrectCommits.forEach(function(msg) {
        test.ok(result.stdout.indexOf(msg) !== -1, msg);
      });

      test.ok(result.code === 3);

      test.done();
    });
  },
  includeMerges: function(test) {
    test.expect(incorrectCommitsWithMerge.length + 2);
    grunt.util.spawn({
      grunt: true,
      args: ['commits:includeMerges', '--no-color']
    }, function(err, result) {
      console.log('includeMerges');
      test.ok(err !== null);

      incorrectCommitsWithMerge.forEach(function(msg) {
        test.ok(result.stdout.indexOf(msg) !== -1, msg);
      });

      test.ok(result.code === 3);

      test.done();
    });
  }
};
