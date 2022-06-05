const path = require('path');
const fs = require('fs');
const { customErrorResponse } = require('../../../utils/error.util');
const { uploadFileHelper } = require('../../../../helpers/upload-file');
const { sendResponse } = require('../../../utils/response.util');
const { uploadServiceSend } = require('../services/upload.service');
const User = require('../../models/user');
const Product = require('../../models/product');

const uploadFile = async( req, res ) => {

    try {
        const fileName = await uploadFileHelper( req.files, undefined, 'imgs' );
        return sendResponse( req, res, uploadServiceSend( fileName ) ); 
    } catch (error) {
        const statusCode = error.code.slice( 0, 3 );
        return res.status( statusCode ).json( error );
    }
    
}

const updateFile = async( req, res ) => {

    const { collection, id } = req.params;
    let object; 

    switch ( collection ) {
        case 'users':
            try {
                object = await User.findById( id ).exec();

                if ( !object ) {
                    return res.status(404).json( customErrorResponse('40001', 'BAD_REQUEST', 'User not found.') );
                }
            } catch (error) {
                return res.status(404).json(
                    customErrorResponse('40000', 'BAD_REQUEST', 'User not found.')
                );
            }
            break;
        case 'products':
            try {
                object = await Product.findById( id ).exec();

                if ( !object ) {
                    return res.status(404).json( customErrorResponse('40001', 'BAD_REQUEST', 'Product not found.') );
                }
            } catch (error) {
                return res.status(404).json(
                    customErrorResponse('40000', 'BAD_REQUEST', 'Product not found.')
                );
            }
            break;
        default:
            return res.status(500).json(
                customErrorResponse('50000', 'INTERNAL_SERVER_ERROR', 'Something went wrong validating the collections.')
            );
    }

    // Clear the img (if the object, product/user, already has one)
    if( object.img ) {
        const IMG_PATH = path.join( __dirname, '../../../../uploads', collection, object.img );
        // Check if the path exits before to delete it.
        if( fs.existsSync( IMG_PATH) ) fs.unlinkSync( IMG_PATH );
    }

    try {
        object.img = await uploadFileHelper( req.files, undefined, collection );

        try {

            await object.save();

            return res.json( object );

        } catch (error) {
            return res.status(500).json( customErrorResponse('50000', 'INTERNAL_SERVER_ERORR', 'There was a problem updating the img.' ) );
        }

    } catch (error) {
        const statusCode = error.code.slice( 0, 3 );
        return res.status( statusCode ).json( error );
    }

}

module.exports = {
    uploadFile,
    updateFile
}