'use strict';

var Path = require('path');
var walk = require('walkdir');

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) { // eslint-disable-line no-unused-vars
    /**** Load Generators ****/
    var GULP_GENERATORS_DIR = Path.resolve(__dirname, '../generators/');

    walk.sync(GULP_GENERATORS_DIR, {
        no_recurse: true,
    }, function(filepath, stats) {
        var task;
        if (stats.isFile()) {
            if (Path.extname(filepath) !== '.js') return undefined;
            task = require(filepath);
            task(gulp, config, LL, args);
        } else if (stats.isDirectory()) {
            task = require(filepath);
            task(gulp, config, LL, args);
        }
    });
    /*************************/

    gulp.task('generate', function(done) {
        if (!args.m) return done(new Error('Missing generator module'));

        var generator = 'generator:' + args.m;
        LL.runSequence(generator, done);
    });

    gulp.task('g', ['generate']);
};
