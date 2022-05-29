const { getBaseResponse } = require("../../../utils/response.util")

function productServiceAllProducts( nProducts, products ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        total: nProducts,
        products
    }

    return baseResponse;
}

function productServiceOneProduct( product ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        product
    }

    return baseResponse;
}

function productServiceUpdate( product ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        message: `The product with id ${ product.id } was updated successfully!`,
        product
    }

    return baseResponse;
}

function productServiceDelete( productId ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        message: `The product with id ${ productId } was deleted successfully!`,
    }

    return baseResponse;
}

module.exports = {
    productServiceOneProduct,
    productServiceAllProducts,
    productServiceUpdate,
    productServiceDelete
}