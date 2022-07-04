const { Socket } = require("socket.io");
const { checkJWT } = require("../../../../helpers/generate-jwt");

const socketController = async( socket = new Socket() ) => {

    const token = socket.handshake.headers['x-token'];

    try {
        const user = await checkJWT( token );
        
        if( !user ) socket.disconnect();

        console.log(`${user.name} is connected...`);
    } catch (error) {
        
    }
}

module.exports = {
    socketController
}