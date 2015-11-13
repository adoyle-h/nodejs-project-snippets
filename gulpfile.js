'use strict';

require('./require');
var gulp = require('gulp');
var config = include('lib/config').get('gulp');

var LL = include('lib/lazy_loader');
// 将 require 都放到这里，通过 LL 来调用变量
LL.setMulti({
    Path: 'path',
    FS: 'fs',
    CP: 'child_process',
    parser: 'minimist',
    async: 'async',
    bump: 'gulp-bump',
    clean: 'gulp-clean',
    changed: 'gulp-changed',
    nodemon: 'gulp-nodemon',
    eslint: 'gulp-eslint',
    mocha: 'gulp-mocha',
    ms: 'ms',
    runSequence: 'run-sequence',
});

var FS = LL.FS;
var Path = LL.Path;

var GULP_TASKS_PATH = './gulp/tasks/';


function traverseFilesSync(dirPath, iteratee, opts) {
    var recursive = opts.recursive;

    FS.readdirSync(dirPath).forEach(function(filename) {
        var filePath = Path.join(dirPath, filename);
        if (recursive && FS.statSync(filePath).isDirectory()) {
            return traverseFilesSync(filePath, iteratee, opts);
        }
        iteratee(filename);
    });
}

var args = LL.parser(process.argv.slice(2));

traverseFilesSync(GULP_TASKS_PATH, function(filename) {
    var task = require(GULP_TASKS_PATH + filename);
    task(gulp, config, LL, args);
}, {
    recursive: true,
});

/**
 * 查看所有的 gulp 任务
 */
gulp.task('tasks', function() {
    var tasks = Object.keys(gulp.tasks);
    var task;
    var map = {'Basics': []};
    var category;
    for (var i = tasks.length - 1; i >= 0; i--) {
        task = tasks[i];
        var arr = task.split(':');
        if (arr.length === 1) {
            category = map.Basics;
        } else {
            category = map[arr[0]];
            if (!category) category = map[arr[0]] = [];
        }
        category.push(task);
    }

    var str = JSON.stringify(map, null, 4);
    /* eslint no-console: 0 */
    console.log(str.replace(/["\[\],\{\}]/g, ''));
});

/**
 * 默认启动服务器
 */
gulp.task('default', ['server']);
