'use strict';

module.exports = {
    // Native libraries
    Path: 'path',
    FS: 'fs',
    nodeUtil: 'util',
    CP: 'child_process',

    // Third-party libraries
    walkdir: 'walkdir',
    async: 'async',
    ms: 'ms',
    del: 'del',
    runSequence: 'run-sequence',
    inquirer: 'inquirer',

    // Third-party libraries prefixed with 'gulp-'
    bump: 'gulp-bump',
    changed: 'gulp-changed',
    nodemon: 'gulp-nodemon',
    eslint: 'gulp-eslint',
    cached: 'gulp-cached',
    watch: 'gulp-watch',
    license: 'a-gulp-license',
    filter: 'gulp-filter',
    changelog: 'gulp-conventional-changelog',
    replace: 'gulp-replace',

    // Data, which path related to process.cwd()
    packageJSON: './package.json',
};
