'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    /**
     * gulp g -m module [options]
     *
     * options:
     *     -o --output  Specify the output file path. Default to "new_module.js".
     */
    gulp.task('generator:module', function() {
        var Path = LL.Path;

        var file = Path.resolve(__dirname, './module.js');
        var output = args.o || args.output || 'new_module.js';
        var path = Path.resolve(output);

        gulp.src(file, {base: file})
            .pipe(gulp.dest(path));
    });
};
