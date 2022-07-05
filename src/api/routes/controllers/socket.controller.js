const { Socket } = require("socket.io");
const { checkJWT } = require("../../../../helpers/generate-jwt");
const Chat = require("../../models/chat");

const chat = new Chat();
 
const socketController = async( socket = new Socket(), io ) => {

    const token = socket.handshake.headers['x-token'];

    try {
        const user = await checkJWT( token );
        
        if( !user ) socket.disconnect();

        // Add the connected user:
        chat.connectUser( user );

        io.emit( 'active-users', chat.activeUsersArr );

        // Remove user on disconnect
        socket.on( 'disconnect', () => {
            chat.disconnectUser( user.id ) 
            io.emit( 'active-users', chat.activeUsersArr );
        });


    } catch (error) {
        console.warn('There was an error validating the token: ' + error);
    }
}

module.exports = {
    socketController
}