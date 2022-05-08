const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateJWT = ( userId ) => {

    return new Promise(( resolve, reject ) => {
        
        jwt.sign( { id: userId }, process.env.SECRET , { algorithm: 'HS512' }, function(err, token) {
            if ( err ) {
                console.log('jwtError: ', err);
                reject('There was a problem generating the JWT');
            } else {
                resolve( token );
            }
        });
        
    });
}

module.exports = {
    generateJWT
};