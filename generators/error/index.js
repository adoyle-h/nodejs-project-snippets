'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');

module.exports = extend({
    npsName: 'error',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../../lib'));
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var file = 'error.js';
        var dest = 'src/lib';

        this.fs.copy(
            this.templatePath(file),
            this.destinationPath(dest, file)
        );
    },

    // Where installation are run (npm, bower)
    install: function() {
        helper.writePackageDeps(this, [{
            depName: 'ero', version: '0.2.0', opts: {save: true},
        }]);
    },
});
