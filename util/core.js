'use strict';

var nodeUtil = require('util');

/**
 * 定义核心函数集
 */
module.exports = function(util) {
    util.mixin(util.pick(nodeUtil, [
        'format', 'inspect', 'inherits', 'deprecate',
    ]));

    util.mixin(util.pick(nodeUtil, [
        'isError',
    ]), {
        override: true,
    });
};
