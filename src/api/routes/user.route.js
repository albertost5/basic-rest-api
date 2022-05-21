const express = require('express');
const { check } = require('express-validator');
// middlewares
const { checkErrors } = require('../../../middlewares/check-errors');
const { validateJWT } = require('../../../middlewares/validate-jwt');
// helpers
const { userExists } = require('../../../helpers/db-validator');
const { checkAdminRole } = require('../../../middlewares/check-admin');
const { createUser, getUsers, updateUser, deleteUser } = require('../routes/controllers/user.controller');

class UserRoute {

    #router = new express.Router(); 
    #basePath = '/users';

    #postMiddlewares = [
        check('name', 'Name field is required.').not().isEmpty(),
        check('email', 'The email is not valid.').isEmail(),
        check('pw', 'The password is required. Min length 5.').isLength({ min: 5 }),
        checkErrors
    ];
    #putMiddlewares = [
        check('id', 'Invalid id.').isMongoId(),
        check('id').custom( userExists ),
        checkErrors
    ];
    #deleteMiddlewares = [
        validateJWT,
        checkAdminRole,
        check('id', 'Invalid id.').isMongoId(),
        check('id').custom( userExists ),
        checkErrors
    ];

    registerRoutes() {
        this.#router.get( this.#basePath, getUsers );
        this.#router.post( this.#basePath, this.#postMiddlewares, createUser );
        this.#router.put( this.#basePath, this.#putMiddlewares, updateUser );
        this.#router.delete( this.#basePath, this.#deleteMiddlewares, deleteUser );

        return this.#router;
    }
}

module.exports = UserRoute;