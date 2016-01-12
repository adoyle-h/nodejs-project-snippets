'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    /**
     * Generate a README.md file
     *
     * gulp g -m readme [options]
     *
     * options:
     *     -c --complex  Generate a complex README.
     *     -s --simple  Generate a simple README. Default to true
     *     -n --name <name>  Specify the project name.
     *     -y --year <year>  Specify the copyright year
     */
    gulp.task('generator:readme', function() {
        var Path = LL.Path;
        var replace = LL.replace;

        var name = args.n || args.name;
        if (!name) throw new Error('Missing project name!');

        var src;
        if (args.c || args.complex) {
            src = 'complex.md';
        } else {
            src = 'simple.md';
        }

        var year = args.y || args.year || (new Date()).getFullYear();
        var path = Path.resolve(__dirname, src);

        gulp.src(path, {base: path})
            .pipe(replace('{{name}}', name))
            .pipe(replace('{{year}}', year))
            .pipe(gulp.dest(Path.resolve('README.md')));

        var zhHansSrc = Path.resolve(__dirname, 'zh-Hans.' + src);

        gulp.src(zhHansSrc, {base: zhHansSrc})
            .pipe(replace('{{name}}', name))
            .pipe(replace('{{year}}', year))
            .pipe(gulp.dest(Path.resolve('doc/README.zh-Hans.md')));
    });
};
