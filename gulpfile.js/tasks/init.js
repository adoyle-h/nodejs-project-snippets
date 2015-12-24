'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    gulp.task('init:changelog', function(done) {
        var CP = LL.CP;
        var util = LL.nodeUtil;
        var packageJSON = LL.packageJSON;
        var tag = packageJSON.version;
        var name = config.get('tasks.release.changelog.name');
        var commitHash = conf.get('dest');

        var command = util.format('\
            echo "" > %s &&\
            git add . \
        ', name);
        CP.exec(command, done);
    });

    gulp.task('init', function(done) {
        LL.runSequence(
            'release:code',
            'release:license',
            'release:npm-pack',
            'release:npm-publish',
            done
        );
    });
};
