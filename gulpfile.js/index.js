'use strict';

var gulp = require('gulp');
var minimist = require('minimist');
var Path = require('path');
var walk = require('walkdir');

if (process.cwd() !== Path.resolve()) {
    throw new Error('Current process should run on the root directory of this project.');
}

var config = require('./config');
var requirements = require('./require');
var LL = require('./lib/lazy_loader');

LL.setMulti(requirements);

var args = minimist(process.argv.slice(2));

var GULP_TASKS_DIR = Path.resolve(__dirname, './tasks/');
walk.sync(GULP_TASKS_DIR, {
    no_recurse: true,  // eslint-disable-line camelcase
}, function(filepath, stats) {
    var task;
    if (stats.isFile()) {
        if (Path.extname(filepath) !== '.js') return undefined;
        task = require(filepath);
        task(gulp, config, LL, args);
    } else if (stats.isDirectory()) {
        task = require(filepath);
        task(gulp, config, LL, args);
    }
});
