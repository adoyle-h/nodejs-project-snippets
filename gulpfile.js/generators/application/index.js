'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    /**
     * gulp g -m application [options]
     *
     * options:
     *     -o --output  Specify the output file path. Default to "app.js".
     */
    gulp.task('generator:application', function() {
        var Path = LL.Path;

        var file = Path.resolve(__dirname, './app.js');
        var output = args.o || args.output || 'app.js';
        var path = Path.resolve(output);

        gulp.src(file, {base: file})
            .pipe(gulp.dest(path));
    });
};
