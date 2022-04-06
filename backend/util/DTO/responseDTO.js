module.exports = function response(statusCode, data = null, message = null) {
    return {
        status: statusCode,
        data,
        message,
    }
}