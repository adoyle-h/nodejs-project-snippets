'use strict';

var urlencode = require('urlencode');
var forge = require('node-forge');

var Encode = {
    encodeUrl: urlencode,
    decodeUrl: urlencode.decode,
    encodeBase64: forge.util.encode64,
    decodeBase64: forge.util.decode64,
    encodeUtf8: forge.util.encodeUtf8,
    decodeUtf8: forge.util.decodeUtf8,
    hexToBytes: forge.util.hexToBytes,
    bytesToHex: forge.util.bytesToHex,
};

module.exports = Encode;
