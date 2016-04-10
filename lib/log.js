'use strict';

var Path = require('path');
var winston = require('winston');
var util = require('lodash');
var bytes = require('bytes');
var NPSLog = require('nps-log');
var PrettyConsole = require('winston-pretty-console');

var config = include('proj/config');

var PROJECT_DIR, LEVELS, COLORS;
var initialized = false;
var transports = [];

function trimPath(filePath) {
    return filePath.replace(PROJECT_DIR, './');
}

function getFileTransport(level, filePath, fileOpts) {
    return new winston.transports.File({
        logstash: true,
        name: level + '-file',
        filename: filePath,
        level: level,
        colorize: false,
        maxsize: bytes(fileOpts.maxSize),
        maxFiles: fileOpts.maxFiles,
        tailable: fileOpts.tailable,
    });
}

/**
 * 初始化日志模块
 *
 * @param  {Object} params.
 * @param  {Object} params.fileOpts
 * @param  {String} params.fileOpts.maxSize  每个文件大小上限，b\kb\mb\gb，大小写不敏感。如 '100MB'
 * @param  {Number} params.fileOpts.maxFiles  文件数量上限，轮换（Rotate）处理
 * @param  {Boolean} params.fileOpts.tailable  如果为 true，最新的日志在编号最小的文件里。否则相反。
 * @param  {Boolean} params.isProductionEnv  是否是生产环境。非生产环境会输出所有原本的日志，而生产环境会使用 mask 和 rewrite 来隐藏敏感数据
 * @param  {String} params.projectDir  项目路径根目录，可以是绝对路径，也可以是相对路径（相对于当前进程所在路径）
 * @param  {String} [params.logDir='<params.projectDir>/logs']  日志保存目录，可以是绝对路径，也可以是相对路径（相对于 projectDir）
 *                                                              默认是项目根目录（即 projectDir）下的 logs 目录。
 * @param  {String} params.level  最低输出日志级别（控制所有日志输出的 level）
 * @param  {Object<String, Number>} params.LEVELS  日志等级(level)以及它的权重。权重最小为 0，最大无上限。
 *                                                 权重值越大，等级越低，紧急程度越低，如 debug 的权重应该高于 error。
 *                                                 为何是这奇葩的顺序？具体见 [winston](https://github.com/winstonjs/winston/commit/fb9eec0)
 * @param  {Object<String, String>} params.COLORS  不同 level 对应的颜色，可以使用已下颜色之一：
 *                                                 前景色: ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'Bright', 'blackBright', 'redBright', 'greenBright', 'yellowBright', 'blueBright', 'magentaBright', 'cyanBright', 'whiteBright']
 *                                                 背景色: ['bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite', 'variants', 'bgBlackBright', 'bgRedBright', 'bgGreenBright', 'bgYellowBright', 'bgBlueBright', 'bgMagentaBright', 'bgCyanBright', 'bgWhiteBright']
 * @param  {Object} params.files
 * @param  {String|Null} params.files.<level>  不同 level 的日志文件保存路径。可用相对路径(相对于 logDir)或者绝对路径。置为 null，则不生成对应日志文件
 *
 * @param  {Boolean} params.colorize  终端输出是否显示颜色
 * @return {Null}
 * @method init(params)
 */
function init(params) {
    if (initialized) return undefined;

    NPSLog.init({
        isProductionEnv: params.isProductionEnv,
    });

    LEVELS = params.LEVELS;
    COLORS = params.COLORS;

    var fileOpts = params.fileOpts;
    var level = params.level;
    var logDir, transport;

    PROJECT_DIR = Path.resolve(params.projectDir) + Path.sep;
    exports.PROJECT_DIR = PROJECT_DIR;

    if (params.logDir) {
        logDir = Path.resolve(PROJECT_DIR, params.logDir) + Path.sep;
    } else {
        logDir = Path.resolve(PROJECT_DIR, 'logs') + Path.sep;
    }
    exports.LOG_DIR = logDir;

    // add file transports
    util.each(params.files, function(path, fileLevel) {
        if (util.isEmpty(path)) {
            return undefined;
        }
        var filePath = Path.resolve(logDir, path);
        transport = getFileTransport(fileLevel, filePath, fileOpts);
        transports.push(transport);
    });

    // add console transport
    transports.push(
        new PrettyConsole({
            level: level,
            levels: LEVELS,
            colors: COLORS,
            colorize: params.colorize,
            timestamp: params.console.timestamp,
            stderrLevel: params.console.stderrLevel,
            pe: util.extend(params.console.pe, {
                projectDir: PROJECT_DIR,
                colorize: params.colorize,
            }),
        })
    );

    initialized = true;
}

init({
    LEVELS: {
        debug: 5,
        verbose: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    COLORS: {
        debug: 'blue',
        verbose: 'cyan',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'redBright',
    },
    fileOpts: config.get('logger.fileOpts'),
    isProductionEnv: process.env.NODE_ENV === 'production',
    projectDir: process.cwd(),
    logDir: config.get('logger.logDir'),
    level: config.get('logger.level'),
    files: config.get('logger.files'),
    colorize: config.get('logger.colorize'),
    console: {
        timestamp: true,
        stderrLevel: 'warn',
        pe: {
            themeColor: 'red',
        },
    },
});

exports.create = function(params) {
    var logger = NPSLog.create({
        exitOnError: false,
        transports: transports,
        levels: LEVELS,
        colors: COLORS,
        filename: params.filename && trimPath(params.filename),
    });
    return logger;
};
