'use strict';

var Path = require('path');
var winston = require('winston');
var Console = require('./transports/console');

var config = include('lib/config');
var util = include('lib/util');

var IS_DEVELOPMENT_ENV;
var PROJECT_DIR;
var MESSAGE_CONNECTOR;

var Log = {
    LOG_DIR: null,
    PROJECT_DIR: null,
    create: create,
    init: init,
    removeTransport: removeTransport,
    listTransports: listTransports,
    getLevels: getLevels,
    setLevel: setLevel,
};

var internals = {
    logger: null,
    transports: [],
};

var LEVELS;
var COLORS;

function trimPath(filePath) {
    return filePath.replace(PROJECT_DIR, './');
}

/**
 * 将目标对象(desc)的 key(property)对应的值，替换成默认值或者指定的值(alternative)
 *
 * 不同类型的 desc[property] 替换的默认值为：
 *   - String => '[secret String]'
 *   - Number => '[secret Number]'
 *   - Date => '[secret Date]'
 *   - Object|Array|Buffer => '[secret Object]'
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
            alternative = '[secret String]';
        } else if (util.isNumber(val)) {
            alternative = '[secret Number]';
        } else if (util.isDate(val)) {
            alternative = '[secret Date]';
        } else if (util.isObject(val)) {
            alternative = '[secret Object]';
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
 * 如果 meta 的深度大于一层，不要去修改深层的属性！
 */
function rewriteMeta(meta, rewriter) {
    return rewriter(meta);
}

/**
 * 修改(增强)元数据
 *
 * @param  {Object} meta          元数据
 * @return {Object}               新的元数据
 * @method modifyMeta
 */
function modifyMeta(meta) {
    var $mask = meta.$mask;
    var $rewriter = meta.$rewriter;
    var omits = [];

    if ($mask) {
        maskMeta(meta, $mask);
        omits.push('$mask');
    }

    if ($rewriter) {
        meta = rewriteMeta(meta, $rewriter);
        omits.push('$rewriter');
    }

    return util.omit(meta, omits);
}

/**
 * log 参数不限顺序，只要保证 message 在 meta 和 error 后面就行。
 *
 * log 如何区分 meta 和 error： error 必须是 Error 的实例；meta 必须是一个 Object。
 *
 * 若 error 存在下列字段，会自动被赋值到 meta 中去；且这些字段不会被传入的 meta 所覆盖。
 *     - meta.errorName: error.name,
 *     - meta.errorCode: error.code,
 *     - meta.errorStack: error.stack,
 *     - meta.errorDetail: error.detail,
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
 * logger.error(err);  // err.meta 会作为 meta 打印出来
 * @example
 * logger.error(err, 'extra message');  // err.message 会和 'extra message' 拼接输出。
 * @example
 * logger.info(meta, 'id= %s', 1);
 *
 * @example
 * logger.error(meta, error);  // 如果同时存在 meta 和 error.meta 的同名属性，meta 的优先级更高
 *
 * @param  {String} message     具体写法见 https://github.com/alexei/sprintf.js#sprintfjs
 * @param  {Any}    params1..N  message 的填充参数
 * @param  {Object} meta        只支持深度为一层的 object
 * @param  {Error}  error       Error 对象
 * @method log([meta][, error], message[, params1, ... paramsN])
 * @method log([meta][, error])
 * @method log(message[, params1, ... paramsN])
 * @method log([error][, meta][, message[, params1, ... paramsN]])
 */
function log() {
    if (arguments.length === 0) return undefined;
    var args = Array.prototype.slice.call(arguments);
    var message;
    var params;
    var meta;
    var error;
    var preArgs;

    var messageIndex = util.findIndex(args.slice(0, 3), util.isString);

    if (messageIndex !== -1) {
        params = args.slice(messageIndex + 1);
        message = util.vsprintf(args[messageIndex], params);
        preArgs = args.slice(0, messageIndex);
    } else {
        preArgs = args.slice(0, 2);
    }

    var arg;
    while (preArgs.length !== 0) {
        arg = preArgs.pop();
        if (util.isError(arg)) {
            error = arg;
        } else if (util.isObject(arg)) {
            meta = arg;
        }
    }

    if (error) {
        meta = util.defaults({
            errorName: error.name,
            errorCode: error.code,
            errorStack: error.stack,
            errorDetail: error.detail,
        }, meta, error.meta);

        if (message) {
            message = message + MESSAGE_CONNECTOR + error.message;
        } else {
            message = error.message;
        }
    }

    message = message || '(empty message)';

    if (meta) {
        if (IS_DEVELOPMENT_ENV === false) {
            // 在生产环境下，过滤/改写敏感信息
            meta = modifyMeta(meta);
        }
        this.logger.log(this.level, message, meta);
    } else {
        this.logger.log(this.level, message);
    }
}

function wrapLog(level) {
    return function() {
        return log.apply({
            logger: this.logger,
            level: level,
        }, arguments);
    };
}

/**
 * @param  {Object} params
 * @param  {String} params.filename 文件名
 * @param  {Object} params.logger  winston logger
 * @method Logger
 */
function Logger(params) {
    var logger = this;
    logger.filename = params.filename;
    logger.logger = params.logger;
}

util.each(LEVELS, function(_, level) {
    Logger.prototype[level] = wrapLog(level);
});

function queryCallback(err, results) {
    /* eslint no-console: 0 */
    if (err) return console.error(err);
    console.log(results);
}

Logger.prototype.query = function(options, callback) {
    callback = callback || queryCallback;
    this.logger.query(options, callback);
};

Logger.prototype.profile = function(message) {
    if (message) message = '[Profiling] ' + message;
    else message = '[Profiling]';
    this.logger.profile(message);
};

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
 * @param  {Object} module           通常用模块全局变量 `module`
 * @param  {Srting} module.filename  此 module 的文件路径，绝对路径。
 * @return {Object}                  logger
 * @method create(module)
 */
function create(module) {
    return new Logger({
        filename: trimPath(module.filename),
        logger: internals.logger,
    });
}

function getLevels() {
    if (!internals.logger) return undefined;
    return LEVELS;
}

function setLevel(level, transport) {
    var logger = internals.logger;
    if (!logger) return undefined;

    var transports = [];

    if (transport && logger.transports[transport]) {
        transports.push(logger.transports[transport]);
    } else {
        transports = util.keys(logger.transports);
    }

    util.each(transports, function(transportName) {
        logger.transports[transportName].level = level;
    });
}

function listTransports() {
    if (!internals.logger) return undefined;
    return util.keys(internals.logger.transports);
}

function removeTransport(name) {
    var logger = internals.logger;
    if (!logger) return undefined;
    return logger.remove(logger.transports[name]);
}

function addFileTransport(level, filePath, fileOpts) {
    internals.transports.push(
        new winston.transports.File({
            logstash: true,
            name: level + '-file',
            filename: filePath,
            level: level,
            colorize: false,
            maxsize: util.bytes(fileOpts.maxSize),
            maxFiles: fileOpts.maxFiles,
            tailable: fileOpts.tailable,
        })
    );
}

/**
 * 初始化日志模块
 *
 * @param  {Object} params.
 * @param  {Object} params.fileOpts
 * @param  {String} params.fileOpts.maxSize  每个文件大小上限，b\kb\mb\gb，大小写不敏感。如 '100MB'
 * @param  {Number} params.fileOpts.maxFiles  文件数量上限（Rotate 处理）
 * @param  {Boolean} params.fileOpts.tailable  If true, log files will be rolled based on maxsize and maxfiles, but in ascending order. The filename will always have the most recent log lines. The larger the appended number, the older the log file.
 * @param  {String} params.messageConnector  err.message 和自定义 message 之间的连接符
 * @param  {Boolean} params.isDevelopmentEnv  是否是开发环境。开发环境会输出所有原本的日志，而非开发环境会使用 mask 和 rewrite 会隐藏敏感数据
 * @param  {String} params.projectDir  项目路径根目录，可以是相对路径，也可以是绝对路径
 * @param  {String} [params.logDir='<params.projectDir>/logs']  日志目录，可以是相对路径，也可以是绝对路径。
 *                                                              默认是项目根目录下的 logs 目录。
 * @param  {String} params.level  最低输出日志级别（控制所有日志输出的 level）
 * @param  {Object<String, Number>} params.LEVELS  日志等级(level)以及它的权重
 * @param  {Object<String, String>} params.COLORS  不同 level 对应的颜色，可以使用已下颜色之一：
 *                                                 前景色: ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'Bright', 'blackBright', 'redBright', 'greenBright', 'yellowBright', 'blueBright', 'magentaBright', 'cyanBright', 'whiteBright']
 *                                                 背景色: ['bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite', 'variants', 'bgBlackBright', 'bgRedBright', 'bgGreenBright', 'bgYellowBright', 'bgBlueBright', 'bgMagentaBright', 'bgCyanBright', 'bgWhiteBright']
 * @param  {Object} params.files
 * @param  {String|Null} params.files.<level>  不同 level 的日志文件保存路径。可用相对路径(相对于当前进程所在目录)或者绝对路径。置为 null，则不生成对应日志文件
 *
 * @param  {Boolean} params.colorize  终端输出是否显示颜色
 * @return {Null}
 * @method init(params)
 */
function init(params) {
    if (internals.logger) return undefined;

    LEVELS = params.LEVELS;
    COLORS = params.COLORS;

    var LEVEL = params.level;
    var logDir;
    PROJECT_DIR = Path.resolve(params.projectDir) + Path.sep;
    Log.PROJECT_DIR = PROJECT_DIR;

    if (params.logDir) {
        logDir = Path.resolve(params.logDir) + Path.sep;
    } else {
        logDir = Path.resolve(params.projectDir, 'logs') + Path.sep;
    }
    Log.LOG_DIR = logDir;

    IS_DEVELOPMENT_ENV = params.isDevelopmentEnv;
    MESSAGE_CONNECTOR = params.messageConnector;
    var fileOpts = params.fileOpts;


    util.each(params.files, function(path, level) {
        if (util.isEmpty(path)) {
            return undefined;
        }
        var filePath = Path.resolve(logDir, path);
        addFileTransport(level, filePath, fileOpts);
    });

    internals.transports.push(
        new Console({
            level: LEVEL,
            colorize: params.colorize,
            timestamp: true,
            stderrLevel: 'warn',
            levels: LEVELS,
            colors: COLORS,
        })
    );

    var logger = new winston.Logger({
        exitOnError: false,
        transports: internals.transports,
        levels: LEVELS,
        colors: COLORS,
    });
    internals.logger = logger;
}

init({
    LEVELS: {
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    COLORS: {
        debug: 'cyan',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'redBright',
    },
    fileOpts: config.get('logger.fileOpts'),
    messageConnector: ' && ',
    isDevelopmentEnv: process.env.NODE_ENV === 'development',
    projectDir: process.cwd(),
    level: config.get('logger.level'),
    files: config.get('logger.files'),
    colorize: config.get('logger.colorize'),
});


module.exports = exports = Log;
