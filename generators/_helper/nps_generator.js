'use strict';

var util = require('lodash');
var Path = require('path');
var generator = require('yeoman-generator');

var prefix = 'nps:';

var majorMethods = {
    // Your initialization methods (checking current project state, getting configs, etc)
    initializing: function() {
        this.defaults = this.config.getAll();
        this.props = {};

        var destRoot = this.defaults.destRoot;
        if (destRoot) {
            destRoot = Path.resolve(destRoot);
        } else {
            destRoot = process.cwd();
        }
        this.destinationRoot(destRoot);
    },

    prompting: function() {
        this.log('Welcome to the [' + this.determineAppname() + '] generator!');
    },

    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
    configuring: function() {
        this.config.set(this.props);
    },

    // // Where you write the generator specific files (routes, controllers, etc)
    // writing: function() {
    //     // body...
    // },

    // // Where conflicts are handled (used internally)
    // conflicts: function() {
    //     // body...
    // },

    // // Where installation are run (npm, bower)
    // install: function() {
    //     // body...
    // },

    // Called last, cleanup, say good bye, etc
    end: function() {
        this.log.ok('[' + this.determineAppname() + '] Done. Enjoy yourself.');
    },
};

function wrap(major, func) {
    return function() {
        var self = this;
        major.call(this);
        if (util.isPlainObject(func)) {
            util.each(func, function(f) {
                f.call(self);
            });
        } else {
            return func.call(this);
        }
    };
}

var methods = {
    rootGeneratorName: function() {
        return prefix + this.npsName;
    },

    determineAppname: function() {
        return prefix + this.npsName;
    },
};

exports.extend = function(obj) {
    var _methods = {};
    util.each(majorMethods, function(method, key) {
        if (obj[key]) {
            _methods[key] = wrap(method, obj[key]);
        } else {
            _methods[key] = method;
        }
    });
    var m = util.assign({}, methods, obj, _methods);
    return generator.Base.extend(m);
};
