'use strict';

var Path = require('path');
var generator = require('yeoman-generator');
var helper = require('../_helper');
var v = helper.v;

module.exports = generator.Base.extend({
    <%_ if (constructor) { _%>
    // Define arguments and options for printing usage
    constructor: function() {
        generator.Base.apply(this, arguments);

        this.argument('argName', {
            type: String, // String, Number, Array, or Object
            required: true, // Boolean whether it is required
            default: 'hello', // Default value for this argument
            desc: 'This is an required argument.', // Description for the argument
        });

        this.option('optionName', {
            type: Boolean,  // Either Boolean, String or Number
            required: false,
            defaults: true,
            desc: 'This is an optional.',
            alias: 'm',  // Option name alias (example -h and --help`)
            hide: false, // Boolean whether to hide from help
        });
    },

    <%_ } _%>
    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.sourceRoot(Path.resolve(__dirname, './templates'));
        this.destinationRoot(projectDir);

        this.defaults = this.config.getAll();
        this.props = {};

        this.log('Welcome to the [' + this.options.namespace + '] generator!');
    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: helper.prompting([
        function() {
            return [{
                type: 'input',
                name: 'name',
                message: 'Input name:',
                default: this.defaults.name,
                validate: helper.valid(v.string()),
            }];
        },
        [{
            type: 'confirm',
            name: 'confirm',
            message: 'Confirm name:',
        }],
    ]),

    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
    configuring: function() {
        this.config.set(this.props);
    },

    // If the method name doesn't match a priority, it will be pushed to this group. (composeWith other generators)
    default: function() {
        // body...
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        var file = 'template';
        var dest = '.';

        this.fs.copy(
            this.templatePath(file),
            this.destinationPath(dest, this.props.name),
            {globOptions: {dot: true, ignore: '**/.DS_Store'}}
        );

        // or
        this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(dest, this.props.name),
            this.props,
            {globOptions: {dot: true, ignore: '**/.DS_Store'}}
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
        this.log.ok('[' + this.options.namespace + '] Done. Enjoy yourself.');
    },
});
