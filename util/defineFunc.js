'use strict';

var assert = include('lib/assert');  // eslint-disable-line

/**
 * only for defineFunc
 */
module.exports = function(util) {
    util.mixin({
        /**
         * 给 wrapper 封装一层参数校验，根据 asserts 的 Schema 规则校验
         *
         * 注意: 传递给 wrapper 的参数**有可能**不等于(===)调用 wrapper 时传进的参数
         *       毕竟函数本来就不应该有副作用(如影响上下文)，所以一般无须担心
         *
         * @param  {String}       name     函数名称
         * @param  {Array<Object> asserts  格式：[{schema, message}]
         * @param  {Function}     wrapper  实际执行的函数
         * @return {Frunction}  包装后的函数，调用方法同 wrapper
         * @method defineFunc(name, asserts, wrapper)
         * @method defineFunc(asserts, wrapper)
         */
        defineFunc: function(name, asserts, wrapper) {
            if (arguments.length === 2) {
                wrapper = asserts;
                asserts = name;
                name = '';
            }

            /* eslint no-eval: 0, no-multi-str: 0 */
            var f = eval('(function ' + name + '() {\
                var args = assert.check(arguments, asserts, {\
                    allowUnknown: true\
                });\
                wrapper.apply(this, args);\
            })');

            f.toString = wrapper.toString.bind(wrapper);
            return f;
        },
    });
};
