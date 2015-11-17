'use strict';

/**
 * 查看所有的 gulp 任务
 */

/**
 * @param  {Object}  gulp    gulp
 * @param  {Object}  config  全局配置文件
 * @param  {Object}  LL      lazy load require 的第三方库
 * @param  {Object}  args    命令行参数
 */
module.exports = function(gulp/*, config, LL, args*/) {
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
};
