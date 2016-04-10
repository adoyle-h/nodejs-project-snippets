'use strict';

var util = require('lodash');
var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');

module.exports = extend({
    npsName: 'generators',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../'));
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var self = this;
        var dest = 'generators';

        util.each(['_helper/index.js', '_helper/validator.js'], function(name) {
            self.fs.copy(
                self.templatePath(name),
                self.destinationPath(dest, name)
            );
        });

        util.each(['.eslintrc', 'task', 'generate', 'module'], function(name) {
            self.fs.copy(
                self.templatePath(name),
                self.destinationPath(dest, name)
            );
        });

        var file = Path.join('bin', 'g');
        this.sourceRoot(Path.resolve(__dirname, '../../'));

        self.fs.copy(
            self.templatePath(file),
            self.destinationPath(file)
        );
    },

    // Where installation are run (npm, bower)
    install: function() {
        helper.writePackageDeps(this, [{
            depName: 'yeoman-environment', version: '1.5.2', opts: {saveDev: true},
        }, {
            depName: 'yeoman-generator', version: '0.22.5', opts: {saveDev: true},
        }, {
            depName: 'lodash', version: '3.10.1', opts: {saveDev: true},
        }, {
            depName: 'bluebird', version: '3.3.5', opts: {saveDev: true},
        }, {
            depName: 'joi', version: '6.10.0', opts: {saveDev: true},
        }, {
            depName: 'loud-rejection', version: '1.3.0', opts: {saveDev: true},
        }, {
            depName: 'minimist', version: '1.1.1', opts: {saveDev: true},
        }]);
    },
});
