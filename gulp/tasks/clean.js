'use strict';

/**
 * @param  {Object}  gulp    gulp
 * @param  {Object}  config  全局配置文件
 * @param  {Object}  LL      lazy load require 的第三方库
 * @param  {Object}  args    命令行参数
 */
module.exports = function(gulp, config, LL/*, args*/) {
    // ATTENTION: 删除日志需要重启服务器，否则新写日志不会创建文件
    gulp.task('clean:log', function() {
        return gulp.src('logs/*', {
            read: false,
        })
            .pipe(LL.clean());
    });

    gulp.task('clean', ['clean:log']);
};
