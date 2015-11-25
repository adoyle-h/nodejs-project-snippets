/**
 * 初始化测试依赖的环境及工具
 */
'use strict';

var util = require('lib/util');

var plugins = require('./plugins');

// 在所有测试运行之前执行
before(function(done) {
    util.each(plugins, function(plugin) {
        var before = plugin.before;
        if (!before) return done();

        if (before.length === 0) {
            before();
            done();
        } else {
            before(done);
        }
    });
});

// 在所有测试运行之后执行
// ATTENTION: 即使 before 阶段或者测试阶段报错，after 依然会执行
after(function(done) {
    util.each(plugins, function(plugin) {
        var after = plugin.after;
        if (!after) return done();

        if (after.length === 0) {
            after();
            done();
        } else {
            after(done);
        }
    });
});
