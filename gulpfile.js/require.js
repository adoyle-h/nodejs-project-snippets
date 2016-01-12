'use strict';

module.exports = {
    // native libraries
    Path: 'path',
    FS: 'fs',
    nodeUtil: 'util',
    CP: 'child_process',

    // third-party libraries
    async: 'async',
    ms: 'ms',
    del: 'del',
    runSequence: 'run-sequence',
    inquirer: 'inquirer',

    // third-party libraries prefixed with 'gulp-'
    bump: 'gulp-bump',
    changed: 'gulp-changed',
    nodemon: 'gulp-nodemon',
    eslint: 'gulp-eslint',
    cached: 'gulp-cached',
    watch: 'gulp-watch',
    license: 'gulp-license',
    filter: 'gulp-filter',
    changelog: 'gulp-conventional-changelog',
    replace: 'gulp-replace',

    // data
    packageJSON: './package.json',
};
