const customErrorResponse = require("../src/utils/error.util");

const checkUserStatus = ( user ) => {
    if( !user.status ) throw customErrorResponse('40400', 'NOT_FOUND', 'User inactive.');
}

module.exports = {
    checkUserStatus
}