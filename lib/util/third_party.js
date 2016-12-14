/**
 * 在这里集成第三方库
 */

const uuid = require('node-uuid');

module.exports = (util) => {
    const o = util.pick(require('sprintf-js'), ['sprintf', 'vsprintf']);
    util.assign(o, {
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
        walk: require('walkdir'),
        /**
         * 时间戳转换函数
         */
        ms: require('ms'),
        uuid: uuid.v4,
    });

    return o;
};
