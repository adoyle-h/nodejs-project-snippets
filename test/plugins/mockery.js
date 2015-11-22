'use strict';

var mockery = require('mockery');


/**
 * 使用 fake/mock 模块**全局替换**某些模块
 */
function loadGlobalMocks() {
    // 暂时没有要替换的……

    mockery.enable({
        useCleanCache: true,
        warnOnUnregistered: false
    });
}

/**
 * 关闭 fake/mock 模块，还原成原来的样子
 */
function unloadGlobalMocks() {
    mockery.disable();
    mockery.deregisterAll();
}


exports.before = function() {
    loadGlobalMocks();
};

exports.after = function() {
    unloadGlobalMocks();
};
