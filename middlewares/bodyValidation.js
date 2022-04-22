const { validationResult } = require("express-validator");
const customErrorResponse = require("../src/utils/error.util");


const bodyValidation = ( req, res, next ) => {
    // REQ.BODY VALIDATION
    const errors = validationResult( req );
    console.log('errorsArr => ', errors.errors);
    if ( !errors.isEmpty() ) {
        return res.status(400).json( customErrorResponse('40002', 'BAD_REQUEST', errors.array()[0].msg) );
    }
    
    next();
}

module.exports = { bodyValidation };