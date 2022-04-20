const express = require('express');
const User = require('../../models/user');
const customErrorResponse = require('../../../utils/error.util');
const bcrypt = require('bcrypt');


class UserController {

    #router = new express.Router(); 

    registerRoutes() {
        this.#router.post('/users', this.__createUser);
        return this.#router;
    }

    __createUser = async (req, res) => {

        const { name, email, pw } = req.body

        
        if( name && email && pw ) {
            
            const saltRounds = 10;
            
            try {

                const user = new User({
                    name: name,
                    email: email,
                    password: bcrypt.hashSync(pw, saltRounds)
                });
            
                await user.save();

                res.status(201).json({
                    message: `The user with email ${ user.email } was created successfully!`
                });
            } catch (error) {
                return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', 'There was a problem saving the user.') );
            }

        } else {
            res.status(400).json( customErrorResponse('40000', 'BAD_REQUEST', 'Incorrect data.') );
        }
        
    }
}

module.exports = UserController;
