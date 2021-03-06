'use strict';

var Assert = require('joi');
var util = require('lodash');

/**
 * asserts 数组中每个 schema 会去匹配对应的 args。如果参数格式不对，则抛出异常。
 *
 * schema see https://github.com/hapijs/joi#validatevalue-schema-options-callback
 * 注意： 不要 try/catch assert 抛出的异常
 * 建议： 把定义 schema 放到函数外，能够提升函数执行速度
 * 建议： 在必要的地方检查参数。因为可能会影响性能。
 *
 * @param  {Array}     asserts 数组元素为 {schema, message}，message 可选。
 * @param  {Array<*>}  args    arguments
 * @param  {Object}    [opts]
 * @param  {Object}    [opts.allowUnknown=false]  是否允许 asserts 中没定义的参数通过
 * @return {Array}     校验后的 arguments
 * @method check
 */
Assert.check = function(args, asserts, opts) {
    opts = util.defaults({}, opts, {
        allowUnknown: false,
    });

    var result, rest;

    result = util.map(asserts, function(assert, index) {
        var rst, message;
        rst = Assert.validate(args[index], assert.schema, {
            allowUnknown: opts.allowUnknown,
        });
        if (rst.error) {
            message = 'Checkout: ' + assert.message + '\nInput Value: ' + rst.error.annotate();
            throw new Error(message);
        }
        return rst.value;
    });

    if (opts.allowUnknown) {
        rest = util.slice(args, asserts.length);
        result = result.concat(rest);
    }

    return result;
};

module.exports = Assert;

