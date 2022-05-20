const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../src/api/models/user');
const { customErrorResponse } = require('../src/utils/error.util');
const { checkUserStatus } = require('../helpers/checks');

const validateJWT = async(req, res, next) => {

    const token = req.headers['x-token'];

    if( !token ) {
        
        return res.status(401).json( customErrorResponse('40000', 'BAD_REQUEST', 'Empty token value.' ) );
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRET );

        try {
            const user = await User.findById( uid ).exec(); 

            if( !user ) return res.status(404).json( customErrorResponse('40401', 'NOT_FOUND', 'User not found.') );
            
            checkUserStatus( user );

            req.user = user;

            next();
        } catch (error) {
            if( error.code ) throw error;
            return res.status(404).json( customErrorResponse('40400', 'NOT_FOUND', 'User not found.') );
        }
        
    } catch (error) {
        if(error.code) {
            const statusCode = parseInt( error.code.slice(0,3) );
            return res.status( statusCode ).json( error );
        }
        return res.status(401).json( customErrorResponse('40100', 'UNAUTHORIZED', 'Invalid token.') );
    }
}

module.exports = {
    validateJWT
}