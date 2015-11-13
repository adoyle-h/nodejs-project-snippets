'use strict';

/**
 * @param  {Object}  gulp    gulp
 * @param  {Object}  config  全局配置文件
 * @param  {Object}  LL      lazy load require 的第三方库
 * @param  {Object}  args    命令行参数
 */
module.exports = function(gulp, config, LL/*, args*/) {
    gulp.task('test', function() {
        return gulp.src('test.js', {
            read: false,
        })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(LL.mocha({
            reporter: 'nyan',
        }));
    });
};
