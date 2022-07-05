
const url = window.location.hostname.includes('localhost') ?
    'http://localhost:3000/auth' :
    'https://rest-api-node-albertost5.herokuapp.com/auth'

let user = null;
let socket = null;

// HTML References
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const usersUl = document.querySelector('#users');
const messagesUl = document.querySelector('#messages');
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

    socket.on( 'connect', () => {
        console.log('Sockets online... ');
    });

    socket.on( 'disconnect', ( user ) => {
        console.log(`${ user.name } was disconnected...`);
    });

    socket.on( 'get-messages', printMessages );

    socket.on( 'active-users', printUsers );

    socket.on( 'private-message', () => {
        // TO DO
    });
}

const printUsers = ( users = [] ) => {

    let usersList = '';

    users.forEach( user => {
        usersList += `
            <li>
                <p>
                    <h5 class="text-success">${ user.name }</h5>
                    <span class="fs-6 text-muted">${ user.uid }</span>
                </p>
            </li>
        `
    });

    usersUl.innerHTML = usersList;
}

const printMessages = ( messages = [] ) => {

    let chatMessages = '';

    messages.forEach( ({ name, message }) => {
        chatMessages += `
            <li>
                <p>
                    <span class="text-primary">${ name }</span>
                    <span>${ message }</span>
                </p>
            </li>
        `
    });

    messagesUl.innerHTML = chatMessages;
}

txtMessage.addEventListener('keyup', ({ keyCode }) => {
    
    const uid = txtUid.value.trim();
    const message = txtMessage.value.trim();

    if( keyCode !== 13 ) return;
    if( message.length === 0 ) return;

    socket.emit( 'send-message',  { uid, message } );
    
    txtMessage.value = '';
});


const main = async() => {
    
    // Validate JWT - localStorage
    await validateJWT();

}

main();


