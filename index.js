'use strict';

var nodeUtil = require('util');
var util = require('lodash');
var moduleMap = require('./module_map');
var Package = require('./package.json');
var CP = require('child_process');

function NPS() {

}

NPS.prototype.generate = function(moduleName) {
    // body...
};

NPS.prototype.scaffold = function(settings) {
    var devDependencies = Package.devDependencies;
    var p, config, files, deps, selfDeps, depVersion, src, dest;

    util.each(settings, function(destPath, moduleName) {
        p = moduleMap[moduleName];
        config = p.config;
        files = p.files;
        deps = p.deps;
        selfDeps = p.selfDeps;

        util.each(deps, function(dep) {
            depVersion = devDependencies[dep];
        });

        if (util.isBoolean(destPath)) {
            dest = files[0];
        } else if (util.isString(destPath)) {
            if (moduleName === 'config') {

            } else {
                dest = destPath;
            }
        } else {
            throw new Error('destPath is neither boolean nor string.');
        }

        src = files[0];
        CP.execSync(nodeUtil('cp %s %s', src, dest));
    });
};

var nps = new NPS();
module.exports = nps;
