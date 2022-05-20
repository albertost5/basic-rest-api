const User = require('../src/api/models/user');
const Category = require('../src/api/models/category');
const { customErrorResponse } = require('../src/utils/error.util');

const userExists = async( id ) => { 
    
    try {
        const user = await User.findById( id );
        if( !user ) throw customErrorResponse('40401', 'NOT_FOUND', `User doesn't exist.`);
    } catch (error) {
        if( error.code ) throw error;
        throw customErrorResponse('40400', 'NOT_FOUND', 'There was a problem finding the user by id.');
    }

}

const categoryExists = async( id ) => {
    
    try {  

        const category = await Category.findById( id );
        
        if( !category ) {
            throw customErrorResponse('40402', 'NOT_FOUND', `The category with id, ${ id }, doesn't exist.`);
        } else if ( !category.status ) {
            throw customErrorResponse('40401', 'NOT_FOUND', 'The category is inactive.');
        }

    } catch (error) {
        if ( error.code ) throw error
        throw customErrorResponse('40400', 'NOT_FOUND', 'There was an error finding the category.');
    }
}

module.exports = {
    userExists,
    categoryExists
}
