'use strict';

var load = require('../../sub_config').load;
var config = load('test', __dirname, ['default.js', 'local.js']);
module.exports = config;
