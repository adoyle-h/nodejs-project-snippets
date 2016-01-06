'use strict';

var lodash = require('lodash');

var util = lodash.runInContext();

var mixin = util.mixin;

/**
 * 建议使用 override=true 的 minxin 和普通 minxin 分开使用。
 * 这样可以确保哪些函数是要强制覆盖，哪些函数是要检验是否重复定义。
 *
 * @param  {Object}  object  key 是函数的名字，value 务必是函数
 * @param  {Object}  [opts]
 * @param  {Object}  [opts.override=false] 是否强制覆盖
 * @return {Object}  util
 * @method mixin(object, opts)
 */
util.mixin = function(object, opts) {
    opts = util.extend({
        override: false,
    }, opts);

    util.each(object, function(value, key) {
        if (util[key] !== undefined && opts.override === false) {
            var error = new Error('key: ' + key + ' 已存在，请勿重复定义');
            /* eslint no-console: 0 */
            console.warn(error.stack);
        }
    });
    return mixin.call(util, object);
};

// 定义 util 版本
util.version = {
    lodash: lodash.VERSION,
};

// 按顺序 minxin 函数
util.each([
    'core',
    'defineFunc',
    'third_party',
    'overrides',
    'custom',
], function(filename) {
    require('./' + filename)(util);
});

module.exports = util;
