'use strict';

var uuid = require('node-uuid');
var humps = require('humps');

/**
 * 在这里集成第三方库
 */
module.exports = function(util) {
    util.mixin(require('lodash-deep'));
    util.mixin(util.omit(require('underscore.string').exports(), [
        'capitalize', 'endsWith', 'escapeRegExp', 'pad', 'repeat',
        'startsWith', 'trim', 'words', 'sprintf', 'vsprintf', 'VERSION', 'wrap',
    ]));
    util.mixin(util.pick(require('sprintf-js'), ['sprintf', 'vsprintf']));

    util.mixin({
        // 字符串颜色转换
        colors: require('cli-color'),
        // see https://github.com/visionmedia/bytes.js
        bytes: require('bytes'),
        /**
         * 创建固定长度的随机字符串
         *
         * 安全级别较低
         *
         * @param  {Object}  [options]
         * @param  {Number}  [options.length=8]       字符串长度
         * @param  {Boolean} [options.numeric=true]   是否包含数字
         * @param  {Boolean} [options.letters=true]   是否包含字母
         * @param  {Boolean} [options.special=false]  是否包含特殊字符 !$%^&*()_+|~-=`{}[]:;<>?,./
         * @return {String}
         * @method randomString
         */
        randomString: require('random-string'),
        /**
         * 时间戳转换函数
         */
        ms: require('ms'),
        uuid: uuid.v4,
        camelizeObj: humps.camelizeKeys,
        snakelizeObj: humps.decamelizeKeys,
        capitalizeObj: humps.pascalizeKeys,
    });
};
