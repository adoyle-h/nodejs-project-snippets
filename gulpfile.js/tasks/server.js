'use strict';

/**
 * @param  {Object}  gulp    gulp
 * @param  {Object}  config  全局配置文件
 * @param  {Object}  LL      lazy load require 的第三方库
 * @param  {Object}  args    命令行参数
 */
module.exports = function(gulp, config, LL/*, args*/) {
    gulp.task('server', function() {
        var nodemon = LL.nodemon;

        nodemon({
            script: 'index.js',
            ignore: ['node_modules/*', 'bower_components/*', 'assets/*', 'bin/*', 'doc/*', 'logs/*', 'scripts/*', 'temp/*', 'test/*', 'gulpfile.js'],
            // env: { 'NODE_ENV': 'development' },
        })
        .on('restart', function() {
            /* eslint no-console: 0 */
            console.log('=== Server Restarted! ===');
        });
    });
};
