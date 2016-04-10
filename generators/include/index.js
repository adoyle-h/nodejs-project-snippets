'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');

module.exports = extend({
    npsName: 'include',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../../'));
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var file = 'include.js';

        this.fs.copy(
            this.templatePath(file),
            this.destinationPath(file)
        );
    },

    // Where installation are run (npm, bower)
    install: function() {
        helper.writePackageDeps(this, [{
            depName: 'rfr', version: '1.2.3', opts: {'save': true},
        }]);
    },
});
