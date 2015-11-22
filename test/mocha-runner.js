'use strict';

require('../require');
var Path = require('path');
var Mocha = require('mocha');

var config = require('./config');
var globals = require('./globals');
var util = require('lib/util');

function resolve(path) {
    return Path.resolve(globals.TEST_ROOT, path);
}

function configMocha(mocha) {
    mocha.globals(util.keys(globals));
    mocha.reporter(config.get('reporter'));
    mocha.ui(config.get('ui'));
    mocha.useColors(!config.get('noColors'));
    mocha.useInlineDiffs(config.get('inlineDiffs'));
    mocha.suite.bail(config.get('bail'));
    mocha.suite.slow(config.get('slow'));
    mocha.suite.timeout(config.get('timeout'));
    if (config.get('grep')) mocha.grep(new RegExp(config.get('grep')));
    if (config.get('invert')) mocha.invert();
    if (config.get('checkLeaks')) mocha.checkLeaks();
    if (config.get('growl')) mocha.growl();
    if (config.get('asyncOnly')) mocha.asyncOnly();
}

function getTestCaseFiles(path) {
    var files = [];
    var avoidFiles = ['config.js', 'config.sample.js', 'globals.js', 'init.js', 'mocha-runner.js'];

    util.traverseFilesSync(path, function(filename) {
        files.push(filename);
    }, {
        avoidFiles: avoidFiles,
        recursive: true,
    });

    if (config.get('sort')) files.sort();

    return files;
}

function addTestCase(path) {
    var files = getTestCaseFiles(path);
    files.forEach(function(file) {
        mocha.addFile(file);
    });
}

function init() {
    var mocha = new Mocha();
    configMocha(mocha);

    // set limit of stack trace
    Error.stackTraceLimit = config.get('stackTraceLimit') || Infinity;

    // set globals
    util.each(globals, function(val, key) {
        global[key] = val;
    });

    mocha.addFile(resolve('init.js'));

    var systemTestPaths = config.get('testPaths.system');
    var unitTestPaths = config.get('testPaths.unit');
    if (systemTestPaths) addTestCase(resolve(systemTestPaths));
    if (unitTestPaths) addTestCase(resolve(unitTestPaths));
}


// Start
init();
mocha.run(function(failures) {
    process.exit(failures);
});
