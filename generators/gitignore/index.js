'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;

module.exports = extend({
    npsName: 'gitignore',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../../'));
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var file = '.gitignore';
        this.fs.copy(
            this.templatePath(file),
            this.destinationPath(file)
        );
    },
});
