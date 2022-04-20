const express = require('express');
const User = require('../../models/user');
const customErrorResponse = require('../../../utils/error.util');


class UserController {

    #router = new express.Router(); 

    registerRoutes() {
        this.#router.post('/users', this.__createUser);
        return this.#router;
    }

    __createUser = async (req, res) => {
        
        const user = new User( req.body );

        if( Object.keys(req.body).length > 0 ) {

            try {
                await user.save();
            } catch (error) {
                return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', 'There was a problem saving the user.') );
            }

            res.json( user );
        } else {
            res.status(400).json( customErrorResponse('40000', 'BAD_REQUEST', 'Bad request, incorrect data.') );
        }
    }
}

module.exports = UserController;
