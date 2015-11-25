'use strict';

var ms = require('ms');
var assert = include('lib/assert');

var ONE_MINUTE = ms('1m');
var ONE_DAY = ms('1d');

function idle() {}

/**
 * 在这里定义你自己的函数
 */
module.exports = function(util) {
    util.mixin({
        // /**
        //  * 获取项目目录的绝对路径，注意本文件在不同路径下需要进行相应的修改
        //  */
        // getProjectDir: util.memoize(function() {
        //     return Path.resolve(__dirname, '../');
        // }),
        /**
         * empty function. Idle ;-)
         */
        idle: idle,
        emtpyCallback: idle,
        testCallback: function(callback) {
            return function() {
                console.log(util.format('callback triggered, arguments: %j', arguments));
                callback.apply(this, arguments);
            };
        },
        getTodayStartTime: function(now) {
            if (!now) now = new Date();
            var timezoneOffset = now.getTimezoneOffset() * ONE_MINUTE;
            var startOfDay = Math.floor((now - timezoneOffset) / ONE_DAY) * ONE_DAY + timezoneOffset;
            return startOfDay;
        },
        /**
         * 转换成大驼峰格式
         *
         * @param  {String} str
         * @return {String}
         * @method upperCamelCase
         */
        upperCamelCase: function(str) {
            str = util.camelCase(str);
            return util.capitalize(str);
        },
        /**
         * 检查并返回当前 util 和 newUtils 中是否有重复的函数
         *
         * @param  {Object<string, function>}  newUtils
         * @return {Array<string>}  重复的函数名称数组
         * @method checkUtilIntersections
         */
        checkUtilIntersections: function(newUtils) {
            return util.intersection(util.functions(util), util.functions(newUtils));
        },
        /**
         * 打印出函数实现代码
         */
        printFunction: util.defineFunc([{
            message: 'func',
            schema: assert.func().required(),
        }], function(func) {
            /* eslint no-console: 0*/
            console.log(func.toString());
        }),
    });
};
