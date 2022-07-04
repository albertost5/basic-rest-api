const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../src/api/models/user');

const generateJWT = ( userId ) => {

    return new Promise(( resolve, reject ) => {
        
        jwt.sign( { uid: userId }, process.env.SECRET , { algorithm: 'HS512' }, function(err, token) {
            if ( err ) {
                console.log('jwtError: ', err);
                reject('There was a problem generating the JWT');
            } else {
                resolve( token );
            }
        });
        
    });
}

const checkJWT = async( token ) => {
    try {
        if ( token.length < 10 ) {
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRET )
        
        try {
            const user = await User.findById( uid ).exec();
            
            if( user && user.status ) {
                return user;
            } else {
                return null;
            }

        } catch (error) {
            return null;
        }
    } catch (error) {
        return null;
    }
}

module.exports = {
    generateJWT,
    checkJWT
};