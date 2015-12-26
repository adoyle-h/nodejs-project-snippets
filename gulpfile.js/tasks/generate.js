'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) { // eslint-disable-line no-unused-vars
    /**** Load Generators ****/
    var Path = require('path');
    var traverseFilesSync = require('../lib/traverseFiles').traverseFilesSync;
    var GULP_GENERATORS_PATH = Path.resolve(__dirname, '../generators/');

    traverseFilesSync(GULP_GENERATORS_PATH, function(filename) {
        if (filename.lastIndexOf('.js') !== (filename.length - 3)) return undefined;
        var task = require(Path.resolve(GULP_GENERATORS_PATH, filename));
        task(gulp, config, LL, args);
    }, {
        recursive: true,
    });
    /*************************/

    gulp.task('generate', function(done) {
        if (!args.m) return done(new Error('Missing generator module'));

        var generator = 'generate:' + args.m;
        LL.runSequence(generator, done);
    });

    gulp.task('g', ['generate']);
};
