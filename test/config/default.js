'use strict';

module.exports = {
    testPaths: {
        system: 'cases/system_tests',     // 注释这行，将不执行集成测试
        unit: 'cases/unit_tests',         // 注释这行，将不执行单元测试
    },
    stackTraceLimit: Infinity,          // Integer or Infinity. Cannot be zero.
    reporter: 'spec',                   // refer to http:// mochajs.org/#reporters
    ui: 'bdd',                          // refer to http:// mochajs.org/#interfaces
    inlineDiffs: false,                 // true or false
    slow: 0,                            // microsecond
    timeout: 10000,                     // microsecond
    bail: false,                        // true or false
    grep: false,                        // true or false
    invert: false,                      // true or false
    asyncOnly: false,                   // true or false
    noColors: false,                    // true or false
    // sort: false,                        // test files sorted by file name. true or false
    recursive: true,                    // true or false
};
