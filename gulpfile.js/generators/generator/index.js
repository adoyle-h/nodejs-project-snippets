'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    /**
     * Generate a generator task.
     *
     * gulp g -m generator [options]
     *
     * options:
     *     -n --name  Specify the name of generator.
     */
    gulp.task('generator:generator', function() {
        var Path = LL.Path;
        var replace = LL.replace;

        var name = args.n || args.name;
        if (!name) throw new Error('Missing generator name!');

        var src = Path.resolve(__dirname, './template/**');
        var path = Path.resolve(__dirname, '../', name);

        gulp.src(src)
            .pipe(replace('{{name}}', name))
            .pipe(gulp.dest(path));
    });
};
