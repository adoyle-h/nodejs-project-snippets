'use strict';

var Path = require('path');
var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {

    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: function() {
        var done = this.async();

        this.log(
            'Welcome to the ' + Path.basename(__filename) + ' generator!'
        );

        var prompts = [{
            type: 'confirm',
            name: 'someAnswer',
            message: 'Would you like to enable this option?',
            default: true,
        }];

        this.prompt(prompts, function(opts) {
            this.opts = opts;
            done();
        }.bind(this));
    },

    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
    configuring: function() {

    },

     // If the method name doesn't match a priority, it will be pushed to this group.
    default: function() {
        // body...
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        this.fs.copy(
            this.templatePath('source.js'),
            this.destinationPath('dummyfile.txt')
        );
    },

    // Where conflicts are handled (used internally)
    conflicts: function() {
        // body...
    },

    // Where installation are run (npm, bower)
    install: function() {
        // this.bowerInstall();
        // this.npmInstall();
        // this.installDependencies();
        // this.runInstall();
    },

    // Called last, cleanup, say good bye, etc
    end: function() {
        // body...
    },
});
