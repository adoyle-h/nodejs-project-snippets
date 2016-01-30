'use strict';

var common = {
    copyrightYear: '2015-2016',
    author: 'ADoyle',
};

/**
 * It will be better if you would comment every property to explain how it effects.
 *
 * Relative paths are relative to the directory where the process starts.
 */
var config = {
    generators: {
        license: {
            dest: 'LICENSE',
            year: common.copyrightYear,
            author: common.author,  // default author for all files
        },
    },
    tasks: {
        backup: {
            log: {
                src: 'logs/*',
                desc: 'backup/*',
            },
        },

        /**
         * clean task uses `sindresorhus/del`, whose glob rules are different from gulp's.
         * see https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
         */
        clean: {
            log: {
                src: ['./logs/**/*', '!./logs/.gitkeep'],
            },
        },

        release: {
            changelog: {
                name: 'ChangeLog.md',
            },
            license: {
                src: [
                    'src/**/*', 'index.js', 'package.json', 'README.md',
                    'LICENSE', 'NOTICE',
                    '!node_modules/**', '!node_modules',
                    '!**/*._*', '!**/.DS_Store',
                ],
                srcOpts: {
                    base: './',
                },
                dest: './release',
                year: common.copyrightYear,
                author: common.author,  // default author for all files
                license: 'Apache',  // default license for all files
                matches: [{  // it could be empty array if you do not need specify files with other license
                    glob: ['**/*.js'],
                    license: 'Apache',  // override the default license
                    // author: 'Belly',  // override the default author
                }],
            },
            npm: {
                src: './release',
                dest: './release',
            },
            'git-tag': {
                dest: 'master',  // branch name or commit hash
            },
        },

        lint: {
            src: [
                '**/*.js',
                '!node_modules/**',
                '!release/**',
                '!doc/**',
                '!gh-pages/**',
            ],
            // see https://github.com/adametry/gulp-eslint#eslintoptions
            eslintOptions: {
                quiet: true,
            },
        },

        server: {
            // the entry point of application
            main: 'index.js',
            // nodemon ignore files
            ignore: [
                'node_modules/*', 'bower_components/*', 'assets/*', 'bin/*', 'doc/*', 'logs/*',
                'scripts/*', 'temp/*', 'test/*', 'gulpfile.js',
            ],
            env: {
                NODE_ENV: 'development',
            },
        },

        watch: {
        },

        test: {
            mochaRunner: '../../test/index',
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
                app: ['./app.js'],
                page: ['./page.js'],
            },
            extensions: ['js'],
        },

        css: {
            src: 'stylesheets',
            dest: 'stylesheets',
            autoprefixer: {
                browsers: ['last 3 version'],
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
