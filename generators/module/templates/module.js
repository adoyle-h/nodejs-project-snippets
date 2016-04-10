'use strict';

var Module = require('wodule');

function init() {
    // do something to initialize
}

function start(callback) {
    callback();
}

function stop(callback) {
    callback();
}

var mod = new Module({
    init: init,
    start: start,
    stop: stop,
});

module.exports = mod;
