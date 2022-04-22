const bcrypt = require('bcrypt');

const passwordHash = ( password ) => {
    const saltRounds = 10;
    return bcrypt.hashSync( password, saltRounds );
}

module.exports = passwordHash;