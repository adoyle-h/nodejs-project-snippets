'use strict';

var winston = require('winston');
var vsprintf = require('sprintf-js').vsprintf;
var sprintf = require('sprintf-js').sprintf;
var util = require('lodash');
var utilColors = require('cli-color');
var nodeUtil = require('util');

var Transport = winston.Transport;

/**
 * @param  {Object} opts
 * @param  {Object} [opts.level='info']
 * @param  {Object} [opts.colorize=true]
 * @param  {Object} [opts.timestamp=true]
 * @param  {String} [opts.stderrLevel='warn']
 * @param  {Object<String, Number>} opts.colors
 * @param  {Object<String, String>} opts.levels
 * @param  {Object} opts.pe  the instance of pretty-error
 * @method Console
 */
function Console(opts) {
    var self = this;

    opts = util.defaults({}, opts, {
        level: 'info',
        colorize: true,
        timestamp: true,
        stderrLevel: 'warn',
    });

    Transport.call(self, opts);

    util.extend(self, opts);
}
nodeUtil.inherits(Console, Transport);

Console.prototype.name = 'Pretty-Console';

Console.prototype.prettyErrorStack = function(error) {
    return this.pe.render(error);
};

Console.prototype.log = function(level, msg, meta, callback) {
    var self = this;
    var output;

    var args = [level, msg];
    var format = '[%s] %s';
    var errorStack;

    if (!util.isEmpty(meta)) {
        errorStack = meta.errorStack;
        if (errorStack) {
            meta = util.omit(meta, 'errorStack');
        }
        format = format + ' with meta: %s';
        meta = JSON.stringify(meta, null, 4);
        args.push(meta);

        if (errorStack) {
            errorStack = self.prettyErrorStack({
                message: msg,
                stack: errorStack,
            });
            format = format + '\nwith ErrorStack: %s';
            args.push(errorStack);
        }
    }

    if (self.timestamp) {
        format = '[%s] ' + format;
        var d = new Date();
        var localeTimeString = sprintf(
            '%d-%02d-%02d %02d:%02d:%02d.%03d',
            d.getFullYear(), d.getMonth() + 1, d.getDate(),
            d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()
        );
        args.unshift(localeTimeString);
    }

    if (self.colorize) {
        format = utilColors[self.colors[level]](format);
    }

    output = vsprintf(format, args);

    var levels = self.levels;
    if (levels[level] <= levels[self.stderrLevel]) {
        process.stderr.write(output + '\n');
    } else {
        process.stdout.write(output + '\n');
    }

    // Emit the `logged` event immediately because the event loop
    // will not exit until `process.stdout` has drained anyway.
    self.emit('logged');
    callback(null, true);
};

module.exports = Console;
