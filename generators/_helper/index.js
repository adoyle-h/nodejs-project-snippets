'use strict';

var Promise = require('bluebird');
var nodeUtil = require('util');
var util = require('lodash');
var semver = require('semver');

exports.v = require('./validator').v;
exports.valid = require('./validator').valid;

exports.prompt = function(generator, prompts) {
    var done = generator.async();
    generator.props = generator.props || {};

    generator.prompt(prompts, function(props) {
        util.assign(generator.props, props);
        done();
    });
};
exports.promptFunc = function(func) {
    return function() {
        var prompts = func.call(this);
        exports.prompt(this, prompts);
    };
};
exports.prompting = function(funcs) {
    var prompting = {};

    funcs.forEach(function(func, index) {
        var type = Object.prototype.toString.call(func);
        if (type === '[object Function]') {
            prompting[index] = exports.promptFunc(func);
        } else if (type === '[object Array]') {
            prompting[index] = function() {
                exports.prompt(this, func);
            };
        }
    });

    return prompting;
};

var STEPS = {
    NONE: 1,
    SKIP: 2,
    INSTALL: 3,
};

function askBeforeWritePackageDeps(self, dep, deps) {
    var depName = dep.depName;
    var version = dep.version;
    var saveDev = dep.opts.saveDev;
    var npsName = self.determineAppname();

    return Promise.fromCallback(function(callback) {
        var found = JSON.stringify(deps, null, 4).replace('   "' + depName + '":', '=> "' + depName + '":');

        var message = nodeUtil.format(
            '[%s] The package found in local package.json: %s. While generator want to npm install %s %s@%s. \nAgree?',
            npsName, found, (saveDev ? '--save-dev' : '--save'), depName, version
        );

        self.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: message,
        }], function(props) {
            if (props.confirm) {
                return callback(null, STEPS.INSTALL);
            } else {
                return callback(null, STEPS.SKIP);
            }
        });
    });
}

exports.writePackageDeps = function(self, deps, callback) {
    var pkg = self.fs.readJSON(self.destinationPath('package.json'), {});
    var devDependencies = util.get(pkg, 'devDependencies', {});
    var dependencies = util.get(pkg, 'dependencies', {});
    var npsName = self.determineAppname();

    if (!callback) callback = self.async();

    return Promise.each(deps, function(dep) {
        var depName = dep.depName;
        var version = dep.version;
        var opts = dep.opts;

        var devVersionRange = devDependencies[depName];
        var versionRange = dependencies[depName];

        return Promise.resolve()
            .then(function() {
                if (versionRange) {
                    if (semver.satisfies(version, versionRange)) {
                        return STEPS.NONE;
                    } else {
                        return askBeforeWritePackageDeps(self, dep, {dependencies: dependencies});
                    }
                } else if (devVersionRange) {
                    if (semver.satisfies(version, devVersionRange)) {
                        return STEPS.NONE;
                    } else {
                        return askBeforeWritePackageDeps(self, dep, {devDependencies: devDependencies});
                    }
                } else {
                    return STEPS.INSTALL;
                }
            })
            .then(function(step) {
                var _devDependencies;
                if (step === STEPS.INSTALL) {
                    if (opts.saveDev) {
                        _devDependencies = devDependencies;
                    } else {
                        _devDependencies = dependencies;
                    }
                    _devDependencies[depName] = version;
                } else if (step === STEPS.SKIP) {
                    self.log.skip('[' + npsName + '] Skip ' + depName + '@' + version + ' for installation. It may cause error.');
                }
            });
    }).then(function() {
        util.assign(pkg, {
            devDependencies: devDependencies,
            dependencies: dependencies,
        });
        self.fs.writeJSON(self.destinationPath('package.json'), pkg);
    }).asCallback(callback);
};
