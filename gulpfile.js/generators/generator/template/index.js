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
     * gulp g -m {{name}} [options]
     *
     * options:
     *     -o --output  Specify the output file path.
     */
    gulp.task('generator:{{name}}', function() {
        var Path = LL.Path;

        var src = Path.resolve(__dirname, './template.js');
        var output = args.o || args.output || '{{name}}.js';
        var path = Path.resolve(output);

        gulp.src(src, {base: src})
            .pipe(gulp.dest(path));
    });
};
