'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');
var v = helper.v;

module.exports = extend({
    npsName: '<%= name %>',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, './templates'));
        // this.sourceRoot(Path.resolve(__dirname, '../../'));
    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: helper.prompting([
        function() {
            return [{
                type: 'input',
                name: 'name',
                message: 'Input name:',
                default: this.defaults.name,
                validate: helper.valid(v.string()),
            }];
        },
        [{
            type: 'confirm',
            name: 'confirm',
            message: 'Confirm name:',
        }],
    ]),

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var file = this.props.name;
        this.fs.copy(
            this.templatePath(file),
            this.destinationPath(file),
            {globOptions: {dot: true, ignore: '**/.DS_Store'}}
        );

        // or
        this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(file),
            this.props,
            {globOptions: {dot: true, ignore: '**/.DS_Store'}}
        );
    },

    // Where installation are run (npm, bower)
    install: function() {
        var self = this;
        var pkg = helper.findPackage(self.destinationPath('package.json'));

        helper.npmInstall(self, pkg, [{
            depName: 'eslint', version: '2.7.0', opts: {saveDev: true},
        }, {
            depName: 'eslint-config-adoyle-style', version: '0.3.2', opts: {saveDev: true},
        }]);
    },
});
