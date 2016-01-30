'use strict';

exports.each = function(arr, iterator) {
    if (arr === null || typeof arr !== 'object') return undefined;
    var key;
    for (key in arr) {
        if (arr.hasOwnProperty(key)) {
            iterator(arr[key], key);
        }
    }
};

exports.keys = function(object) {
    if (object === null || typeof object !== 'object') return [];
    return Object.keys(object);
};

exports.isFunction = function(param) {
    return typeof param === 'function';
};
