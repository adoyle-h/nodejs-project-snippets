'use strict';

var Errors = require('ero');

// define an error template
var errorTemplate = {
    code: '响应体中的服务器的错误码',
    message: '用于服务端打印的默认错误信息（如果 new Error 时未填 message）',
    businessMessage: {
        message: '用于返回给客户端的错误信息',
        required: false,
        default: null,
    },
    captureErrorStack: {
        message: '是否捕捉错误堆栈',
        required: false,
        default: true,
    },
    statusCode: {
        message: '响应头中的状态码',
        required: false,
        default: 200,
    },
    log: {
        message: '是否打印错误',
        required: false,
        default: false,  // 因为大部分是业务逻辑上的错误，不需要打印出来
    },
    logLevel: {
        message: '打印日志时所用 logger 的级别',
        required: false,
        default: 'error',
    },
};


// define a set of error definitions
var definitions = {
    Error: {
        name: 'Error',
        code: 'G000',
        message: '服务器发生了可预判的错误',
        businessMessage: '服务器发了会呆',
        log: true,
        captureErrorStack: true,
    },
    Exception: {
        code: 'G001',
        message: '服务器发生了不可预料的错误',
        businessMessage: '服务器发了会呆',
        log: true,
        captureErrorStack: true,
    },
    ValidationError: {
        code: 'G099',
        message: '路由参数格式不正确',
    },
    // 当需要人为地故意抛出一个错误，只返回给客户端，不需要在服务端记录错误时
    // 使用 Reject
    Reject: {
        code: 'G100',
        message: '请求拒绝，非正常的请求逻辑',
    },
    NotFoundError: {
        code: 'G101',
        message: 'URL 未找到',
        businessMessage: '请求失败，未找到目标地址',
        statusCode: 404,
    },
    UploadError: {
        code: 'G102',
        message: '上传失败',
        businessMessage: '上传失败，重新试试',
        log: true,
    },
    ServiceError: {
        code: 'G103',
        message: '子服务异常',
        log: true,
        captureErrorStack: true,
    },
    LoginError: {
        code: 'G104',
        message: '密码错误',
    },
    UserNotFoundError: {
        code: 'G105',
        message: '用户不存在',
        log: true,
        logLevel: 'warn',
    },
    CaptchaError: {
        code: 'G106',
        message: '验证码错误',
    },
    PrivilegeError: {
        code: 'G107',
        message: '没有权限访问该资源',
    },
    ResourceNotFoundError: {
        code: 'G108',
        message: '资源未找到',
        log: true,
        logLevel: 'warn',
    },
};


// initialize the ero library
Errors.init({
    template: errorTemplate,
    definitions: definitions,
});

// export the Errors
module.exports = Errors;
