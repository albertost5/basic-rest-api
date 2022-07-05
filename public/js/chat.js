
const url = window.location.hostname.includes('localhost') ?
    'http://localhost:3000/auth' :
    'https://rest-api-node-albertost5.herokuapp.com/auth'

let user = null;
let socket = null;

// HTML References
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const users = document.querySelector('#users');
const messages = document.querySelector('#messages');
const btnLogOut = document.querySelector('#btnLogOut');


// Validate JWT from localStorage
const validateJWT = async() => {

    const token = localStorage.getItem('token') || undefined;

    if( token?.length <= 10 ) {
        window.location = 'index.html';
        localStorage.clear();
        throw new Error('Token not found.')
    }

    try {

        const response = await fetch( url + '/token', {
            headers: {
                'x-token': token
            }
        });
    
        const { user: userDB, token: tokenDB } = await response.json();
        
        // Renew JWT
        localStorage.setItem('token', tokenDB);
        user = userDB;
        
        document.title = user.name;

    } catch (error) {
        window.location = 'index.html';
        localStorage.clear();
        throw new Error('There was a problem getting the token.')
    }

    // Establish connection with SocketIO
    connectSocket();

}

const connectSocket = () => {
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online... ');
    });

    socket.on('disconnect', ( user ) => {
        console.log(`${ user.name } was disconnected...`);
    });

    socket.on('get-messages', () => {
        // TO DO
    });

    socket.on('active-users', ( payload ) => {
        console.log( payload );
    });

    socket.on('private-message', () => {
        // TO DO
    });
}

const main = async() => {
    
    // Validate JWT - localStorage
    await validateJWT();

}

main();


