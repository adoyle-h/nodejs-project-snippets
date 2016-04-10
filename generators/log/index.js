'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');

module.exports = extend({
    npsName: 'log',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../../lib'));
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var dest = 'src/lib';
        var file = 'log.js';

        this.fs.copy(
            this.templatePath(file),
            this.destinationPath(dest, file)
        );
    },

    // Where installation are run (npm, bower)
    install: function() {
        helper.writePackageDeps(this, [{
            depName: 'winston', version: '2.1.0', opts: {save: true},
        }, {
            depName: 'adoyle-h/nps-log', version: 'develop', opts: {save: true},
        }, {
            depName: 'winston-pretty-console', version: '0.1.1', opts: {save: true},
        }, {
            depName: 'lodash', version: '3.10.1', opts: {save: true},
        }, {
            depName: 'bytes', version: '2.1.0', opts: {save: true},
        }]);
    },
});
