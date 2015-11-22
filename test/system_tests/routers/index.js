describe('路由测试', function() {
    var util = require(TEST_ROOT + 'lib/util');
    var pathUtil = require('path');
    var fs = require('fs');
    var avoidFiles = ['index.js'];

    function loadTestCases(path) {
        fs.readdirSync(path).forEach(function(filename) {
            var filePath = pathUtil.join(path, filename);
            if (fs.statSync(filePath).isDirectory()) {
                return loadTestCases(filePath);
            }

            if (pathUtil.extname(filename) === '.js' &&
                !util.contains(avoidFiles, filename)) {
                require(filePath)();
            }
        });
    }

    // 自动加载所有路由测试案例
    loadTestCases(TEST_ROOT + 'test/system_tests/routers/');
});