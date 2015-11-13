'use strict';

var winston = require('winston');

var util = include('lib/util');
var Transport = winston.Transport;

var colors;
var levels;

function Console(opts) {
    var self = this;

    opts = util.defaults({}, opts, {
        level: 'info',
        colorize: true,
        timestamp: true,
    });

    Transport.call(self, opts);
    self.opts = opts;
    colors = opts.colors;
    levels = opts.levels;
}
util.inherits(Console, Transport);

Console.prototype.name = 'Console';

Console.prototype.log = function(level, msg, meta, callback) {
    var self = this;
    var output;

    var args = [level, msg];
    var format = '[%s] %s';
    var errorStack;

    if (meta) {
        format = format + ' with meta: %s';
        errorStack = meta.errorStack;
        if (errorStack) meta = util.omit(meta, 'errorStack');
        args.push(JSON.stringify(meta, null, 4));
    }

    if (self.opts.timestamp) {
        format = '[%s] ' + format;
        var d = new Date();
        var localeTimeString = util.sprintf(
            '%d-%02d-%02d %02d:%02d:%02d.%03d',
            d.getFullYear(), d.getMonth() + 1, d.getDate(),
            d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()
        );
        args.unshift(localeTimeString);
    }

    if (self.opts.colorize) {
        format = util.colors[colors[level]](format);
    }

    output = util.vsprintf(format, args);

    if (levels[level] > levels.warn) {
        process.stderr.write(output + '\n');
    } else {
        process.stdout.write(output + '\n');
    }

    if (errorStack) {
        errorStack = util.colors[colors[level]]('with ErrorStack: ' + errorStack);
        process.stderr.write(errorStack + '\n');
    }

    // // Emit the `logged` event immediately because the event loop
    // // will not exit until `process.stdout` has drained anyway.
    // self.emit('logged');
    callback(null, true);
};

module.exports = Console;
