const express = require('express');
const User = require('../../models/user');
const customErrorResponse = require('../../../utils/error.util');
const bcrypt = require('bcrypt');
const { check } = require('express-validator');
const { bodyValidation } = require('../../../../middlewares/bodyValidation');


class UserController {

    #router = new express.Router(); 
    #middlewares = [
        check('name', 'Name field is required!').not().isEmpty(),
        check('email', 'The email is not valid').isEmail(),
        check('pw', 'The password is required. Ming length: 5.').isLength({ min: 5 }),
        bodyValidation
    ];

    registerRoutes() {
        this.#router.post('/users', this.#middlewares, this.__createUser);
        this.#router.put('/users', this.__updateUser);

        return this.#router;
    }

    __createUser = async ( req, res ) => {

        const { name, email, pw } = req.body
        const saltRounds = 10;
        
        try {
            // CHECK IF THE EMAIL IS ALREADY IN USE
            const EXIST_EMAIL = await User.findOne({ email: email });
            if( EXIST_EMAIL ) return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', 'Email already in use.') );

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
            return res.status(400).json( customErrorResponse('40000', 'BAD_REQUEST', 'There was a problem saving the user.') );
        }
    }

    __updateUser = async ( req, res ) => {
        res.json({ data: 'Hello world!' });
    }
}

module.exports = UserController;
