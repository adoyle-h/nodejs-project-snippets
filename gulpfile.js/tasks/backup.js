'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    gulp.task('backup:log', function() {
        var conf = config.get('tasks.backup.log');

        return gulp.src(conf.get('src'), {
            read: false,
        })
            .pipe(gulp.dest(conf.get('desc')));
    });

    gulp.task('backup', ['backup:log']);
};
