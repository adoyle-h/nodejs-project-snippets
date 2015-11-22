'use strict';

var async = require('async');
var cProcess = require('child_process');

var DEBUG = false;

function debug(name, obj) {
    if (DEBUG) {
        console.log('===== ' + name + ' =====');
        console.log(obj);
        console.log('======' + Array.prototype.join.call({length: name.length+1}, '=') + '======');
    }
}

// 将本地数据同步成公共测试环境的数据
function syncData(callback) {
    async.waterfall([
        function(next) {
            cache.flush(function(err) {
                next(err);
            });
        },
        function(next) {
            async.parallel([
                // mysql 只导出部分表
                async.apply(copyMysqlRemote2local, {
                    tables: exportTables
                }),
                async.apply(copyRedisRemote2local),
                async.apply(backupLocalRedis)
            ], function(err) {
                next(err);
            });
        },
        function(next) {
            async.parallel([
                async.apply(recoverLocalMysql),
                async.apply(recoverRedis, remoteRedisCommands)
            ], function(err) {
                next(err);
            });
        }
    ], callback);
}



/**
 * 备份公共 TEST 数据库的数据(sql)到本地
 */
function copyMysqlRemote2local(opts, callback) {
    if (arguments.length === 1) {
        callback = opts;
        opts = {};
    }

    opts = util.defaults(opts, {
        host: config.mysql_faker.host || 'localhost',
        port: config.mysql_faker.port,
        user: config.mysql_faker.user,
        password: config.mysql_faker.password,
        database: config.mysql_faker.database,
        savePath: '/tmp/test_mysql_backup.sql',
        tables: []
    });

    var command = 'mysqldump'  +
        ' -h ' + opts.host     +
        ' -P ' + opts.port     +
        ' -u'  + opts.user     +
        ' -p'  + opts.password +
        ' -l ' +
        opts.database +
        ' '    + opts.tables.join(' ') +
        ' > '  + opts.savePath;

    if (DEBUG) {
        console.time('copyMysqlRemote2local');
    }
    debug('copyMysqlRemote2local:command', command);
    cProcess.exec(command, function(err) {
        if (DEBUG) console.timeEnd('copyMysqlRemote2local');
        callback(err);
    });
}

function recoverLocalMysql(opts, callback) {
    if (arguments.length === 1) {
        callback = opts;
        opts = {};
    }

    opts = util.defaults(opts, {
        host: config.mysql.host || 'localhost',
        port: config.mysql.port,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        savePath: '/tmp/test_mysql_backup.sql',
    });

    var command = 'mysql'         +
        ' -h ' + opts.host        +
        ' -P ' + opts.port        +
        ' -u'  + opts.user        +
        ' -p'  + opts.password    +
        ' -D ' + opts.database +
        ' < '  + opts.savePath;

    if (DEBUG) {
        console.time('recoverLocalMysql');
    }
    debug('recoverLocalMysql:command', command);
    cProcess.exec(command, function(err) {
        if (DEBUG) console.timeEnd('recoverLocalMysql');
        callback(err);
    });
}

function copyRedisRemote2local(callback) {
    var opts = {
        host: config.redis_faker.host || 'localhost',
        port: config.redis_faker.port,
        filter: '*',
    };

    backupRedis(opts, function(err, commands){
        if (err) return callback(err);
        remoteRedisCommands = commands;
        callback();
    });
}

function backupLocalRedis(callback) {
    backupRedis(function(err, commands) {
        if (err) return callback(err);
        localRedisCommands = commands;
        callback();
    });
}

/**
 * 备份 redis 的数据
 *
 * @param  {Object}   [opts]
 * @param  {String}   [opts.host]    默认为 'loacalhost'
 * @param  {Number}   [opts.port]    默认为 6379
 * @param  {String}   [opts.filter]  Query filter， 默认为 '*'
 *                                   see https://github.com/jeremyfa/node-redis-dump
 * @param  {Function} callback       callback(err, commands)
 *                                   commands 为备份的数据(操作)，是数组。
 * @method backupRedis
 */
function backupRedis(opts, callback) {
    if (arguments.length === 1) {
        callback = opts;
        opts = {};
    }

    opts = util.defaults(opts, {
        host: 'localhost',
        port: 6379,
        filter: '*'
    });

    redisDump({
        filter: opts.filter,
        port: opts.port,
        host: opts.host
    }, function(err, result){
        if (err) return callback(err);
        debug('backupRedis:result', result);

        var commands = result.split('\n');
        var command;
        for (var i = commands.length - 1; i >= 0; i--) {
            command = commands[i];
            commands[i] = command.split(/ +/);
        }
        callback(null, commands);
    });
}

/**
 * 恢复 redis 数据
 *
 * @param  {Array.<Array.<String>>}  commands  like [['set', 'str']]
 * @param  {Object}             [opts]
 * @param  {String}             [opts.host]  默认为 'localhost'
 * @param  {Number}             [opts.port]  默认为 6379
 * @param  {Function} callback  callback(err)
 * @method recoverRedis
 */
function recoverRedis(commands, opts, callback) {
    if (arguments.length === 2) {
        callback = opts;
        opts = {};
    }

    opts = util.defaults(opts, {
        host: 'localhost',
        port: 6379,
    });

    if (!redis) redis = require(TEST_ROOT + 'lib/redis').connect(opts.port, opts.host);
    debug('recoverRedis:commands', commands);
    redis.flushdb();

    if (commands[0][0] === '') return callback();
    redis.multi(commands).exec(function(err) {
        callback(err);
    });
}

exports.before = function(done) {
    syncData(done);
};

exports.after = function(done) {
    async.parallel([
        async.apply(recoverRedis, localRedisCommands),
    ], done);
};
