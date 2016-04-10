'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');
var v = helper.v;

module.exports = extend({
    npsName: 'license',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, './templates/'));
        var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
        this.defaults.author = this.defaults.author || pkg.author;
    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: helper.prompting([
        function() {
            return [{
                type: 'input',
                name: 'sinceYear',
                message: 'License generated since year:',
                default: this.defaults.sinceYear || (new Date()).getFullYear(),
            }, {
                type: 'list',
                name: 'license',
                message: 'Choose your License:',
                choices: [
                    'Apache-2.0', 'BSD-3-Clause', 'MIT', 'No-License',
                ],
                default: this.defaults.license,
            }, {
                type: 'input',
                name: 'author',
                message: 'Input author name:',
                default: this.defaults.author,
                validate: helper.valid(v.string()),
            }];
        },
    ]),

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var curYear = (new Date()).getFullYear();
        var year;
        if (curYear > this.props.sinceYear) {
            year = this.props.sinceYear + '-' + curYear;
        } else {
            year = curYear;
        }
        this.props.year = year;

        if (this.props.license === 'Apache-2.0') {
            this.fs.copy(
                this.templatePath('Apache-License-2.0'),
                this.destinationPath('LICENSE')
            );
        } else if (this.props.license === 'BSD-3-Clause') {
            this.fs.copyTpl(
                this.templatePath('BSD-3-Clause'),
                this.destinationPath('LICENSE'),
                this.props
            );
        } else if (this.props.license === 'MIT') {
            this.fs.copyTpl(
                this.templatePath('MIT-License'),
                this.destinationPath('LICENSE'),
                this.props
            );
        } else if (this.props.license === 'No-License') {
            this.fs.copyTpl(
                this.templatePath('No-License'),
                this.destinationPath('LICENSE'),
                this.props
            );
        } else {
            this.log.error('wrong license type: ', this.props.license);
        }

        if (this.props.license === 'Apache-2.0') {
            this.fs.copyTpl(
                this.templatePath('Apache-Notice-2.0'),
                this.destinationPath('NOTICE'),
                this.props
            );
        } else {
            this.fs.copy(
                this.templatePath('NOTICE'),
                this.destinationPath('NOTICE')
            );
        }
    },
});
