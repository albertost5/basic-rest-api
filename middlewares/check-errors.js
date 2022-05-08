const { validationResult } = require("express-validator");
const customErrorResponse = require("../src/utils/error.util");


const checkErrors = ( req, res, next ) => {
    // REQ.BODY VALIDATION
    const errors = validationResult( req );
    
    if ( !errors.isEmpty() ) {
        // console.log('Errs: ', errors.errors);

        let messages = []; 
        errors.errors.forEach( err => {
            messages.push( err.msg );
        });
        return res.status(400).json( customErrorResponse( '40002', 'BAD_REQUEST', messages.toString() ));
    }
    
    next();
}

module.exports = { checkErrors };