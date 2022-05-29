const { customErrorResponse } = require("../src/utils/error.util");

const checkUserStatus = ( user ) => {
    if( !user.status ) throw customErrorResponse('40400', 'NOT_FOUND', 'User inactive.');
}

const checkAllowed = ( user, item ) => {
    return ( user.id == item.user.id || user.role === 'ADMIN_ROLE' )
}

const checkAdminOrLoggedUser = ( user, reqUser ) => {
    return (user._id == reqUser.id || reqUser.role == 'ADMIN_ROLE');
}

const checkProductBody = ( requestBody, product ) => {
    const { name, price, category, description, status, stock } = requestBody;
    const DATA = {};

    name
        ? DATA.name = name
        : DATA.name = product.name
        
    if ( price ) {
        DATA.price = price
    }
    
    category 
        ? DATA.category = category 
        : DATA.category = product.category.id

    if ( description ) {
        DATA.description = description
    }
    if ( status ) {
        DATA.status = status
    }
    if ( stock ) {
        DATA.stock = stock
    }

    return DATA;
}

module.exports = {
    checkUserStatus,
    checkAllowed,
    checkAdminOrLoggedUser,
    checkProductBody
}