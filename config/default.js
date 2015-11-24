'use strict';

module.exports = {
    gulp: {
    },
    logger: {
        log: {  // 特定位置的日志开关
            publicFiles: true,  // 是否记录访问 public 文件的日志
            database: {  // 数据库相关日志
                query: true, // 是否记录查询日志
                createTable: true, // 是否记录建表日志
            },
        },
        colorize: true,  // 终端输出是否显示颜色
        level: 'debug',  // 最低输出日志级别（控制所有日志输出的 level）
        logDir: null,  // 日志保存目录，可以是相对路径（相对于当前进程所在路径），也可以是绝对路径。如果置为 null，则使用当前进程所在路径。
        files: {  // 日志文件保存路径。可用相对路径（相对于 logDir），或者绝对路径。如果置为 null，则不生成对应日志文件
            // 日志等级由低到高排序如下。日志会记录当前级别以及其以上级别的日志输出，所以 debug 级别实际输出的是所有级别的日志。
            debug: 'all.log',
            info: null,
            warn: null,
            error: 'error.log',
            fatal: null,
        },
        fileOpts: { // 日志文件选项
            maxSize: '100MB',   // b\kb\mb\gb，大小写不敏感
            maxFiles: 10,    // 文件数量上限（Rotate 处理）
            tailable: true,  // 如果为 true，最新的日志在编号最小的文件里。否则相反。
        },
    },
    tmpDir: 'upload',    // 如果你指定到项目目录下的其他路径，记得不要把临时文件提交到版本库
};
