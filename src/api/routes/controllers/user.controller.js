const express = require('express');
const User = require('../../models/user');
const customErrorResponse = require('../../../utils/error.util');
const { check } = require('express-validator');
// middlewares
const { checkErrors } = require('../../../../middlewares/checkErrors');
const { validateJWT } = require('../../../../middlewares/validateJWT');
// helpers
const { passwordHash } = require('../../../../helpers/passwordHash');
const { userExists } = require('../../../../helpers/dbValidator');

class UserController {

    #router = new express.Router(); 
    #basePath = '/users';

    #postMiddlewares = [
        check('name', 'Name field is required!').not().isEmpty(),
        check('email', 'The email is not valid').isEmail(),
        check('pw', 'The password is required. Min length 5').isLength({ min: 5 }),
        checkErrors
    ];
    #putMiddlewares = [
        check('id', 'Invalid id.').isMongoId(),
        check('id').custom( userExists ),
        checkErrors
    ];
    #deleteMiddlewares = [
        validateJWT,
        check('id', 'Invalid id.').isMongoId(),
        check('id').custom( userExists ),
        checkErrors
    ];

    registerRoutes() {
        this.#router.get( this.#basePath, this.__getUsers );
        this.#router.post( this.#basePath, this.#postMiddlewares, this.__createUser );
        this.#router.put( this.#basePath, this.#putMiddlewares, this.__updateUser );
        this.#router.delete( this.#basePath, this.#deleteMiddlewares, this.__deleteUser );

        return this.#router;
    }

    __createUser = async( req, res ) => {

        const { name, email, pw } = req.body
        
        try {
            // CHECK IF THE EMAIL IS ALREADY IN USE
            const EXIST_EMAIL = await User.findOne({ email: email });
            if( EXIST_EMAIL ) return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', 'Email already in use.') );

            const user = new User({
                name: name,
                email: email,
                password: passwordHash( pw )
            });
        
            await user.save();

            res.status(201).json({
                message: `The user with email ${ user.email } was created successfully!`
            });
        } catch (error) {
            return res.status(400).json( customErrorResponse('40000', 'BAD_REQUEST', 'There was a problem saving the user.') );
        }
    }

    __updateUser = async( req, res ) => {
        
        const { password, id, ...user } = req.body;

        if( password ) user.password = passwordHash( password );
        
        try {
            const userUpdated = await User.findByIdAndUpdate( id, user );
            res.json( { message: 'User updated successfully!'} );
        } catch (error) {
            return res.status(404).json( customErrorResponse('40400', 'NOT_FOUND', 'There was a problem updating the user.') );
        }
    }

    __getUsers = async( req, res ) => {

        const { limit = 5, from = 0 } = req.query;

        const query = { status: true};

        try {
            const [ users, total ] = await Promise.all([
                User.find( query ).limit( parseInt(limit) ).skip( parseInt(from) ),
                User.countDocuments( query )
            ]);

            let usersRes = new Array();
    
            for( let user of users ) {
                usersRes.push({
                    name: user.name,
                    email: user.email
                })
            }
    
            res.json({ 
                total,
                users: usersRes 
            });

        } catch (error) {
            return res.status(400).json( customErrorResponse('40003', 'BAD_REQUEST', 'There was a problem to fetch the data of the users.'))
        }
    }

    __deleteUser = async( req, res ) => {
        const { id } = req.query;
        
        try {
            const user = await User.findByIdAndUpdate(id, {status: false});
            res.json({
                message: `User ${ id } was removed successfully!`,
                userLogged: req.user
            });
        } catch (error) {
            res.status().json( customErrorResponse('40400', 'NOT_FOUND', 'There was a problem removing the user from the database.') );
        }

    }
}

module.exports = UserController;
