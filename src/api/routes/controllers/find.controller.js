const { Types } = require('mongoose');
const { collectionsAllowed } = require("../types/collections");
const { customErrorResponse } = require('../../../utils/error.util');
const Category = require('../../models/category');
const Product = require('../../models/product');
const User = require('../../models/user');
const { sendResponse } = require('../../../utils/response.util');
const { findServiceUserResponse } = require('../services/find.service');
const { $where } = require('../../models/category');

const findBy = async( req, res ) => {

    const { collection, term } = req.params;

    if( !collectionsAllowed.includes( collection ) ) {
        return res.status(400).json( customErrorResponse('40000', 'BAD_REQUEST', `${ collection }, is not a valid collection.`) );
    }

    try {
        let response;
        
        switch ( collection ) {
            // categories
            case collectionsAllowed[0]:
                
                break;
            // products
            case collectionsAllowed[1]:
            
                break;
            // users
            case collectionsAllowed[2]:
                response = await findByUsers( term );
                break;
        }
        
        return sendResponse( req, res, findServiceUserResponse( response ) );
    } catch (error) {
        console.log(error);
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
                { email: regExp }
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

module.exports = {
    findBy
}