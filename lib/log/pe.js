'use strict';

var Path = require('path');
var PrettyError = require('pretty-error');

/**
 * @param  {Object}  params
 * @param  {String}  params.projectDir  The root path of this project
 * @param  {String}  params.themeColor  Optional value: 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'
 * @param  {Boolean}  [params.colorize=true]  whether output colorfully in terminal
 * @return {Object}  pe
 * @function createPE(params)
 */
function createPE(params) {
    var projectDir = params.projectDir;
    var themeColor = params.themeColor;
    var colorize = (params.colorize !== undefined) ? params.colorize : true;

    var pe = new PrettyError();

    pe.alias(projectDir, '(Project_Dir)/');
    pe.alias(projectDir + Path.sep + 'node_modules', '(Node_Modules)/');

    if (colorize) {
        // Color: we can use black, red, green, yellow, blue, magenta, cyan,
        // white, grey, bright-red, bright-green, bright-yellow, bright-blue,
        // bright-magenta, bright-cyan, bright-white
        pe.appendStyle({
            // this is a simple selector to the element that says 'Error'
            'pretty-error > header > title > kind': {
                display: 'none',
            },

            // the 'colon' after 'Error':
            'pretty-error > header > colon': {
                display: 'none',
            },

            // our error message
            'pretty-error > header > message': {
                display: 'none',
            },

            'pretty-error > trace': {
                marginTop: 0,
            },

            // each trace item ...
            'pretty-error > trace > item': {
                marginBottom: 0,
                marginLeft: 2,

                bullet: '"<grey>o</grey>"',
            },

            'pretty-error > trace > item > header > pointer > file': {
                color: 'bright-' + themeColor,
            },

            'pretty-error > trace > item > header > pointer > colon': {
                color: themeColor,
            },

            'pretty-error > trace > item > header > pointer > line': {
                color: 'bright-' + themeColor,
            },

            'pretty-error > trace > item > header > what': {
                color: 'bright-white',
            },

            'pretty-error > trace > item > footer > addr': {
                color: 'grey',
            },
        });
    } else {
        pe.withoutColors();
    }

    return pe;
}

exports.createPE = createPE;
