/**
 * 这个文件仅用来存放全局变量
 */
'use strict';

var path = require('path');
var chai = require('chai');

// side-effect
require('should');
require('should-http');

module.exports = {
    TEST_ROOT: path.resolve('.') + path.sep,
    expect: chai.expect,
    assert: chai.assert,
};
