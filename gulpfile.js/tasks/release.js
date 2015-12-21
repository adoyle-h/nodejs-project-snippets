'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    gulp.task('release:license', ['clean:release'], function() {
        var conf = config.get('tasks.release.license');
        var license = LL.license;
        var filter = LL.filter;

        var matches = conf.get('matches');
        var author = conf.get('author');
        var defaultLicense = conf.get('license');

        var stream = gulp.src(conf.get('src'));

        matches.forEach(function(matchObj) {
            var f = filter(matchObj.glob, {restore: true});
            stream = stream.pipe(f)
                .pipe(license(matchObj.license || defaultLicense, {
                    organization: matchObj.author || author,
                }))
                .pipe(f.restore);
        });

        return stream.pipe(gulp.dest(conf.get('dest')));
    });

    gulp.task('release:npm-pack', ['clean:npm-package'], function(done) {
        var conf = config.get('tasks.release.npm');
        var Path = LL.Path;
        var CP = LL.CP;
        var util = LL.nodeUtil;
        var packageJSON = LL.packageJSON;

        var src = conf.get('src');
        var dest = Path.resolve(conf.get('dest'));
        var destFile = util.format('%s/%s.tgz', dest, packageJSON.name);

        var command = util.format('tar -czf %s -C %s %s', destFile, Path.resolve(src, '..'), src);

        CP.exec(command, done);
    });

    gulp.task('release:npm-publish', function(done) {
        var conf = config.get('tasks.release.npm');
        var Path = LL.Path;
        var CP = LL.CP;
        var util = LL.nodeUtil;
        var packageJSON = LL.packageJSON;

        var tag = packageJSON.version;
        var dest = Path.resolve(conf.get('dest'));
        var destFile = util.format('%s/%s.tgz', dest, packageJSON.name);

        var command = util.format('npm publish --tag %s --access public %s', tag, destFile);

        CP.exec(command, done);
    });

    gulp.task('release', function(done) {
        LL.runSequence(
            'test',
            'release:license',
            'release:npm-pack',
            'release:npm-publish',
            done
        );
    });
};
