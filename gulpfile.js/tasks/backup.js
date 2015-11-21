'use strict';

/**
 * @param  {Object}  gulp    gulp
 * @param  {Object}  config  全局配置文件
 * @param  {Object}  LL      lazy load require 的第三方库
 * @param  {Object}  args    命令行参数
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line
    gulp.task('backup:log', function() {
        return gulp.src('logs/*', {
            read: false,
        })
            .pipe(gulp.dest('backup/*'));
    });

    gulp.task('backup', ['backup:log']);
};
