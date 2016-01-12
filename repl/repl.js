'use strict';

var REPL = require('repl');
var shell = require('shelljs');
var util = require('lodash');
var nodeUtil = require('util');

module.exports = function repl(opts) {
    opts = util.defaultsDeep(opts, {
        welcome: 'Welcome to REPL!',
        bin: null,
        contents: {
            shell: shell,
        },
        prompt: '> ',
        input: process.stdin,
        output: process.stdout,
        useColors: true,
        writer: nodeUtil.inspect,
    });

    var r1;

    r1 = REPL.start(opts);
    r1.on('exit', function() {
        process.exit(0);
    });
    util.extend(r1.context, opts.contents);
    r1.context.repl = r1;
};
