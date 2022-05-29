const Product = require('../../models/product');
const { customErrorResponse } = require('../../../utils/error.util');
const { sendResponse } = require('../../../utils/response.util');
const { productServiceOneproduct } = require('../services/product.service');


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
            
            return sendResponse( req, res, productServiceOneproduct(product) );
        } catch (error) {
            return res.status(409).json( customErrorResponse('40900', 'CONFLICT', 'There was a problem creating the product.') );
        }
    } catch (error) {
        return res.status(404).json( customErrorResponse('40403', 'NOT_FOUND', 'There was a problem finding the product.') );
    }
}


module.exports = {
    createProduct
};
