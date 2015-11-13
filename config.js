'use strict';

var NODE_APP_INSTANCE = process.env.NODE_APP_INSTANCE;
// 当 NODE_APP_INSTANCE 存在时，必须添加该变量对应的配置文件，否则 node-config 会报警告
// 有时候生产环境不希望看到这种输出，所以临时删掉它
delete process.env.NODE_APP_INSTANCE;

module.exports = require('config');

process.env.NODE_APP_INSTANCE = NODE_APP_INSTANCE;
