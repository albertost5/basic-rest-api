const express = require('express');
const { check } = require('express-validator');
require('dotenv').config();

const Category = require('../../models/category');

const { checkErrors } = require('../../../../middlewares/check-errors');
const { validateJWT } = require('../../../../middlewares/validate-jwt');
const { checkCategoryExists } = require('../../../../middlewares/check-category');

const customErrorResponse = require('../../../utils/error.util');
const { allowed } = require('../../../../helpers/check-allowed');

class CategoryController {

    #router = new express.Router();
    #basePath = '/categories';

    #getMiddlewares = [
        check('id', 'Invalid id.').isMongoId(),
        checkCategoryExists,
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
        checkCategoryExists,
        checkErrors
    ];
    #deleteMiddlewares = [
        validateJWT,
        check('id', 'Invalid id.').isMongoId(),
        checkCategoryExists,
        checkErrors
    ];
    
    registerRoutes() {
        this.#router.get( this.#basePath, this.__getCategories );
        this.#router.get( this.#basePath + '/:id', this.#getMiddlewares, this.__getCategoryById );
        this.#router.post( this.#basePath, this.#postMiddlewares, this.__createCategory );
        this.#router.put( this.#basePath + '/:id', this.#putMiddlewares, this.__updateCategory );
        this.#router.delete( this.#basePath + '/:id', this.#deleteMiddlewares, this.__deleteCategory );

        return this.#router;
    }

    __getCategories = async( req, res ) => {

        const { from = 0, limit = 5 } = req.query;

        const QUERY = { status: true };
        const FROM_PARSED = from ? parseInt( from ) : 0;
        const LIMIT_PARSED = limit ? parseInt( limit ) : 100;

        try {
            const categories = await Category.find( QUERY ).populate('user','name').limit( parseInt(limit) ).skip( parseInt(from) );
            const count = await Category.find( QUERY ).limit( LIMIT_PARSED ).skip( FROM_PARSED ).countDocuments();
            
            return res.json({
                total: count,
                categories
            });
            
        } catch (error) {
            return res.status(404).json( customErrorResponse("40400", "NOT_FOUND", "There was a problem retrieving all the categories.") );
        }
    }

    __getCategoryById = ( req, res ) => {

        return res.json( req.category )
    }
    
    __createCategory = async( req, res ) => {
        // Category => name, status, user (userId)
        const USER_ID = req.user.id;
        const name = req.body.name.toUpperCase();

        try {

            const categoryDB = await Category.findOne({ name }).exec();

            if( categoryDB ) {
                if( !categoryDB.status ) {
                    return res.status(400).json( customErrorResponse('40002', 'BAD_REQUEST', `The category ${ name } is inactive.`) );
                } else {
                    return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', `The category ${ name } already exists.`) );
                }
            }

            try { 
    
                const category = await Category.create({
                    name: name,
                    user: USER_ID
                });
    
                return res.status(201).json( category );
                
            } catch (error) {
                return res.status(409).json( customErrorResponse('40900', 'CONFLICT', 'There was a problem creating the category.') );
            }
        } catch (error) {
            return res.status(404).json( customErrorResponse('40400', 'NOT_FOUND', 'There was a finding the category.') );
        }
    }

    __updateCategory = async( req, res ) => {
        
        const { id } = req.params;
        const upperCaseName = req.body?.name.toUpperCase();
        const userLogged = req.user;
        const reqCategory = req.category;
        
        try {

            if ( req.category.name == upperCaseName ) return res.status(400).json( customErrorResponse("40000", "BAD_REQUEST", "The category name already exists") );

            if( !allowed( userLogged, reqCategory ) ) return res.status(403).json( customErrorResponse("40300", "FORBIDDEN", "To update a category has to be owner or admin") );

            try {
                const categoryUpdated = await Category.findByIdAndUpdate( id, { name: upperCaseName }, { new: true } );

                return res.json({
                    message: 'OK!',
                    category: categoryUpdated
                });
            } catch (error) {
                return res.status(400).json( customErrorResponse("40001", "BAD_REQUEST", "There was a problem updating the category") );
            }

        } catch (error) {
            return res.status(404).json( customErrorResponse("40400", "NOT_FOUND", "There was an error finding the category") );
        }
    }

    __deleteCategory = async( req, res ) => {
        
        const { id } = req.params
        const category = req.category;
        const userLogged = req.user;

        if( !category.status ) return res.status(409).json( customErrorResponse("40900", "CONFLICT", "The category is already deleted.") );

        if( !allowed( userLogged, category ) ) return res.status(403).json( customErrorResponse("40300", "FORBIDDEN", "To update a category has to be owner or admin") );
        
        try {
            await Category.findByIdAndUpdate( id, { status: false } );

            return res.json({
                message: `The category with id ${ id } has been deleted.`
            });
        } catch (error) {
            return res.status(404).json( customErrorResponse("40400", "NOT_FOUND", "There was a problem deleting the category") );
        }
    }
}

module.exports = CategoryController;