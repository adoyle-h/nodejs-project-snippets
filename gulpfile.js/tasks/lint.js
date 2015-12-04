'use strict';

/**
 * @param  {Object}  gulp    gulp
 * @param  {Object}  config  全局配置文件
 * @param  {Object}  LL      lazy load require 的第三方库
 * @param  {Object}  args    命令行参数
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    gulp.task('lint', function() {
        var eslint = LL.eslint;
        var cached = LL.cached;

        var opts = {
            quiet: true,
        };
        if (args.fix || args.f) opts.fix = true;

        return gulp.src(config.get('tasks.lint.src'))
        .pipe(cached('lint'))
        .pipe(eslint(opts))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
    });
};
