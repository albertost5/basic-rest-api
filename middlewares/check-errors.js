const { validationResult } = require("express-validator");
const { customErrorResponse } = require("../src/utils/error.util");


const checkErrors = ( req, res, next ) => {
    // REQ.BODY VALIDATION
    const errors = validationResult( req );
 
    if ( !errors.isEmpty() ) {
        const error = errors.errors[0];
        const message = error.msg?.code ? error.msg.message : error.msg;

        return res.status(400).json( customErrorResponse( '40000', 'BAD_REQUEST', message ));
    }
    
    next();
}

module.exports = { checkErrors };