'use strict';

var nodeUtil = require('util');

/**
 * 定义核心函数集
 */
module.exports = function(util) {
    util.mixin(util.pick(nodeUtil, [
        'format', 'inspect', 'inherits', 'deprecate',
    ]));

    /**
     * 使用 node util 的 isError 覆盖 lodash 的 isError
     * 是因为 lodash 有一个判别条件是 Object.prototype.toString.call(err) 是否等于 '[object Error]'
     * 而普通的类继承实现方法，其结果是 '[object Object]'，导致与期望不符。
     *
     * 而 node 的 isError 是通过 instanceof 来判断的，所以没有问题。
     */
    util.mixin(util.pick(nodeUtil, [
        'isError',
    ]), {
        override: true,
    });
};
