const { Types } = require('mongoose');
const { collectionsAllowed } = require("../types/collections");
const { customErrorResponse } = require('../../../utils/error.util');
const Category = require('../../models/category');
const Product = require('../../models/product');
const User = require('../../models/user');
const { sendResponse } = require('../../../utils/response.util');
const { findServiceUserResponse, findServiceCategoryResponse, findServiceProductsResponse } = require('../services/find.service');

const findBy = async( req, res ) => {

    const { collection, term } = req.params;

    try {
        let response;

        switch ( collection ) {
            // categories
            case collectionsAllowed[0]:
                const categories = await findByCategories( term );
                response = findServiceCategoryResponse( categories);
                break;
            // products
            case collectionsAllowed[1]:
                const products = await findByProducts( term );
                response = findServiceProductsResponse( products );
                break;
            // users
            case collectionsAllowed[2]:
                const users = await findByUsers( term );
                response = findServiceUserResponse( users );
                break;
        }

        return sendResponse( req, res, response );
    } catch (error) {
        return res.status( error.code.slice(0, 3) ).json( error );
    }
}

const findByUsers = async( item ) => {
    const isValidMongoId = Types.ObjectId.isValid( item );

    if ( isValidMongoId ) {
        try {
            const user = await User.findById( item ).exec();
            if( !user ) throw customErrorResponse( '40403', 'NOT_FOUND', 'There was a problem finding the user by id.' );
            return user;
        } catch (error) {
            if( error.code = '40403') throw error;
            throw customErrorResponse( '40402', 'NOT_FOUND', 'There was a problem finding the user by id.');
        }
    } 

    const regExp = new RegExp( item , 'i');
    
    try {

        const users = await User.find({
            $or: [
                { name: regExp },
                { email: regExp },
                { role: regExp }
            ],
            $and: [
                { status: true }
            ]
        });

        if( !users ) throw customErrorResponse( '40401', 'NOT_FOUND', 'There was a problem finding the user by id.' );

        return users;

    } catch (error) {
        if( error.code = '40401') throw error;
        throw customErrorResponse( '40400', 'NOT_FOUND', 'There was a problem finding the user by id.');
    }
}

const findByCategories = async( item ) => {
    const isValidMongoId = Types.ObjectId.isValid( item );

    if ( isValidMongoId ) {
        try {
            const category = await Category.findById( item ).populate( 'user', 'name' ).exec();
            if( !category ) throw customErrorResponse( '40403', 'NOT_FOUND', 'There was a problem finding the user by id.' );

            return category;
        } catch (error) {
            if( error.code = '40403') throw error;
            throw customErrorResponse( '40402', 'NOT_FOUND', 'There was a problem finding the user by id.');
        }
    } 

    const regExp = new RegExp( item , 'i');
    
    try {
        const categories = await Category.find({
            $or: [
                { name: regExp }
            ],
            $and: [
                { status: true }
            ]
        }).populate('user', 'name');

        if( !categories ) throw customErrorResponse( '40401', 'NOT_FOUND', 'There was a problem finding the user by id.' );
        
        return categories;
    } catch (error) {
        if( error.code = '40401') throw error;
        throw customErrorResponse( '40400', 'NOT_FOUND', 'There was a problem finding the user by id.');
    }
}

const findByProducts = async( item ) => {
    const isValidMongoId = Types.ObjectId.isValid( item );

    if ( isValidMongoId ) {
        try {
            const product = await Product.findById( item ).populate( 'user', 'name' ).populate( 'category', 'name' ).exec();

            if( !product ) throw customErrorResponse( '40403', 'NOT_FOUND', 'There was a problem finding the category by id.' );

            return product;
        } catch (error) {
            if( error.code = '40403') throw error;
            throw customErrorResponse( '40402', 'NOT_FOUND', 'There was a problem finding the category by id.');
        }
    } 

    const regExp = new RegExp( item , 'i');
    
    try {

        const products = await Product.find({
            $or: [
                { name: regExp },
                { description: regExp }
            ],
            $and: [
                { status: true }
            ]
        }).populate( 'user', 'name' ).populate( 'category', 'name' );

        if( !products ) throw customErrorResponse( '40401', 'NOT_FOUND', 'There was a problem finding the product by id.' );
        
        return products;
    } catch (error) {
        if( error.code = '40401') throw error;
        throw customErrorResponse( '40400', 'NOT_FOUND', 'There was a problem finding the product by id.');
    }
}



module.exports = {
    findBy
}