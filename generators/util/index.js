'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');

module.exports = extend({
    npsName: 'util',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../../lib/'));
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var self = this;
        var dest = 'src/lib';

        ['index', 'core', 'third_party', 'overrides', 'custom'].forEach(function(file) {
            self.fs.copyTpl(
                self.templatePath('util/' + file + '.js'),
                self.destinationPath(dest, 'util/' + file + '.js'),
                self.defaults
            );
        });
    },

    // Where installation are run (npm, bower)
    install: function() {
        var deps = [{
            depName: 'lodash', version: '3.10.1', opts: {save: true},
        }];

        if (this.defaults.adoyleStyle) {
            deps.push({
                depName: 'better-console', version: '0.2.4', opts: {save: true},
            }, {
                depName: 'debug', version: '2.2.0', opts: {save: true},
            }, {
                depName: 'ms', version: '0.7.1', opts: {save: true},
            }, {
                depName: 'node-uuid', version: '1.4.6', opts: {save: true},
            }, {
                depName: 'lodash-deep', version: '1.6.0', opts: {save: true},
            }, {
                depName: 'sprintf-js', version: '1.0.3', opts: {save: true},
            }, {
                depName: 'updeep', version: '0.14.0', opts: {save: true},
            }, {
                depName: 'walkdir', version: '0.0.11', opts: {save: true},
            }, {
                depName: 'bytes', version: '2.1.0', opts: {save: true},
            }, {
                depName: 'random-string', version: '0.1.2', opts: {save: true},
            });
        }

        helper.writePackageDeps(this, deps);
    },
});
