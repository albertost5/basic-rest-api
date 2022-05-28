const { getBaseResponse } = require("../../../utils/response.util")

function categoryServiceAllCategories( nCategories, categories ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        total: nCategories,
        categories
    }

    return baseResponse;
}

function categoryServiceOneCategory( category ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        category
    }

    return baseResponse;
}

function categoryServiceCategoryUpdated( category ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        message: `The category with id ${ category.id } was updated successfully!`,
        category
    }

    return baseResponse;
}

function categoryServiceDelete( categoryId ) {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = {
        message: `The category with id ${ categoryId } was deleted successfully!`,
    }

    return baseResponse;
}

module.exports = {
    categoryServiceAllCategories,
    categoryServiceOneCategory,
    categoryServiceCategoryUpdated,
    categoryServiceDelete
}