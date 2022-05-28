const { getBaseResponse } = require("../../../utils/response.util")

function authServiceLogin( user, userTokenJWT ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        user,
        token: userTokenJWT
    }
    
    return baseResponse;
}

function authServiceGoogle( user ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        user
    }
    
    return baseResponse;
}


module.exports = {
    authServiceLogin,
    authServiceGoogle
}
