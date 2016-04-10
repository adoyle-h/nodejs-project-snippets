'use strict';

var CONSTS = {
    EPOCH: {  // 只是定义一个应用的起始时间，定了就永远不能改动
        DATE: <%= EPOCH_DATE %>,
        TIMESTAMP: <%= EPOCH_TIMESTAMP %>,
    },
};

module.exports = CONSTS;
