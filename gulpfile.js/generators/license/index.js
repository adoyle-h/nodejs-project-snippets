'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    gulp.task('generator:license', function() {
        var Path = LL.Path;
        var replace = LL.replace;
        var license = config.get('generators.license');

        var file = Path.resolve(__dirname, './template');

        gulp.src(file, {base: file})
            .pipe(replace('{{year}}', license.get('year')))
            .pipe(replace('{{author}}', license.get('author')))
            .pipe(gulp.dest(license.get('dest')));
    });
};
