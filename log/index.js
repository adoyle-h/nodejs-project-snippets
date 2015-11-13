'use strict';

var Path = require('path');
var winston = require('winston');
var Console = require('./transports/console');

var config = include('lib/config');
var util = include('lib/util');

var IS_DEVELOPMENT_ENV = config.util.getEnv('NODE_ENV') === 'development';
var PROJECT_PATH = Path.resolve('.') + Path.sep;
var FILE_OPTS = config.get('logger.fileOpts');
var LEVEL = config.get('logger.level');

var internals = {
    logger: null,
    transports: [],
};


var LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
};
var COLORS = {
    debug: 'cyan',
    info: 'green',
    warn: 'yellow',
    error: 'red',
    fatal: 'redBright',
};

/**
 * 将目标对象(desc)的 key(property)对应的值，替换成 '[secret]' 或者指定的值(alternative)
 *
 * @side_effect desc
 * @param  {Object} desc
 * @param  {String} property
 * @param  {Any}    alternative
 * @method mask
 */
function mask(desc, property, alternative) {
    var val = util.get(desc, property);
    if (util.isUndefined(val)) return undefined;

    if (arguments.length === 2) {
        if (util.isString(val)) {
            alternative = '[secret]';
        } else if (util.isNumber(val)) {
            alternative = 0;
        }
    }

    util.set(desc, property, alternative);
}

/**
 * 根据 masks 制定的字段，直接修改传入的 meta 对应属性
 *
 * 如果对应属性为空，则 meta 不添加对应属性
 *
 * @side_effect meta
 * @param  {Object}               meta   元数据
 * @param  {Object|Array|String}  masks  如果为 Object，key 为指定属性，value 为替换值
 * @method maskMeta
 */
function maskMeta(meta, masks) {
    if (util.isArray(masks)) {
        util.each(masks, function(property) {
            mask(meta, property);
        });
    } else if (util.isObject(masks)) {
        util.each(masks, function(alternative, property) {
            mask(meta, property, alternative);
        });
    } else if (util.isString(masks)) {
        mask(meta, masks);
    }
}

/**
 * 修改(增强)元数据
 *
 * @param  {Object} meta          元数据
 * @return {Object}               新的元数据
 * @method modifyMeta
 */
function modifyMeta(meta) {
    var self = this;
    var $prod = meta.$prod;
    meta = util.omit(meta, ['$prod']);

    // 赋值其他 meta 数据

    var error = meta.err || meta.error;
    if (error && util.isError(error)) {
        meta.err = error.stack || error.message;
    }

    var filename = meta['@file'];
    meta['@file'] = self.filename;
    if (filename) meta['@originFile'] = filename.replace(PROJECT_PATH, '');

    // 在生产环境下，遮挡用户敏感信息
    if (!IS_DEVELOPMENT_ENV && $prod) {
        maskMeta(meta, $prod.mask);
    }

    return meta;
}

function wrapLogger(level) {
    /**
     * log 包装函数，用于包装跟业务逻辑相关的数据
     *
     * 调用方法：
     *
     * @example
     * logger.info('this is message');
     *
     * @example
     * var meta = {
     *     a: 1,
     *     b: 2
     * };
     * logger.info(meta);
     *
     * @example
     * logger.info(meta, 'message');
     * @example
     * logger.info(meta, 'id= %s', 1);
     * @example
     * logger.info(meta, 'object= %j', {a: 1});
     *
     * @example
     * var err = new Error();
     * logger.error(err);
     * @example
     * err.meta = {a: 1, b: 2}   // 添加其他的元数据
     * logger.error(err);
     * @example
     * logger.error(err, 'message');
     * @example
     * logger.info(meta, 'id= %s', 1);
     *
     * @example
     * logger.error(meta, error);
     *
     * 不支持 callback，因为没什么用
     *
     * @param  {String} message     具体写法见 https://github.com/alexei/sprintf.js#sprintfjs
     * @param  {Any}    params1..N  message 的填充参数
     * @param  {Object} meta        只支持深度为一层的 object
     * @method logWrapper
     */
    return function logger(/*[meta,] message[, params1, ... paramsN]*/) {
        var self = this;
        var arg0 = arguments[0];
        var message = '(empty message)';
        var meta = {};
        var params = [];
        var error;

        var MESSAGE_CONNECTOR = ' && ';

        if (util.isString(arg0)) {
            message = arg0;
            params = util.slice(arguments, 1);
        } else if (util.isError(arg0)) {
            error = arg0;
            meta = util.defaults({
                errorCode: error.code,
                errorStack: error.stack,
                errorDetail: error.detail,
            }, error.meta);

            if (arguments.length > 1) {
                message = arguments[1] + MESSAGE_CONNECTOR + error.message;
                params = util.slice(arguments, 2);
            } else {
                message = error.message;
            }
        } else if (util.isObject(arg0)) {
            meta = arg0;
            if (arguments.length > 1) {
                if (util.isError(arguments[1])) {
                    error = arguments[1];
                    meta = util.defaults({
                        errorCode: error.code,
                        errorStack: error.stack,
                        errorDetail: error.detail,
                    }, meta, error.meta);

                    if (arguments.length > 2) {
                        message = arguments[2] + MESSAGE_CONNECTOR + error.message;
                        params = util.slice(arguments, 3);
                    } else {
                        message = error.message;
                    }
                } else {
                    message = arguments[1];
                    if (meta.message) message = message + MESSAGE_CONNECTOR + meta.message;
                    params = util.slice(arguments, 2);
                }
            }
        } else {
            error = new Error(util.sprintf('logger 参数错误，请仔细阅读注释文档，及时修复。arguments= %j', arguments));
            /* eslint no-console: 0 */
            return console.error(error.stack);
        }

        message = util.vsprintf(message, params);

        if (!meta.$noMeta) {
            meta = modifyMeta.call(self, meta);
            self.logger[level](message, meta);
        } else {
            self.logger[level](message);
        }
    };
}


/**
 * 创建模块专用的 logger，logger 只支持以下方法：
 * - logger.debug
 * - logger.info
 * - logger.warn
 * - logger.error
 * - logger.fatal
 * - logger.query(opts[, callback])
 * - logger.profile([message=''])
 *
 * @param  {Object} module           通常用模块全局变量
 * @param  {Srting} module.filename  文件路径
 * @return {Object}                  logger
 * @method create
 */
exports.create = function(module) {
    var loggerWrapper = {
        filename: module.filename.replace(PROJECT_PATH, ''),
        logger: internals.logger,
    };

    util.each(LEVELS, function(_, level) {
        loggerWrapper[level] = wrapLogger(level);
    });

    loggerWrapper.query = function(options, callback) {
        callback = callback || function(err, results) {
            /* eslint no-console: 0 */
            if (err) return console.error(err);
            console.log(results);
        };
        internals.logger.query(options, callback);
    };

    loggerWrapper.profile = function(message) {
        if (message) message = '[Profiling] ' + message;
        else message = '[Profiling]';
        internals.logger.profile(message);
    };

    return loggerWrapper;
};

function addFileTransport(level, filePath) {
    if (LEVELS[LEVEL] > LEVELS[level]) return undefined;

    internals.transports.push(
        new winston.transports.File({
            logstash: true,
            name: level + '-file',
            filename: filePath,
            level: level,
            colorize: false,
            maxsize: util.bytes(FILE_OPTS.get('maxSize')),
            maxFiles: FILE_OPTS.get('maxFiles'),
            tailable: FILE_OPTS.get('tailable'),
        })
    );
}

exports.getLevels = function() {
    if (!internals.logger) return undefined;
    return LEVELS;
};

exports.setLevel = function(level, transport) {
    if (!internals.logger) return undefined;

    var transports = [];

    if (transport && internals.logger.transports[transport]) {
        transports.push(internals.logger.transports[transport]);
    } else {
        transports = util.keys(internals.logger.transports);
    }

    util.each(transports, function(transportName) {
        internals.logger.transports[transportName].level = level;
    });
};

exports.listTransport = function() {
    if (!internals.logger) return undefined;
    return util.keys(internals.logger.transports);
};

exports.removeTransport = function(name) {
    var logger = internals.logger;
    if (!logger) return undefined;
    return logger.remove(logger.transports[name]);
};

exports.init = function() {
    if (internals.logger) return undefined;

    util.each(config.get('logger.files'), function(path, level) {
        if (!util.isEmpty(path)) {
            path = Path.resolve(path);
            addFileTransport(level, path);
        }
    });

    internals.transports.push(
        new Console({
            level: LEVEL,
            colorize: config.get('logger.colorize'),
            timestamp: true,
            levels: LEVELS,
            colors: COLORS,
        })
    );

    var logger = new winston.Logger({
        exitOnError: false,
        transports: internals.transports,
        levels: LEVELS,
    });
    internals.logger = logger;
};

exports.init();
