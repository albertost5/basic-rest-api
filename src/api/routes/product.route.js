const express = require('express');
const { check } = require('express-validator');
const { categoryExists } = require('../../../helpers/db-validator');
const { checkErrors } = require('../../../middlewares/check-errors');
const { validateJWT } = require('../../../middlewares/validate-jwt');
const { createProduct } = require('./controllers/product.controller');

class ProductRoute {
    #router = new express.Router();
    #basePath = '/products';
    
    #postMiddlewares = [
        validateJWT,
        check('name', 'Invalid name').notEmpty(),
        check('category', 'Invalid id').isMongoId(),
        check('category', categoryExists),
        checkErrors
    ]
    
    registerRoutes() {
        this.#router.get( this.#basePath ); 
        this.#router.get(  this.#basePath + '/:id');
        this.#router.post( this.#basePath, this.#postMiddlewares, createProduct );
        this.#router.put( this.#basePath + '/:id' );
        this.#router.delete( this.#basePath + '/:id' );

        return this.#router;
    }
}


module.exports = ProductRoute;