const express = require('express');
const { check } = require('express-validator');
const { checkErrors } = require('../../../middlewares/check-errors');
const { validateJWT } = require('../../../middlewares/validate-jwt');
const { login, googleSignIn, renewJWT } = require('./controllers/auth.controller');

class AuthRoute {

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
        this.#router.post( this.#basePath + '/login', this.#loginMiddlewares, login );
        this.#router.post( this.#basePath + '/google', this.#googleMiddlewares, googleSignIn );
        this.#router.get( this.#basePath + '/token', validateJWT, renewJWT );

        return this.#router;
    }
}

module.exports = AuthRoute;