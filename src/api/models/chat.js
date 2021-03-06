class Message {
    
    constructor( uid, name, message ) {
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}


class Chat {

    constructor() {

        this.messages = [];
        this.users = {};

    }

    get lastMessages() {
        this.messages = this.messages.splice( 0, 10 );
        
        return this.messages;
    }

    get activeUsersArr() {
        return Object.values( this.users ); 
    }

    sendMessage( receiverUid, senderName, message ) {
        this.messages.unshift(
            new Message( receiverUid, senderName, message )
        );
    }

    connectUser( user ) {
        this.users[user.id] = user;
    }

    disconnectUser( id ) {
        delete this.users[id];
    }
}

module.exports = Chat;