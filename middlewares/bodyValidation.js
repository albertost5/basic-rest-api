const { validationResult } = require("express-validator");
const customErrorResponse = require("../src/utils/error.util");


const bodyValidation = ( req, res, next ) => {
    // REQ.BODY VALIDATION
    const errors = validationResult( req );

    if ( !errors.isEmpty() ) {
        return res.status(400).json( customErrorResponse('40002', 'BAD_REQUEST', errors.array()) );
    }
    
    next();
}

module.exports = { bodyValidation };