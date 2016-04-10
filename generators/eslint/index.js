'use strict';

var util = require('lodash');
var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');

module.exports = extend({
    npsName: 'eslint',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, './templates'));
    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: helper.prompting([
        [{
            type: 'confirm',
            name: 'confirm',
            message: '确认您将使用 adoyle-style eslint?',
        }],
    ]),

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        if (this.props.confirm === false) return undefined;
        var self = this;

        util.each(['.eslintrc', '.eslintignore'], function(file) {
            self.fs.copy(
                self.templatePath(file),
                self.destinationPath(file)
            );
        });
    },

    // Where installation are run (npm, bower)
    install: function() {
        if (this.props.confirm === false) return undefined;
        helper.writePackageDeps(this, [{
            depName: 'eslint', version: '2.7.0', opts: {'saveDev': true},
        }, {
            depName: 'eslint-config-adoyle-style', version: '0.3.2', opts: {'saveDev': true},
        }]);
    },
});
