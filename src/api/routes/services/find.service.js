const { getBaseResponse } = require("../../../utils/response.util")

function findServiceUserResponse( item ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    
    if ( Array.isArray( item ) ) {
        baseResponse.data.users = item
    } else {
        baseResponse.data.user = item 
    }

    return baseResponse;
}


module.exports = {
    findServiceUserResponse
}