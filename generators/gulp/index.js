'use strict';

var util = require('lodash');
var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');
var v = helper.v;

module.exports = extend({
    npsName: 'gulp',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../../'));
    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: helper.prompting([
        [{
            type: 'checkbox',
            name: 'tasks',
            message: '选择你要使用的 gulp 任务',
            choices: [{
                name: 'backup',
            }, {
                name: 'clean',
            }, {
                name: 'default',
            }, {
                name: 'deploy',
            }, {
                name: 'doc',
            }, {
                name: 'init',
            }, {
                name: 'lint',
            }, {
                name: 'release',
            }, {
                name: 'server',
            }, {
                name: 'tasks',
            }, {
                name: 'test',
            }, {
                name: 'watch',
            }],
            validate: helper.valid(v.array().min(1)),
            filter: function(answers) {
                var choices = {};
                answers.forEach(function(name) {
                    choices[name] = true;
                });
                return choices;
            },
        }],
    ]),

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var self = this;
        var dest = 'gulpfile.js';

        self.fs.copyTpl(
            self.templatePath(dest, 'config'),
            self.destinationPath(dest, 'config'),
            self.props,
            {globOptions: {dot: true, ignore: '**/.DS_Store'}}
        );

        self.fs.copy(
            self.templatePath(dest, 'lib'),
            self.destinationPath(dest, 'lib'),
            {globOptions: {dot: true, ignore: '**/.DS_Store'}}
        );


        util.each(['.eslintrc', 'index.js', 'require.js'], function(name) {
            self.fs.copy(
                self.templatePath(dest, name),
                self.destinationPath(dest, name)
            );
        });

        util.each(self.props.tasks, function(_, task) {
            self.fs.copy(
                self.templatePath('gulpfile.js/tasks/' + task + '.js'),
                self.destinationPath('gulpfile.js/tasks/' + task + '.js'),
                {globOptions: {dot: true, ignore: '**/.DS_Store'}}
            );
        });
    },

    // Where installation are run (npm, bower)
    install: function() {
        helper.writePackageDeps(this, [{
            depName: 'minimist', version: '1.1.1', opts: {saveDev: true},
        }, {
            depName: 'gulp', version: '3.9.0', opts: {saveDev: true},
        }, {
            depName: 'walkdir', version: '0.0.11', opts: {saveDev: true},
        }, {
            depName: 'config-sp', version: '0.1.0', opts: {saveDev: true},
        }]);
    },
});
