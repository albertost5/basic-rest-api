const { validationResult } = require("express-validator");
const { customErrorResponse } = require("../src/utils/error.util");


const checkErrors = ( req, res, next ) => {
    // REQ.BODY VALIDATION
    const errors = validationResult( req );
 
    if ( !errors.isEmpty() ) {
        const error = errors.errors[0];
        console.log('checkErrors => ', error);
        
        const message = error.msg?.code ? error.msg.message : error.msg;
        const status = error.msg?.code ? error.msg.code.substring(0, 3) : 400;
        const uniqueCode = error.msg?.code ? error.msg.code : '40000';

        return res.status(status).json( customErrorResponse( uniqueCode, 'BAD_REQUEST', message ));
    }
    
    next();
}

module.exports = { checkErrors };