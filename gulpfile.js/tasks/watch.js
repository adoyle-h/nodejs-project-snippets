'use strict';

/**
 * @param  {Object}  gulp    gulp
 * @param  {Object}  config  全局配置文件
 * @param  {Object}  LL      lazy load require 的第三方库
 * @param  {Object}  args    命令行参数
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line
    // var Path = LL.Path;
    // var watch = LL.watch;

    // var watchableTasks = ['font', 'iconFont', 'image', 'svgSprite', 'html', 'css'];

    // watchableTasks.forEach(function(taskName) {
    //     var task = config.tasks[taskName];
    //     if (task) {
    //         var glob = Path.join(config.root.src, task.src, '**/*.{' + task.extensions.join(',') + '}');
    //         watch(glob, function() {
    //             require('./' + taskName)();
    //         });
    //     }
    // });

    // gulp.task('watch', ['watch:js', 'watch:stylus', 'watch:image', 'watch:copy']);
};
