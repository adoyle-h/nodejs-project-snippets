'use strict';

/**
 * @param  {Object}  gulp    gulp
 * @param  {Object}  config  全局配置文件
 * @param  {Object}  LL      lazy load require 的第三方库
 * @param  {Object}  args    命令行参数
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line
    gulp.task('lint', function() {
        var eslint = LL.eslint;

        return gulp.src(config.tasks.lint.src)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    });
};
