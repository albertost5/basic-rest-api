const express = require('express');
const { check } = require('express-validator');
const { checkErrors } = require('../../../../middlewares/check-errors');
const { customErrorResponse } = require('../../../utils/error.util');
const User = require('../../models/user');
const { comparePasswordHash } = require('../../../../helpers/password-hash');
const { generateJWT } = require('../../../../helpers/generate-jwt');
const { checkUserStatus } = require('../../../../helpers/checks');
const { googleVerify } = require('../../../../helpers/google-verify');
require('dotenv').config();

class AuthController {

    #router = new express.Router();
    #basePath = '/auth';
    
    #loginMiddlewares = [
        check('email', 'Invalid email').isEmail(),
        check('pw', 'Invalid password').notEmpty(),
        checkErrors
    ]

    #googleMiddlewares = [
        check('google_token', 'Google token could not be empty').notEmpty(),
        checkErrors
    ]
    
    registerRoutes() {
        this.#router.post( this.#basePath + '/login', this.#loginMiddlewares, this.__login );
        this.#router.post( this.#basePath + '/google', this.#googleMiddlewares, this.__googleSignIn );
        return this.#router;
    }

    __login = async( req, res ) => {

        const { email, pw } = req.body;

        try {
            const user = await User.findOne({ email: email });

            if ( !user ) return res.status(400).json( customErrorResponse('40401', 'NOT_FOUND', 'User not found.') );

            checkUserStatus( user );

            if ( comparePasswordHash( pw, user.password ) ) {
                const JWT = await generateJWT( user.id );

                return res.json({
                    user,
                    token: JWT
                });
            } else {
                return res.status(404).json( customErrorResponse('40001', 'BAD_REQUEST', 'Incorrect password.') );
            }
            
        } catch (error) {
            if(error.code) {
                const statusCode = parseInt( error.code.slice(0,3) );
                return res.status( statusCode ).json( error );
            }
            return res.status(500).json({
                error: 'Something went wrong!'
            });
        }
    }

    __googleSignIn = async( req, res ) => {
        const { google_token } = req.body;

        try {
            const { name, email, picture } = await googleVerify( google_token );

            let user = await User.findOne({ email }).exec();
            
            if( !user ) {
                const DATA_FROM_GOOGLE = {
                    name: name,
                    email: email,
                    password: 'signedWithGoogle',
                    img: picture,
                    google: true
                }
                
                user = new User( DATA_FROM_GOOGLE );
                try {
                    await user.save();
                    res.json( 
                        user
                    );
                } catch (error) {
                    console.log('user save error => ', error);
                    return res.status(400).json( 
                        customErrorResponse('40001', 'BAD_REQUEST', 'There was a problem to create the user using google sign-in.')
                    );
                }
            } else if ( user.status === false ) {
                return res.status(400).json(
                    customErrorResponse('40100', 'UNAUTHORIZED', 'The user is inactive.')
                );
            } else {
                try {
                    const JWT = await generateJWT( user.id );
                    return res.json({
                        user,
                        token: JWT
                    });           
                } catch (error) {
                    return res.status(500).json(
                        customErrorResponse('50000', 'INTERNAL_SERVER_ERROR', 'Something went wrong generating the auth token.')
                    )
                }
            }

        } catch (error) {
            console.log('Google token error: ', error);
            return res.status(400).json(
                customErrorResponse('40000', 'BAD_REQUEST', 'There was a problem to validate the google token.')
            )
        }
    }
 
}

module.exports = AuthController;