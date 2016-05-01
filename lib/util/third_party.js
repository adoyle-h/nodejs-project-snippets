'use strict';

<%_ if (locals.adoyleStyle) { _%>
var uuid = require('node-uuid');

<%_ } _%>
/**
 * 在这里集成第三方库
 */
module.exports = function(util) {
    <%_ if (locals.adoyleStyle) { _%>
    util.mixin(require('lodash-deep'));
    util.mixin(util.pick(require('sprintf-js'), ['sprintf', 'vsprintf']));

    util.mixin({
        console: require('better-console'),
        debug: require('debug'),
        updeep: require('updeep'),
        walk: require('walkdir'),
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
    });
    <%_ } else { _%>
    util.mixin({});
    <%_ } _%>
};
