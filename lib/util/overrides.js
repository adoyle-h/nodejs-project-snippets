'use strict';

/**
 * 在这里定义覆盖已经存在的同名函数
 * 通常用于改进函数
 */
module.exports = function(util) {
    <%_ if (locals.adoyleStyle) { _%>
    function createCollectionComparison(comparison) {
        var internal = {
            _indexOf: util.indexOf,
            predicate: util.identity,
            indexOf: function(array, value/*, fromIndex*/) {
                return util.findIndex(array, function(item) {
                    return internal.predicate(value, item);
                });
            },
        };
        return function() {
            var result;
            var predicate = util.last(arguments);

            if (util.isFunction(predicate)) {
                internal.predicate = predicate;
                util.indexOf = internal.indexOf;
                result = comparison.apply(this, util.initial(arguments));
                util.indexOf = internal._indexOf;
            } else {
                result = comparison.apply(this, arguments);
            }
            return result;
        };
    }

    util.mixin({
        /**
         * 对数组每个元素提取出指定属性，返回新数组
         *
         * @param  {Array} array      待过滤的数组
         * @param  {Array} properties 每个元素要提取的属性
         * @return {Array}
         * @method mapPick(array, properties)
         */
        mapPick: function(array, properties) {
            return util.chain(array).map(util.partialRight(util.pick, properties)).value();
        },
        /**
         * 求交集
         *
         * @method intersection(Array1, Array2[, Array3...][, predicate])
         * @param {...Array} [arrays]     待比较的多个数组
         * @param {Function} [predicate]  如果末尾是函数，用以作为判断元素的基准
         * @returns {Array}  共有的元素集合
         *
         * @example
         * util.intersection([1, 2], [4, 2], [2, 1]);
         * // => [2]
         *
         * @example
         * util.intersection([{id: 9}, {id:8,a:1}], [{id:9}, {id:8}], [{id:8}, {id:7}], function(pre, next) {
         *     return pre.id === next.id;
         * });
         * // => [{id: 8, a: 1}]
         */
        intersection: createCollectionComparison(util.intersection),
        /**
         * 返回从 array 筛除 values 后的结果
         *
         * @method intersection(array, values[, predicate])
         * @param {Array} array  待处理集合
         * @param {Array} values 需要筛除的元素集合
         * @param {Function} [predicate]  如果末尾是函数，用以作为判断元素的基准
         * @returns {Array}  排除 values 以后的新数组
         *
         * @example
         * util.difference([1,2,3], [2]);
         * // => [1, 3]
         *
         * @example
         * util.difference([{id: 1}, {id:2},{id:4}], [{id:2}], function(pre, next) {
         *     return pre.id === next.id;
         * });
         * // =>  [ { id: 1 }, { id: 4 } ]
         */
        difference: createCollectionComparison(util.difference),
        xor: createCollectionComparison(util.xor),
    }, {
        override: true,
    });
    <%_ } else { _%>
    util.mixin({}, {
        override: true,
    });
    <%_ } _%>
};
