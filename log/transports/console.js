'use strict';

var Path = require('path');
var winston = require('winston');
var PrettyError = require('pretty-error');
var vsprintf = require('sprintf-js').vsprintf;
var sprintf = require('sprintf-js').sprintf;
var util = require('lodash');
var utilColors = require('cli-color');
var nodeUtil = require('util');

var pe = new PrettyError();

var PROJECT_ROOT = process.cwd();
pe.alias(PROJECT_ROOT, '(Project_Root)');
pe.alias(PROJECT_ROOT + Path.sep + 'node_modules', '(Node_Modules)');

pe.appendStyle({
    // this is a simple selector to the element that says 'Error'
    'pretty-error > header > title > kind': {
        // which we can hide:
        display: 'none',
    },

    // the 'colon' after 'Error':
    'pretty-error > header > colon': {
        // we hide that too:
        display: 'none',
    },

    // our error message
    'pretty-error > header > message': {
        // let's change its color:
        color: 'bright-white',

        // we can use black, red, green, yellow, blue, magenta, cyan, white,
        // grey, bright-red, bright-green, bright-yellow, bright-blue,
        // bright-magenta, bright-cyan, and bright-white

        // we can also change the background color:
        background: 'bright-red',

        // it understands paddings too!
        padding: '0 1', // top/bottom left/right
    },

    // each trace item ...
    'pretty-error > trace > item': {
        // ... can have a margin ...
        marginLeft: 2,

        // ... and a bullet character!
        bullet: '"<grey>o</grey>"',

        // Notes on bullets:
        //
        // The string inside the quotation mark will be used for bullets.
        //
        // You can set its color/background color using tags.
        //
        // This example sets the background color to white, and the text color
        // to cyan, the character will be a hyphen with a space character
        // on each side:
        // example: '"<bg-white><cyan> - </cyan></bg-white>"'
        //
        // Note that we should use a margin of 3, since the bullet will be
        // 3 characters long.
    },

    'pretty-error > trace > item > header > pointer > file': {
        color: 'bright-red',
    },

    'pretty-error > trace > item > header > pointer > colon': {
        color: 'red',
    },

    'pretty-error > trace > item > header > pointer > line': {
        color: 'bright-red',
    },

    'pretty-error > trace > item > header > what': {
        color: 'bright-white',
    },

    'pretty-error > trace > item > footer > addr': {
        display: 'none',
    },
});

var Transport = winston.Transport;

function Console(opts) {
    var self = this;

    opts = util.defaults({}, opts, {
        level: 'info',
        colorize: true,
        timestamp: true,
        stderrLevel: 'warn',
        colors: [],
        levels: [],
    });

    Transport.call(self, opts);

    util.extend(self, opts);
}
nodeUtil.inherits(Console, Transport);

Console.prototype.name = 'Console';

function prettyErrorStack(error) {
    return pe.render(error);
}

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
            errorStack = prettyErrorStack({
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
