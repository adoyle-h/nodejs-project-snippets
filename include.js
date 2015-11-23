'use strict';

var Path = require('path');
var rfr = require('rfr');
var util = require('lodash');

var Includers = {};

function include(modulePath) {
    var params = modulePath.split('/');
    if (params.length !== 2) return new Error('modulePath: ' + modulePath + '错误');
    var alias = params[0];
    var moduleName = params[1];
    var includer = Includers[alias];
    if (!includer) throw new Error('无法加载模块: alias: ' + alias + ' 不存在');

    return includer(moduleName);
}

function createIncluder(alias, path) {
    var includer = rfr({
        root: path,
    });
    Includers[alias] = includer;
    return includer;
}


/**
 * another require
 *
 * 默认生成一个名为 proj 的别名(alias)指向 rootPath
 *
 * @param  {String} rootPath  被加载模块的相对根路径
 * @param  {Object} [opts]
 * @param  {Object} [opts.map={}]
 * @param  {Boolean} [opts.global=false]
 * @return {NULL}
 * @method init(rootPath, opts)
 */
function init(rootPath, opts) {
    rootPath = rootPath || process.env.NODE_ROOT;
    opts = util.extend({
        map: {},
        global: false,
    }, opts);

    createIncluder('proj', rootPath);

    util.map(opts.map, function(relativePath, alias) {
        createIncluder(alias, Path.resolve(rootPath, relativePath));
    });

    if (opts.global) {
        global.Includers = Includers;
        global.include = include;
    }

    return Includers;
}

exports = module.exports = {
    createIncluder: createIncluder,
    init: init,
    Includers: Includers,
    include: include,
};


// 始终将 projectDir 设置成你的项目根目录的绝对路径。
var projectDir = process.env.NODE_ROOT || Path.resolve(__dirname, '.');

// 为了不额外创建一个文件，我将目录映射写在这个文件中。
// 默认会有一个 'proj'，指向 projectDir 的路径。
init(projectDir, {
    map: {
        'assets': 'assets',
        'lib': '.',
        'helpers': 'src/helpers',
        'routers': 'src/routers',
        'controllers': 'src/controllers',
        'models': 'src/models',
        'test': 'test',
        'src': '.',
    },
    global: true,
});
