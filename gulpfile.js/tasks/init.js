'use strict';

/**
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) {  // eslint-disable-line no-unused-vars
    /**
     * Set gh-pages folder
     *
     * gulp init:gh-pages [options]
     *
     * options:
     *     -r --repo  github repository, such as "adoyle-h/test"
     */
    gulp.task('init:gh-pages', function(done) {
        var repo = args.r || args.repo;
        if (!repo) throw new Error('Missing -r or --repo');

        var command = '\
            mkdir -p gh-pages && cd gh-pages &&\
            git init &&\
            git checkout -b gh-pages &&\
            git ign osx,linux,vim,emacs > .gitignore &&\
            git add . &&\
            git commit -m "Init github page" &&\
            git remote add origin git@github.com:' + repo + '.git &&\
            cd - \
        ';
        LL.CP.exec(command, done);
    });

    /**
     * Initialize your project
     *
     * gulp init [options]
     *
     * options:
     *     -h --help  Show how to use the task
     */
    gulp.task('init', function(done) {
        LL.runSequence(
            'init:gh-pages',
            done
        );
    });
};
