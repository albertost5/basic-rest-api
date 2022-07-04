
const url = window.location.hostname.includes('localhost') ?
    'http://localhost:3000/auth' :
    'https://rest-api-node-albertost5.herokuapp.com/auth'

let user = null;
let socket = null;

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
    const socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
}

const main = async() => {
    
    // Validate JWT - localStorage
    await validateJWT();

}

main();


