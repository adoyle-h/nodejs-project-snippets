'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');
var v = helper.v;

module.exports = extend({
    npsName: 'test',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../../test/'));
    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: helper.prompting([
        [{
            type: 'checkbox',
            name: 'cases',
            message: '选择构建测试范围',
            choices: [{
                name: 'unit',
                checked: true,
            }, {
                name: 'integration',
            }],
            validate: helper.valid(v.array().min(1)),
        }, {
            type: 'confirm',
            name: 'useLodash',
            message: '你是否要在本项目中使用 lodash ?',
        }],
    ]),

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var self = this;
        var dest = 'test';
        var file;

        ['config', 'fixture', 'mocks'].forEach(function(name) {
            self.fs.copy(
                self.templatePath(name),
                self.destinationPath(dest, name),
                {globOptions: {dot: true, ignore: '**/.DS_Store'}}
            );
        });

        ['globals', 'index', 'load_cases', 'mocha_runner'].forEach(function(name) {
            file = name + '.js';
            self.fs.copy(
                self.templatePath(file),
                self.destinationPath(dest, file)
            );
        });

        file = 'cases/.eslintrc';
        self.fs.copyTpl(
            self.templatePath(file),
            self.destinationPath(dest, file)
        );

        this.props.cases.forEach(function(name) {
            file = Path.join('cases', name);
            self.fs.copy(
                self.templatePath(file),
                self.destinationPath(dest, file),
                {globOptions: {dot: true, ignore: '**/.DS_Store'}}
            );
        });

        this.fs.copyTpl(
            this.templatePath('util.js'),
            this.destinationPath(dest, 'util.js'),
            this.props
        );
    },

    // Where installation are run (npm, bower)
    install: function() {
        helper.writePackageDeps(this, [{
            depName: 'walkdir', version: '0.0.11', opts: {'saveDev': true},
        }, {
            depName: 'mocha', version: '2.2.4', opts: {'saveDev': true},
        }, {
            depName: 'should', version: '7.1.1', opts: {'saveDev': true},
        }, {
            depName: 'chai', version: '3.4.1', opts: {'saveDev': true},
        }, {
            depName: 'config-sp', version: '0.1.0', opts: {'saveDev': true},
        }]);
    },
});
