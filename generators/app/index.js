'use strict';

var util = require('lodash');
var Path = require('path');
var generator = require('yeoman-generator');
var helper = require('../_helper');
var v = helper.v;

module.exports = generator.Base.extend({
    // Define arguments and options for printing usage
    constructor: function() {
        generator.Base.apply(this, arguments);
    },

    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        var destRoot = this.defaults.destRoot;
        if (destRoot) {
            destRoot = Path.resolve(destRoot);
        } else {
            destRoot = process.cwd();
        }
        this.destinationRoot(destRoot);
        this.sourceRoot(Path.resolve(__dirname, '../../'));

        this.defaults = this.config.getAll();
        this.props = {};

        this.log('Welcome to the [' + this.options.namespace + '] generator!');
    },

    // Where you prompt users for options (where you'd call this.prompt())
    prompting: helper.prompting([
        function() {
            var moduleNames = [
                'application', 'assert', 'config', 'consts', 'error', 'eslint',
                'generator', 'gitignore', 'gulp', 'include', 'license', 'log',
                'readme', 'repl', 'test', 'util', 'validator',
            ];
            var choices = moduleNames.map(function(name) {
                return {
                    name: name,
                    checked: false,
                };
            });
            return [{
                type: 'checkbox',
                name: 'modules',
                message: '选择你要使用的模块',
                choices: choices,
                validate: helper.valid(v.array().min(1)),
                filter: function(answers) {
                    var modules = {};
                    answers.forEach(function(name) {
                        modules[name] = true;
                    });
                    return modules;
                },
            }];
        },
    ]),

    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
    configuring: function() {

    },

    // If the method name doesn't match a priority, it will be pushed to this group. (composeWith other generators)
    default: function() {
        var self = this;
        util.each(self.props.modules, function(yes, name) {
            if (!yes) return undefined;
            self.composeWith('nps:' + name, {}, {
                local: require.resolve('../' + name),
            });
        });
    },

    // Where you write the generator specific files (routes, controllers, etc)
    writing: function() {
        // this.fs.copy(
        //     this.templatePath(),
        //     this.destinationPath(this.opts.name)
        // );
    },

    // Where installation are run (npm, bower)
    install: function() {
        this.npmInstall();
    },

    // Called last, cleanup, say good bye, etc
    end: function() {
        this.log.ok('[' + this.options.namespace + '] Done. Enjoy yourself.');
    },
});
