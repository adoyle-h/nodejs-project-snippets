'use strict';

require('./include');
var config = include('lib/config');
var util = include('lib/util');
var logger = include('lib/log').create(module);


var internals = {
    initialized: false,
    app: null,
    init: null,
    start: null,
    stop: null,
    exit: null,
};

var app = {};
internals.app = app;

exports = module.exports = internals;

/**
 * 初始化服务器
 *
 * @return {Boolean|Error} 如果成功，返回 true；如果不成功，返回错误对象
 * @method init
 */
internals.init = function init() {
    if (internals.initialized) return true;

    //...

    return internals.initialized;
};

/**
 * 初始化并启动服务器
 *
 * 先同步触发 callback(err)，后 return 是否启动成功。
 *
 * @param  {Function} callback  callback(err)
 * @method start
 */
internals.start = function start(callback) {
    callback = callback || util.emtpyCallback;
    var initialized = internals.init();

    //...
};

/**
 * 停止应用
 *
 * @param  {Number} exitCode UNIX 错误码
 * @return {Null}
 * @method stop
 */
internals.stop = function stop(callback) {
    callback = callback || util.emtpyCallback;
    if (internals.initialized !== true) return callback();

    //...
};

/**
 * 退出应用，结束进程。
 * 即使重复调用，只会执行一次。
 *
 * @param  {Number}  exitCode  进程退出状态码
 * @return {NULL}
 * @method exit(exitCode)
 */
var exit = util.once(function exit(exitCode) {
    internals.stop(function(err) {
        if (err) {
            logger.fatal(err, 'Process exit occurred error');
            exitCode = 2;
        }
        process.exit(exitCode || 0);
    });
});
internals.exit = exit;

// 不通过 require 调用，即直接作为进程启动，则设置进程监听，并启动服务器
if (!module.parent) {
    process.env.NODE_ENV = config.util.getEnv('NODE_ENV') || 'development';

    process.on('uncaughtException', function(err) {
        logger.fatal(err, 'Uncaught exception occurred in application!');
        exit(1);
    });

    process.on('message', function(msg) {
        if (msg === 'shutdown') {
            logger.info('Application received shutdown event, waiting for close');
            exit(0);
        }
    });

    process.on('SIGINT', function() {
        exit(0);
    });

    process.on('SIGTERM', function() {
        exit(0);
    });

    process.on('exit', function(code) {
        logger.info('Process exit with code: %s', code);
    });

    internals.start(function(err) {
        if (err) {
            logger.fatal(err, 'Failed to start application');
            return exit(1);
        }
    });
}
