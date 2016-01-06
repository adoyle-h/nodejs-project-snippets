'use strict';

var include = require('../include').include;
var repl = require('./repl');

var contents = {
    include: include,
    util: include('lib/util'),
    config: include('lib/config'),
    os: require('os'),
    CONSTS: include('lib/consts'),
    logger: include('lib/log').create(module),
};

repl({
    contents: contents,
});
