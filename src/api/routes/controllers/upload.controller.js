const path = require('path');
const fs = require('fs');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL )
const { customErrorResponse } = require('../../../utils/error.util');
const { uploadFileHelper, getCollectionObject } = require('../../../../helpers/upload-validator');
const { sendResponse } = require('../../../utils/response.util');
const { uploadServiceSend, uploadServiceSendObj } = require('../services/upload.service');


const uploadFile = async( req, res ) => {

    try {
        const IMG_URL = await uploadFileHelper( req.files, undefined, 'imgs' );
        return sendResponse( req, res, uploadServiceSend( IMG_URL ) ); 
    } catch (error) {
        const statusCode = error.code.slice( 0, 3 );
        return res.status( statusCode ).json( error );
    }
    
}

const updateFile = async( req, res ) => {

    const { collection, id } = req.params;
    let object; 

    try {
        object = await getCollectionObject( collection, id );
    } catch (error) {
        return res.status( error.code.slice( 0, 3 ) ).json( error );
    }

    // Clear the img (if the object, product/user, already has one)
    if( object.img ) {
        const imgArr = object.img.split('/');
        const imgName = imgArr[ imgArr.length - 1 ];
        const [ public_id, extension ] =  imgName.split('.');

        try {
            await cloudinary.uploader.destroy( public_id );
        } catch (error) {
            return res.status(500).json( customErrorResponse('50001', 'INTERNAL_SERVER_ERORR', 'There was a problem removing the img.' ) );
        }
    }

    try {
        object.img = await uploadFileHelper( req.files, undefined, collection );

        try {

            await object.save();
            return sendResponse( req, res, uploadServiceSendObj( object ) );

        } catch (error) {
            return res.status(500).json( customErrorResponse('50000', 'INTERNAL_SERVER_ERORR', 'There was a problem updating the img.' ) );
        }

    } catch (error) {
        return res.status( error.code.slice( 0, 3 ) ).json( error );
    }
}

const getFile = async( req, res ) => {

    const { collection, id } = req.params;

    let object; 

    try {
        object = await getCollectionObject( collection, id );    
    } catch (error) {
        return res.status( error.code.slice( 0, 3 ) ).json( error );
    }

    if ( object.img ) {

        const IMG_PATH = path.join( __dirname, '../../../../uploads', collection, object.img );
        return res.sendFile( IMG_PATH );
    }

    const NO_IMG_PATH = path.join( __dirname, '../../../../assets', 'no-image.jpg');
    return res.sendFile( NO_IMG_PATH );
} 

module.exports = {
    uploadFile,
    updateFile,
    getFile
}