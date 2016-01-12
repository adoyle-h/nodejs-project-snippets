'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    /**
     * Generate a gulp task
     *
     * gulp g -m task [options]
     *
     * options:
     *     -n --name  Specify the name of generator.
     */
    gulp.task('generator:task', function() {
        var Path = LL.Path;
        var replace = LL.replace;

        var name = args.n || args.name;
        if (!name) throw new Error('Missing task name!');

        var src = Path.resolve(__dirname, './template.js');
        var path = Path.resolve(__dirname, '../../tasks', name + '.js');

        gulp.src(src, {base: src})
            .pipe(replace('{{name}}', name))
            .pipe(gulp.dest(path));
    });
};
