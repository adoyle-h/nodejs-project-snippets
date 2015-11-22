/**
 * 初始化测试依赖的环境及工具
 */
'use strict';

var util = require('lib/util');

// 在所有测试运行之前执行
before(function(done) {
    util.traverseFilesSync('./plugins', function(filePath) {
        require(filePath).before();
    }, {
        recursive: true,
        format: 'full',
    });
});

// 在所有测试运行之后执行
// ATTENTION: 即使 before 阶段或者测试阶段报错，after 依然会执行
after(function(done) {
    util.traverseFilesSync('./plugins', function(filePath) {
        require(filePath).after();
    }, {
        recursive: true,
        format: 'full',
    });
});
