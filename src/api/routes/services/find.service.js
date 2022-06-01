const { getBaseResponse } = require("../../../utils/response.util")

function findServiceUserResponse( item ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    
    if ( Array.isArray( item ) && item.length > 1 ) {
        baseResponse.data.users = item
    } else {
        baseResponse.data.user = item
    }

    return baseResponse;
}

function findServiceCategoryResponse( item ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    
    if ( Array.isArray( item ) && item.length > 1 ) {
        baseResponse.data.categories = item
    } else {
        baseResponse.data.category = item 
    }

    return baseResponse;
}

function findServiceProductsResponse( item ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';

    if ( Array.isArray( item ) && item.length > 1 ) {
        baseResponse.data.products = item
    } else {
        baseResponse.data.product = item 
    }

    return baseResponse;
}


module.exports = {
    findServiceUserResponse,
    findServiceCategoryResponse,
    findServiceProductsResponse
}