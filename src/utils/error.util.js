function customErrorResponse( code, title, message ) {
    return {
        code: code,
        title: title,
        message: message
    }
}

module.exports = customErrorResponse;