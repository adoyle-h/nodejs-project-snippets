'use strict';

var util = require('lodash');
var url = require('url');


// 载入文件时执行
util.mixin({
    /**
     * Refer To http://nodejs.org/api/url.html#url_url_format_urlobj
     */
    mkURL: function (pathname, opts) {
        pathname = pathname || '/';
        opts = opts || {};
        var hostname = config.host;
        if (opts.api) hostname = 'api.' + hostname;

        var urlObj = util.defaults(opts, {
            protocol: 'http',
            slashes: true,
            hostname: hostname,
            pathname: pathname,
        });
        return url.format(urlObj);
    },
});

module.exports = util;
