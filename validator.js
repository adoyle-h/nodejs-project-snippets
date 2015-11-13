'use strict';

var v = require('joi');
var util = require('lodash');


// 将每个 validator 包装成函数，赋值给 v。为了保持写法一致
v.addValidators = function(validators) {
    util.each(validators, v.addValidator);
};

v.addValidator = function(validator, key) {
    /* eslint no-console: 0 */
    if (v[key] !== undefined) {
        return console.warn('Warning: "' + key + '" has been added.');
    }
    v[key] = util.constant(validator);
};

// 一级 alias。将多处用到的校验规则简写成一个 alias。便于复用、重构与书写
v.addValidators({
    userId: v.string().alphanum(),
    username: v.string().max(50).trim(),
});

// 二级 alias。利用一级 alias 构建更复杂的校验规则
v.addValidators({

});

module.exports = v;

