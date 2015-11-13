'use strict';

module.exports = {
    gulp: {
    },
    logger: {
        log: {  // 某些位置的日志开关
            publicFiles: true,  // 是否记录访问 public 文件的日志
            database: {  // 数据库相关日志
                query: true, // 是否记录查询日志
                createTable: true, // 是否记录建表日志
            },
        },
        colorize: true,
        level: 'debug',  // 最低输出日志级别（控制所有日志输出的 level）
        files: {  // 指定对应日志文件保存路径，记录对应日志等级以上的日志。可用相对路径(相对于项目根目录)或者绝对路径。置为 null，则不生成对应日志文件
            // 日志等级由低到高排序如下：
            // 日志会记录当前级别以及其以上级别的日志输出，所以 debug 实际输出的是所有级别的日志。
            debug: './logs/all.log',
            info: null,
            warn: null,
            error: './logs/error.log',
            fatal: null,
        },
        fileOpts: {
            maxSize: '100MB',   // b\kb\mb\gb，大小写不敏感
            maxFiles: 10,    // 文件数量上限（Rotate 处理）
            tailable: true,
        },
    },
    tmpDir: 'upload',    // 如果你指定到项目目录下的其他路径，记得不要把临时文件提交到版本库
};
