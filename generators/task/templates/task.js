'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    /**
     * [description]
     *
     * gulp <%= name %> [options]
     *
     * options:
     *     -h --help  Show how to use the task
     */
    gulp.task('<%= name %>', function() {
        var showHelp = args.h || args.help || false;
    });

    /**
     * [sub task description]
     */
    gulp.task('<%= name %>:sub-task', function() {
        var showHelp = args.h || args.help || false;
    });
};