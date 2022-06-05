const { customErrorResponse } = require("../src/utils/error.util");

const checkFile = ( req, res, next ) => {
    if ( !req.files || !req.files?.file || Object.keys(req.files).length === 0 ) {
        return res.status(400).json( customErrorResponse('40000', 'BAD_REQUEST', 'No files were uploaded.') );
    }

    next();
}

module.exports = {
    checkFile
}