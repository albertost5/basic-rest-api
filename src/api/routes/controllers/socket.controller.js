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
        socket.emit( 'get-messages', chat.lastMessages );

        // Private chat
        socket.join( user.id );

        // Remove user on disconnect
        socket.on( 'disconnect', () => {
            chat.disconnectUser( user.id ) 
            io.emit( 'active-users', chat.activeUsersArr );
        });

        // Send message @ all
        socket.on( 'send-message' , ({ uid, message }) => {

            // Private message if the uid is present
            if( uid ) {
                socket.to( uid ).emit( 'private-message', message );
            } else {
                chat.sendMessage( user.id, user.name, message );
                io.emit( 'get-messages', chat.lastMessages );
            }
        });

    } catch (error) {
        console.warn('There was an error validating the token: ' + error);
        return;
    }
}

module.exports = {
    socketController
}