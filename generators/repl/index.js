'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;
var helper = require('../_helper');

module.exports = extend({
    npsName: 'repl',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../../'));
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var file = 'repl';

        this.fs.copy(
            this.templatePath(file),
            this.destinationPath(file)
        );
    },

    // Where installation are run (npm, bower)
    install: function() {
        helper.writePackageDeps(this, [{
            depName: 'shelljs', version: '0.5.3', opts: {'saveDev': true},
        }, {
            depName: 'lodash', version: '3.10.1', opts: {'saveDev': true},
        }]);
    },
});
