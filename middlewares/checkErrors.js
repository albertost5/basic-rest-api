const { validationResult } = require("express-validator");
const customErrorResponse = require("../src/utils/error.util");


const checkErrors = ( req, res, next ) => {
    // REQ.BODY VALIDATION
    const errors = validationResult( req );
    
    if ( !errors.isEmpty() ) {
        console.log('Errors array: ', errors.errors);
        return res.status(400).json( customErrorResponse('40002', 'BAD_REQUEST', errors.array()[0].msg) );
    }
    
    next();
}

module.exports = { checkErrors };