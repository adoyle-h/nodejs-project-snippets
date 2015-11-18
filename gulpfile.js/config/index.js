'use strict';

var config = {
    root: {
        src: './src',
        dest: './public',
    },
    tasks: {
        watch: {

        },

        font: {

        },

        image: {

        },

        html: {

        },

        js: {
            src: 'javascripts',
            dest: 'javascripts',
            extractSharedJs: true,
            entries: {
                'app': ['./app.js'],
                'page': ['./page.js'],
            },
            extensions: ['js'],
        },

        css: {
            src: 'stylesheets',
            dest: 'stylesheets',
            autoprefixer: {
                'browsers': ['last 3 version'],
            },
            sass: {
                indentedSyntax: true,
            },
            extensions: ['sass', 'scss', 'css'],
        },

        images: {
            src: 'images',
            dest: 'images',
            extensions: ['jpg', 'png', 'svg', 'gif'],
        },

        fonts: {
            src: 'fonts',
            dest: 'fonts',
            extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg'],
        },

        iconFont: {
            src: 'icons',
            dest: 'fonts',
            sassDest: 'generated',
            extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg'],
        },
    },
};

module.exports = config;
