const { getBaseResponse } = require("../../../utils/response.util")

function userServiceCreateRes( user ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        message: `The user with email ${ user.email } was created successfully!`
    }

    return baseResponse;
}

function userServiceUpdateRes( userUpdated ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        message: 'User updated successfully!',
        user: userUpdated
    }

    return baseResponse;
}

function userServiceAllUsersRes( nUsers, usersArray ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        total: nUsers,
        users: usersArray
    }

    return baseResponse;
}

function userServiceDeleteRes( id, user ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        message: `The user with id ${ id } was removed successfully!`,
        userLogged: user
    }

    return baseResponse;
}


module.exports = {
    userServiceCreateRes,
    userServiceUpdateRes,
    userServiceAllUsersRes,
    userServiceDeleteRes
}