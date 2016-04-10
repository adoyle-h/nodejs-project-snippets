'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');

module.exports = extend({
    npsName: 'validator',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../../lib/'));
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var dest = 'src/lib';
        var file = 'validator.js';

        this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(dest, file),
            this.props
        );
    },

    // Where installation are run (npm, bower)
    install: function() {
        helper.writePackageDeps(this, [{
            depName: 'lodash', version: '3.10.1', opts: {save: true},
        }, {
            depName: 'joi', version: '6.10.0', opts: {save: true},
        }]);
    },
});
