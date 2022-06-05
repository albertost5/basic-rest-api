const express = require('express');
const { check } = require('express-validator');
const { checkCollections } = require('../../../helpers/checks');
const { checkErrors } = require('../../../middlewares/check-errors');
const { findBy } = require('./controllers/find.controller');

class FindRoute {
    #router = new express.Router();
    #basePath = '/find';
    
    #getMiddleware = [
        check('collection').custom( c => checkCollections( c, undefined ) ),
        checkErrors
    ]

    registerRoutes() {
        this.#router.get( this.#basePath + '/:collection/:term', this.#getMiddleware, findBy ); 

        return this.#router;
    }
}


module.exports = FindRoute;