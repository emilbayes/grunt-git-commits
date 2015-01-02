# grunt-git-commits

> Enforce commit message format using Grunt

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-git-commits --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-git-commits');
```

## The "commits" task

### Overview
In your project's Gruntfile, add a section named `commits` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  commits: {
    options: {
      format: /^(Add|Update|Fix|Remove|Docs|Deps):/
      begin: 'some-sha',
      noMerge: true,
      strict: true
    }
  },
});
```

### Options

#### options.format
Type: `RegExp`
Default value: `/.*/`

Regular Expression to match commit messages after. The example above requires messages to have a certain tag prepended. Another common style is `[some-module] some message`, which would be `/\[([^]]+)\]/` or `/^\[(tag1|tag2)\]/`.
Another popular formatting rule is [Tim Pope's commit message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html), which can be enforced with:

```js
var format = new RegExp('^[A-Z][^\n]{0,49}' + //First line should start with capital letter and be <= 50 chars
                        '(' +
                          '\n\n' + //If more lines follow, enforce an empty line
                          '([^\n]{0,69}(\n|$))+' + //70 chars on each line, end with a newline, unless it's the last line. Repeat at least once.
                        ')?'); //However, all of this is optional
```

#### options.begin
Type: `String`
Default value: `null`

Start matching messages (inclusive) after `sha`. This allows one to enforce the `format` in a older project without having to rewrite the history.
To make this exclusive append `^`, ie. `ff432d^`.

#### options.noMerge
Type: `Boolean`
Default value: `true`

Ignore merge commits.

#### options.strict
Type: `Boolean`
Default value: `true`

Fail the build if any of the messages are incorrect according to `format`. Incorrect messages will still be logged as errors, but the build will proceed.

#### options.cwd
Type: `String`
Default value: `.`

The directory in which the `git` commands should be executed. You should probably leave this one alone.


### Usage Examples

#### Default Options
The minimum configuration is to specify a format.

```js
grunt.initConfig({
  commits: {
    options: {
      format: /^(Add|Update|Fix|Remove|Docs|Deps):/
    },
    files: [{
      cwd: 'test/fixtures'
    }]
  }
});
```

#### Custom Options
Here we start enforcing `format` from commit `f1c4c51`, ignoring merge commits. Also note that `strict: false` prints all incorrect commits as errors, but allows the build to proceed.

```js
grunt.initConfig({
  commits: {
    options: {
      begin: 'f1c4c51',
      format: /^(Add|Update|Fix|Remove|Docs|Deps):/,
      noMerges: true,
      strict: false
    },
    files: [{
      cwd: 'test/fixtures'
    }]
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License

ISC © Emil Bay
