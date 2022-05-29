const Product = require('../../models/product');
const { checkAllowed, checkProductBody } = require('../../../../helpers/checks');
const { customErrorResponse } = require('../../../utils/error.util');
const { sendResponse } = require('../../../utils/response.util');
const { productServiceOneProduct, productServiceAllProducts, productServiceUpdate } = require('../services/product.service');
const { productExists, categoryExists } = require('../../../../helpers/db-validator');
const { json } = require('express/lib/response');


createProduct = async( req, res ) => {
    // PRODUCT => name, status, user(MongoId), price, category (MongoId), description
    const { name, price, category, description } = req.body;
    const nameToUpperCase = name.toUpperCase();
    const REQ_USER_ID = req.user.id;

    try {
        const productDB = await Product.findOne({ name: nameToUpperCase }).exec();

        if( productDB ) {
            if( !productDB.status ) {
                return res.status(400).json( customErrorResponse('40002', 'BAD_REQUEST', `The product ${ nameToUpperCase } is inactive.`) );
            } else {
                return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', `The product ${ nameToUpperCase } already exists.`) );
            }
        }

        try { 
            const product = await Product.create({
                name: nameToUpperCase,
                price: price,
                description: description,
                user: REQ_USER_ID,
                category: category
            });
            
            return sendResponse( req, res, productServiceOneProduct( product ) );
        } catch (error) {
            return res.status(409).json( customErrorResponse('40900', 'CONFLICT', 'There was a problem creating the product.') );
        }
    } catch (error) {
        return res.status(404).json( customErrorResponse('40403', 'NOT_FOUND', 'There was a problem finding the product.') );
    }
}

getProducts = async( req, res ) => {

    const { from = 0, limit = 5 } = req.query;

    const QUERY = { status: true };
    const FROM_PARSED = from ? parseInt( from ) : 0;
    const LIMIT_PARSED = limit ? parseInt( limit ) : 100;

    try {
        const products = await Product.find( QUERY ).populate('user','name').populate('category', 'name').limit( parseInt(limit) ).skip( parseInt(from) );
        const count = await Product.find( QUERY ).limit( LIMIT_PARSED ).skip( FROM_PARSED ).countDocuments();
        
        return sendResponse( req, res, productServiceAllProducts( count, products ) );
    } catch (error) {
        console.log(error);
        return res.status(404).json( customErrorResponse('40400', 'NOT_FOUND', 'There was a problem retrieving all the products.') );
    }
}

getProductById = async( req, res ) => {

    const { id } = req.params;
    try {
        const product = await Product.findById( id ).populate('user', 'name').populate('category', 'name').exec();
        return sendResponse( req, res, productServiceOneProduct( product ) );
    } catch (error) {
        return res.status(404).json( customErrorResponse('40403', 'NOT_FOUND', 'There was an error finding the product.') );
    }
}

updateProduct = async( req, res ) => {
    
    const { id } = req.params;
    const upperCaseName = req.body?.name?.toUpperCase();
    const userLogged = req.user;
    
    try {
        const product = await Product.findById( id ).populate( 'user', ['name', 'id'] ).populate('category', ['name', 'id']).exec();
        const DATA = checkProductBody( req.body, product );
        
        // CHECK IF THE PRODUCT EXIST
        if ( product.name == upperCaseName ) return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', 'The category name already exists') );
        // CHECK IF THE USER IS THE OWNER OR AN ADMIN
        if( !checkAllowed( userLogged, product ) ) return res.status(403).json( customErrorResponse('40300', 'FORBIDDEN', 'To update a category has to be owner or admin') );
        
        try {
            // CHECK IF THE CATEGORY FROM THE BODY IS DIFFERENT. IN THAT CASE CHECK IF IS A VALID CATEGORY ID
            if( DATA.category != product.category.id ) {
                try {
                    await categoryExists( DATA.category );
                } catch (error) {
                    return res.status( error.code.slice(0, 3) ).json( error );
                }
            }
            
            const productUpdated = await Product.findByIdAndUpdate( id, DATA, { new: true } );

            return sendResponse( req, res, productServiceUpdate( productUpdated ) );
        } catch (error) {

            return res.status(400).json( customErrorResponse('40000', 'BAD_REQUEST', 'There was a problem updating the product') );
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json( customErrorResponse('40403', 'NOT_FOUND', 'There was an error finding the product') );
    }
}


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct
};