const User = require('../src/api/models/user');
const customErrorResponse = require('../src/utils/error.util');

const userExists = async( id ) => { 
    
    try {
        const user = await User.findById( id );
        if( !user ) throw new Error(`The user for the id, ${ id }, don't exist.`);
    } catch (error) {
        throw new Error('There was a problem finding the user by id.');
    }
}

module.exports = {
    userExists
}
