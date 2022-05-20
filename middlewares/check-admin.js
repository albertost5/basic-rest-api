const { customErrorResponse } = require("../src/utils/error.util");

const checkAdminRole = ( req, res, next ) => {
    const { role } = req.user;

    if( role != 'ADMIN_ROLE') return res.status(403).json( customErrorResponse('40300', 'FORBIDDEN', 'Only admin users are able to perform this action.') );

    next();
}

module.exports = {
    checkAdminRole
}