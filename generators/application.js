'use strict';

var Path = require('path');
var extend = require('./_helper/nps_generator').extend;
var helper = require('./_helper');

module.exports = extend({
    npsName: 'application',

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, '../'));
    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: helper.prompting([
        [{
            type: 'input',
            name: 'output',
            message: 'app.js 输出路径',
            default: './app.js',
        }],
    ]),

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        this.fs.copy(
            this.templatePath('app.js'),
            this.destinationPath(this.props.output)
        );
    },

    // Where installation are run (npm, bower)
    install: function() {
        helper.writePackageDeps(this, [{
            depName: 'wodule', version: '0.1.0', opts: {save: true},
        }]);
    },
});
