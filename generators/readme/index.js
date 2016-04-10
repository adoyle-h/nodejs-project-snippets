'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');
var v = helper.v;

module.exports = extend({
    npsName: 'readme',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, './templates'));
        var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
        this.defaults.name = this.defaults.name || pkg.name;
        this.defaults.description = this.defaults.description || pkg.description;
        this.defaults.author = this.defaults.author || pkg.author;
    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: helper.prompting([
        function() {
            return [{
                type: 'input',
                name: 'name',
                message: 'Input project name:',
                default: this.defaults.name,
                validate: helper.valid(v.string()),
            }, {
                type: 'input',
                name: 'description',
                message: 'Input project description:',
                default: this.defaults.description,
            }, {
                type: 'input',
                name: 'sinceYear',
                message: 'License generated since year:',
                default: this.defaults.sinceYear || (new Date()).getFullYear(),
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

        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            this.props
        );
        this.fs.copyTpl(
            this.templatePath('README.zh-Hans.md'),
            this.destinationPath('doc/README.zh-Hans.md'),
            this.props
        );
    },
});
