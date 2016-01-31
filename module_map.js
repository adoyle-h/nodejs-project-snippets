'use strict';
module.exports = {
    assert: {
        files: ['lib/assert.js'],
        deps: ['joi', 'lodash'],
    },
    include: {
        files: ['include.js'],
        deps: ['rfr'],
    },
    log: {
        config: 'logger',
        files: ['lib/log/'],
        deps: ['winston', 'pretty-error', 'lodash', 'bytes', 'sprintf-js', 'cli-color'],
        selfDeps: ['include', 'config'],
    },
    error: {
        files: ['lib/error'],
        deps: ['ero'],
    },
    config: {
        files: ['lib/config.js', 'config/'],
        deps: ['node-config'],
    },
    gulp: {
        files: ['gulpfile.js/'],
        devDeps: ['minimist', 'gulp', 'config-sp'],
    },
    util: {
        files: ['lib/util/'],
        deps: ['lodash'],
        selfDeps: ['include', 'assert'],
    },
    test: {
        files: ['test/'],
        devDeps: ['walkdir', 'mocha', 'should', 'chai', 'config-sp'],
    },
    repl: {
        files: ['repl/'],
        devDeps: ['shelljs', 'lodash'],
        selfDeps: ['include', 'util', 'consts', 'config', 'log'],
    },
    consts: {
        files: ['lib/consts.js'],
    },
    codeStyle: {
        files: ['.eslintrc', '.eslintignore'],
        devDeps: ['eslint', 'eslint-config-adoyle-style'],
    },
    validator: {
        files: ['lib/validator.js'],
        deps: ['joi', 'lodash'],
    },
    app: {
        files: ['app.js'],
        deps: ['wodule'],
        selfDeps: ['include', 'log', 'config'],
    },
    gitignore: {
        files: ['.gitignore'],
    },
};
