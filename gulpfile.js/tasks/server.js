'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    gulp.task('server', function() {
        var nodemon = LL.nodemon;
        var conf = config.get('tasks.server');

        nodemon({
            script: conf.get('main'),
            ignore: conf.get('ignore'),
            env: conf.get('env'),
        })
        .on('restart', function() {
            /* eslint no-console: 0 */
            console.log('=== Server Restarted! ===');
        });
    });
};
