'use strict';

/**
 * @param  {Object}  gulp    gulp
 * @param  {Object}  config  全局配置文件
 * @param  {Object}  LL      lazy load require 的第三方库
 * @param  {Object}  args    命令行参数
 */
module.exports = function(gulp, config, LL/*, args*/) {
    gulp.task('lint', function() {
        var eslint = LL.eslint;
        return gulp.src([
            './**/*.js',
            '!./bower_components/**',
            '!./node_modules/**',
            '!./assets/**',
            '!./temp/**',
        ])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    });
};
