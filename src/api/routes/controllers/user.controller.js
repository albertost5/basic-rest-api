const User = require('../../models/user');
const { customErrorResponse } = require('../../../utils/error.util');
// helpers
const { passwordHash } = require('../../../../helpers/password-hash');
const { checkAdminOrLoggedUser } = require('../../../../helpers/checks');
const { sendResponse } = require('../../../utils/response.util');
const { userServiceCreateRes, userServiceUpdateRes, userServiceAllUsersRes, userServiceDeleteRes } = require('../services/user.service');


createUser = async( req, res ) => {

    const { name, email, pw } = req.body
    
    try {
        // CHECK IF THE EMAIL IS ALREADY IN USE
        const EXIST_EMAIL = await User.findOne({ email: email });
        if( EXIST_EMAIL ) return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', 'Email already in use.') );

        const user = new User({
            name: name,
            email: email,
            password: passwordHash( pw )
        });
    
        await user.save();
        const response = userServiceCreateRes( user );

        return sendResponse( req, res, response );

    } catch (error) {
        return res.status(409).json( customErrorResponse('40900', 'CONFLICT', 'There was a problem creating the user.') );
    }
}

updateUser = async( req, res ) => {
    
    const { password, id, ...user } = req.body;
    // Hash the password before to update it in the DB
    if( password ) user.password = passwordHash( password );

    try {
        const userToModify = await User.findById( id );

        if ( !checkAdminOrLoggedUser( userToModify, req.user ) ) return res.status(403).json( customErrorResponse('40300', 'FORBIDDEN', 'Only admin or owner users are allowed to perform this action.') );
        
        try {
            const userUpdated = await User.findByIdAndUpdate( { _id: id }, user , { new: true } );
            return sendResponse( req, res, userServiceUpdateRes( userUpdated ) );
        } catch (error) {
            return res.status(404).json( customErrorResponse('40900', 'CONFLICT ', 'There was a problem updating the user.') );
        }

    } catch (error) {
        return res.status(404).json( customErrorResponse('40403', 'NOT_FOUND', 'There was a problem finding the user.') )
    }
}

getUsers = async( req, res ) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true};

    try {
        const [ users, total ] = await Promise.all([
            User.find( query ).limit( parseInt(limit) ).skip( parseInt(from) ),
            User.countDocuments( query )
        ]);

        let usersRes = new Array();

        for( let user of users ) {
            usersRes.push({
                name: user.name,
                email: user.email
            })
        }

        return sendResponse( req, res, userServiceAllUsersRes( users.length, usersRes) );

    } catch (error) {
        return res.status(400).json( customErrorResponse('40003', 'BAD_REQUEST', 'There was a problem to fetch the data of the users.') );
    }
}

deleteUser = async( req, res ) => {
    const { id } = req.query;
    
    try {
        await User.findByIdAndUpdate( id, {status: false} );
        return sendResponse( req, res, userServiceDeleteRes( id, req.user ) );
    } catch (error) {
        res.status(404).json( customErrorResponse('40400', 'NOT_FOUND', 'There was a problem removing the user from the database.') );
    }
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser
}



