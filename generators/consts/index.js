'use strict';

var Path = require('path');
var extend = require('../_helper/nps_generator').extend;

module.exports = extend({
    npsName: 'consts',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../../lib'));
    },

    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
    configuring: function() {
        var date = new Date();
        this.props.EPOCH_DATE = date.toLocaleDateString();
        this.props.EPOCH_TIMESTAMP = date.getTime();
        this.config.set(this.props);
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var dest = 'src/lib';
        var file = 'consts.js';

        this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(dest, file),
            this.props
        );
    },
});
