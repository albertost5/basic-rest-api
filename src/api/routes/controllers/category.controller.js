const Category = require('../../models/category');
const { checkAllowed } = require('../../../../helpers/checks');
const { customErrorResponse } = require('../../../utils/error.util');
const { sendResponse } = require('../../../utils/response.util');
const { categoryServiceAllCategories, categoryServiceOneCategory, categoryServiceCategoryUpdated, categoryServiceDelete } = require('../services/category.service');


getCategories = async( req, res ) => {

    const { from = 0, limit = 5 } = req.query;

    const QUERY = { status: true };
    const FROM_PARSED = from ? parseInt( from ) : 0;
    const LIMIT_PARSED = limit ? parseInt( limit ) : 100;

    try {
        const categories = await Category.find( QUERY ).populate('user','name').limit( parseInt(limit) ).skip( parseInt(from) );
        const count = await Category.find( QUERY ).limit( LIMIT_PARSED ).skip( FROM_PARSED ).countDocuments();
        
        return sendResponse( req, res, categoryServiceAllCategories( count, categories ) );

    } catch (error) {
        return res.status(404).json( customErrorResponse('40400', 'NOT_FOUND', 'There was a problem retrieving all the categories.') );
    }
}

getCategoryById = async( req, res ) => {
    
    const { id } = req.params;
    try {
        const category = await Category.findById( id ).populate( 'user', 'name' );
        return sendResponse( req, res, categoryServiceOneCategory(category) );
    } catch (error) {
        return res.status(404).json( customErrorResponse( '40401', 'NOT_FOUND', 'There was an error finding the category.' ));
    }
}

createCategory = async( req, res ) => {
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
            
            return sendResponse( req, res, categoryServiceOneCategory(category) );
            
        } catch (error) {
            return res.status(409).json( customErrorResponse('40900', 'CONFLICT', 'There was a problem creating the category.') );
        }
    } catch (error) {
        return res.status(404).json( customErrorResponse('40400', 'NOT_FOUND', 'There was a finding the category.') );
    }
}

updateCategory = async( req, res ) => {
    
    const { id } = req.params;
    const upperCaseName = req.body?.name.toUpperCase();
    const userLogged = req.user;
    
    try {
        const category = await Category.findById( id ).populate( 'user', ['name', 'id'] );

        if ( category.name == upperCaseName ) return res.status(400).json( customErrorResponse('40000', 'BAD_REQUEST', 'The category name already exists') );

        if( !checkAllowed( userLogged, category ) ) return res.status(403).json( customErrorResponse('40300', 'FORBIDDEN', 'To update a category has to be owner or admin') );

        try {
            const categoryUpdated = await Category.findByIdAndUpdate( id, { name: upperCaseName }, { new: true } );

            return sendResponse( req, res, categoryServiceCategoryUpdated(categoryUpdated) );
        } catch (error) {
            console.log(error);
            return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', 'There was a problem updating the category') );
        }

    } catch (error) {
        return res.status(404).json( customErrorResponse('40403', 'NOT_FOUND', 'There was an error finding the category') );
    }
}

deleteCategory = async( req, res ) => {
    
    const { id } = req.params
    const userLogged = req.user;

    try {
        const category = await Category.findById( id ).populate( 'user', 'id' );
        
        if( !category.status ) return res.status(409).json( customErrorResponse('40900', 'CONFLICT', 'The category is already deleted.') );

        if( !checkAllowed( userLogged, category ) ) return res.status(403).json( customErrorResponse('40300', 'FORBIDDEN', 'To update a category has to be owner or admin') );
        
        try {
            await Category.findByIdAndUpdate( id, { status: false } );

            return sendResponse( req, res, categoryServiceDelete(id) );
        } catch (error) {
            return res.status(404).json( customErrorResponse('40400', 'NOT_FOUND', 'There was a problem deleting the category') );
        }
    } catch (error) {
        return res.status(404).json( customErrorResponse('40403', 'NOT_FOUND', 'There was an error finding the category') );
    }
}


module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};