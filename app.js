'use strict';

require('./include');
var Module = require('wodule');
var config = include('proj/config');
var logger = include('lib/log').create(module);

var app = {};

function init() {
    // do something to initialize
}

function start(callback) {
    callback();
}

function stop(callback) {
    callback();
}

function exit(err) {
    if (err) {
        logger.fatal(err, 'An error occurred when prepare to exit application.');
    }
}

var mod = new Module({
    init: init,
    start: start,
    stop: stop,
    exit: exit,
});

mod.init();
mod.app = app;

// If this file is not required by module –– started by `node app.js`,
// then set listeners on process and start application.
// Otherwise, only initialize and export as module.
if (!module.parent) {
    process.env.NODE_ENV = config.util.getEnv('NODE_ENV') || 'development';

    process.on('uncaughtException', function(err) {
        logger.fatal(err, 'Uncaught exception occurred in application!');
        mod.exit(1);
    });

    process.on('message', function(msg) {
        if (msg === 'shutdown') {
            logger.info('Application received shutdown event, waiting for close.');
            mod.exit();
        }
    });

    process.on('SIGINT', function() {
        mod.exit();
    });

    process.on('SIGTERM', function() {
        mod.exit();
    });

    process.on('exit', function(code) {
        logger.info('Process exit with code: %s.', code);
    });

    mod.start(function(err) {
        if (err) {
            logger.fatal(err, 'Failed to start application.');
            mod.exit(2);
        } else {
            logger.info('Application started successfully.');
        }
    });
}

module.exports = mod;
