'use strict';

var load = require('../../sub_config').load;
var config = load('test', __dirname, ['default.js', 'local.js']);
module.exports = config;
// 如果是写类库，直接导出配置足以，不需要区分 default 和 local，因此不需要使用 sub_config 或者其他类库。
// module.exports = require('./default');
