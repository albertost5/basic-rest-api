const express = require('express');
require('dotenv').config();

class CategoryController {

    #router = new express.Router();
    #basePath = '/categories';
    
    registerRoutes() {
        this.#router.get( this.#basePath, this.__getCategories );
        this.#router.get( this.#basePath + '/:id', this.__getCategoryById );
        this.#router.post( this.#basePath, this.__createCategory );
        this.#router.put( this.#basePath + '/:id', this.__updateCategory );
        this.#router.delete( this.#basePath + '/:id', this.__deleteCategory );

        return this.#router;
    }

    __getCategories = ( req, res ) => {
        res.json('GET ALL CATEGORIES');
    }

    __getCategoryById = ( req, res ) => {
        res.json({
            id: req.params.id
        });
    }
    
    __createCategory = ( req, res ) => {
        res.json(
           req.body
        )
    }

    __updateCategory = ( req, res ) => {
        res.json({
            id: req.params.id,
            body: req.body
        })
    }

    __deleteCategory = ( req, res ) => {
        res.json({
            message: `Deteled category with id ${req.params.id}..`
        })
    }
}

module.exports = CategoryController;