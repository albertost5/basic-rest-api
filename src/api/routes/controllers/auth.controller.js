const express = require('express');
const { check } = require('express-validator');
const { checkErrors } = require('../../../../middlewares/checkErrors');
const customErrorResponse = require('../../../utils/error.util');
const User = require("../../models/user");
const { comparePasswordHash } = require("../../../../helpers/passwordHash");
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthController {

    #router = new express.Router();
    #basePath = '/auth';
    
    #loginMiddlewares = [
        check('email', 'Invalid email').isEmail(),
        check('pw', 'Invalid password').notEmpty(),
        checkErrors
    ]
    
    registerRoutes() {
        this.#router.post( this.#basePath + '/login', this.#loginMiddlewares, this.__login );

        return this.#router;
    }

    __login = async( req, res ) => {

        const { email, pw } = req.body;

        try {
            const user = await User.findOne({ email: email });

            if ( !user ) return res.status(400).json( customErrorResponse('40401', 'NOT_FOUND', 'User not found.') );

            if ( user.status ) {

                if ( comparePasswordHash( pw, user.password ) ) {
                    const token = jwt.sign( req.body, process.env.SECRET, { algorithm: 'HS512', expiresIn: '1h' });
                    
                    return res.json({ token });
                } else {
                    return res.status(404).json( customErrorResponse('40000', 'BAD_REQUEST', 'Incorrect password.') );
                }
                
            } else {
                return res.status(404).json( customErrorResponse('40400', 'NOT_FOUND', 'User inactive.') );
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Something went wrong!'
            });
        }

        res.json({
            email,
            pw,
            message: 'User logged successfully!'
        });
    }
 
}

module.exports = AuthController;