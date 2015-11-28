'use strict';

var util = require('lodash');

/**
 * 在这里定义插件加载顺序，即 before/after 加载顺序。
 * 顺序按数组顺序执行。
 * 每个插件模块暴露出 before([done]) 或 after([done]) 接口，两个接口都是可选的。
 */
var pluginFileNames = [
    'backup',
    'mockery',
];

function loadPlugins() {
    util.each(pluginFileNames, function(filename) {
        var plugin = require('./' + filename);
        var pluginName = filename;
        var a = plugin.after;
        var b = plugin.before;
        var description = '[Plugin] ' + pluginName;

        // 在所有测试运行之前执行
        if (util.isFunction(b)) before(description, b);
        // 在所有测试运行之后执行
        // ATTENTION: 即使 before 阶段或者测试阶段报错，after 依然会执行
        if (util.isFunction(a)) after(description, a);
    });
}

loadPlugins();
