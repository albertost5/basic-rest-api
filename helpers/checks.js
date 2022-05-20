const { customErrorResponse } = require("../src/utils/error.util");

const checkUserStatus = ( user ) => {
    if( !user.status ) throw customErrorResponse('40400', 'NOT_FOUND', 'User inactive.');
}

const checkAllowed = ( user, category ) => {
    return ( user.id == category.user.id || user.role === 'ADMIN_ROLE' )
}

module.exports = {
    checkUserStatus,
    checkAllowed
}