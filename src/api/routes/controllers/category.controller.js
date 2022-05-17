const express = require('express');
const { checkErrors } = require('../../../../middlewares/check-errors');
const { validateJWT } = require('../../../../middlewares/validate-jwt');
const { check } = require('express-validator');
const customErrorResponse = require('../../../utils/error.util');
const Category = require('../../models/category');
require('dotenv').config();

class CategoryController {

    #router = new express.Router();
    #basePath = '/categories';

    #postMiddlewares = [
        validateJWT,
        check('name', 'Name field is required!').not().isEmpty(),
        checkErrors
    ]
    
    registerRoutes() {
        this.#router.get( this.#basePath, this.__getCategories );
        this.#router.get( this.#basePath + '/:id', this.__getCategoryById );
        this.#router.post( this.#basePath, this.#postMiddlewares, this.__createCategory );
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
    
    __createCategory = async( req, res ) => {
        // Category => name, status, user (userId)
        const USER_ID = req.user.id;
        const name = req.body.name.toUpperCase();

        try {

            const categoryDB = await Category.findOne({ name }).exec();

            if( categoryDB ) {
                if( !categoryDB.status ) {
                    return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', `The category ${ name } is inactive.`) );
                } else {
                    return res.status(400).json( customErrorResponse('40000', 'BAD_REQUEST', `The category ${ name } already exists.`) );
                }
            }

            try { 
    
                const category = await Category.create({
                    name: name,
                    user: USER_ID
                });
    
                return res.status(201).json({
                    id: category.id,
                    name: category.name,
                    status: category.status
                });
            } catch (error) {
                console.log('error create => ', error);
                return res.status(409).json( customErrorResponse('40900', 'CONFLICT', 'There was a problem creating the category.') );
            }
        } catch (error) {
            console.log('error findOne => ', error);
            return res.status(404).json( customErrorResponse('40400', 'NOT_FOUND', 'There was a finding the category.') );
        }
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