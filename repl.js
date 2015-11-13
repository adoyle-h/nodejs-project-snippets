'use strict';

var include = require('./require').include;
var repl = include('lib/_repl');

var contents = {
    util: include('lib/util'),
    config: include('lib/config'),
    app: include('proj/app'),
    os: require('os'),
    CONSTS: include('src/CONSTS'),
    include: include,
};

repl({
    contents: contents,
});
