'use strict';

var Path = require('path');
var generator = require('yeoman-generator');
var helper = require('../_helper');
var v = helper.v;

module.exports = generator.Base.extend({
    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, './templates'));
        this.destinationRoot(projectDir);

        this.props = {};

        this.log('Welcome to the [' + this.options.namespace + '] generator!');
    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: helper.prompting([
        [{
            type: 'input',
            name: 'name',
            message: 'Input name:',
            validate: helper.valid(v.string()),
        }],
    ]),

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var file = 'module.js';
        this.fs.copy(
            this.templatePath(file),
            this.destinationPath('src', this.props.name)
        );
    },

    // Called last, cleanup, say good bye, etc
    end: function() {
        this.log.ok('[' + this.options.namespace + '] Done. Enjoy yourself.');
    },
});
