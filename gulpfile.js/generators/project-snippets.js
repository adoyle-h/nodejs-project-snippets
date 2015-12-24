'use strict';

/**
 * Every generator should be an gulp task, which must be named with prefix "generate:".
 *
 * @param  {Object}  gulp    The gulp object
 * @param  {Object}  config  The configuration for gulp tasks. To get a property using `config.a.b.c` or `config.get('a.b.c')`
 * @param  {Object}  LL      Lazy required libraries and other data
 * @param  {Object}  args    The parsed arguments from comment line
 */
module.exports = function(gulp, config, LL, args) { // eslint-disable-line no-unused-vars
    gulp.task('generate:init', function(done) {
        LL.inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Give your app a name',
            default: args.m,
        }, {
            type: 'confirm',
            name: 'moveon',
            message: 'Continue?',
        }], function(answers) {
            console.log('answers', answers);
            done();
        });
    });
};
