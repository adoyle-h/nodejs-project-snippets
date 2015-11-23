'use strict';

var fs = require('fs');
var Path = require('path');
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
        /**
         * 遍历目录下的文件
         */
        traverseFilesSync: util.defineFunc([{
            message: 'dirPath',
            schema: assert.string().required()
                .notes('目录的绝对路径或者相对路径'),
        }, {
            message: 'iteratee',
            schema: assert.func().required()
                .notes('函数签名: void iteratee(filename)')
                .notes('注意，iteratee 必须是同步函数'),
        }, {
            message: 'opts',
            schema: assert.object().keys({
                avoidFiles: assert.array().items(assert.string()).default([])
                    .notes('不被遍历的文件名'),
                recursive: assert.boolean().default(false)
                    .notes('是否遍历子目录'),
                extname: assert.string().default('.js')
                    .notes('被遍历的文件后缀'),
                format: assert.string().default('filename')
                    .valid(['filename', 'full', 'relative'])
                    .notes('iteratee(filename) 中的 filename 的输出格式')
                    .notes('filename，输出文件名(带后缀)')
                    .notes('full，输出绝对路径')
                    .notes('relative，输出相对路径'),
            }).default(),
        }], function(dirPath, iteratee, opts, originPath) {
            var avoidFiles = opts.avoidFiles;
            var recursive = opts.recursive;
            var extname = opts.extname;

            if (arguments.length === 3) {
                originPath = Path.resolve(dirPath);
            }

            var getOutput;
            if (opts.format === 'filename') {
                getOutput = function(filename) {
                    return filename;
                };
            } else if (opts.format === 'relative') {
                getOutput = function(filename) {
                    var curPath = Path.resolve(dirPath, filename);
                    return Path.relative(originPath, curPath);
                };
            } else {
                getOutput = function(filename) {
                    return Path.resolve(dirPath, filename);
                };
            }

            fs.readdirSync(dirPath).forEach(function(filename) {
                var filePath = Path.join(dirPath, filename);
                if (recursive && fs.statSync(filePath).isDirectory()) {
                    return util.traverseFilesSync(filePath, iteratee, opts, originPath);
                }

                if (Path.extname(filename) === extname &&
                    !util.contains(avoidFiles, filename)) {
                    iteratee(getOutput(filename));
                }
            });
        }),
    });
};
