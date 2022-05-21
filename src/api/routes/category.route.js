const express = require('express');
const { check } = require('express-validator');
const { checkErrors } = require('../../../middlewares/check-errors');
const { validateJWT } = require('../../../middlewares/validate-jwt');
const { categoryExists } = require('../../../helpers/db-validator');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('./controllers/category.controller');
class CategoryRoute {

    #router = new express.Router();
    #basePath = '/categories';

    #getMiddlewares = [
        check('id', 'Invalid id.').isMongoId(),
        check('id').custom( categoryExists ),
        checkErrors
    ];
    #postMiddlewares = [
        validateJWT,
        check('name', 'Name field is required!').not().isEmpty(),
        checkErrors
    ];
    #putMiddlewares = [
        validateJWT,
        check('id', 'Invalid id.').isMongoId(),
        check('name', 'Name field is required!').not().isEmpty(),
        check('id').custom( categoryExists ),
        checkErrors
    ];
    #deleteMiddlewares = [
        validateJWT,
        check('id', 'Invalid id.').isMongoId(),
        check('id').custom( categoryExists ),
        checkErrors
    ];
    
    registerRoutes() {
        this.#router.get( this.#basePath, getCategories );
        this.#router.get( this.#basePath + '/:id', this.#getMiddlewares, getCategoryById );
        this.#router.post( this.#basePath, this.#postMiddlewares, createCategory );
        this.#router.put( this.#basePath + '/:id', this.#putMiddlewares, updateCategory );
        this.#router.delete( this.#basePath + '/:id', this.#deleteMiddlewares, deleteCategory );

        return this.#router;
    }
}

module.exports = CategoryRoute;