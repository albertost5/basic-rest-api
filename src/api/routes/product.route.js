const express = require('express');
const { check } = require('express-validator');
const { categoryExists, productExists } = require('../../../helpers/db-validator');
const { checkErrors } = require('../../../middlewares/check-errors');
const { validateJWT } = require('../../../middlewares/validate-jwt');
const { createProduct, getProducts, getProductById, updateProduct } = require('./controllers/product.controller');

class ProductRoute {
    #router = new express.Router();
    #basePath = '/products';
    
    #getMiddlewares = [
        check('id', 'Invalid id.').isMongoId(),
        check('id').custom( productExists ),
        checkErrors
    ];

    #postMiddlewares = [
        validateJWT,
        check('name', 'Invalid name').notEmpty(),
        check('category', 'Invalid id').isMongoId(),
        check('category', categoryExists),
        checkErrors
    ];

    #putMiddleware = [
        validateJWT,
        check('id', 'Invalid id').isMongoId(),
        check('id').custom( productExists ),
        checkErrors
    ];

    #deleteMiddleware = [

    ];
    
    registerRoutes() {
        this.#router.get( this.#basePath, getProducts); 
        this.#router.get( this.#basePath + '/:id', this.#getMiddlewares, getProductById );
        this.#router.post( this.#basePath, this.#postMiddlewares, createProduct );
        this.#router.put( this.#basePath + '/:id', this.#putMiddleware, updateProduct );
        this.#router.delete( this.#basePath + '/:id' );

        return this.#router;
    }
}


module.exports = ProductRoute;