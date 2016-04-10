'use strict';

var repl = require('./repl');

var contents = {
    os: require('os'),
};

repl({
    contents: contents,
});
