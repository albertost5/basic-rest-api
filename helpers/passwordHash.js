const bcrypt = require('bcrypt');

const passwordHash = ( password ) => {
    const saltRounds = 10;
    return bcrypt.hashSync( password, saltRounds );
}

const comparePasswordHash = ( password, hash ) => {
    return bcrypt.compareSync( password, hash );
}

module.exports = {
    passwordHash,
    comparePasswordHash
};