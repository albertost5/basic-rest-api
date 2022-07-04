console.log(window.location.hostname);

const url = window.location.hostname.includes('localhost') ?
    'http://localhost:3000/auth' :
    'https://rest-api-node-albertost5.herokuapp.com/auth'

// HTML REFERENCES
const signInBtn = document.getElementsByClassName('g_id_signin');
const signOutBtn = document.getElementById('g_id_signout');
const LOGIN_FORM = document.querySelector('form');

// LOGIN FORM
LOGIN_FORM.addEventListener( 'submit', e => {
    e.preventDefault();

    const formData = {};

    for( let el of LOGIN_FORM.elements ){
        
        if( el.name.length > 0 ) {
            formData[el.name] = el.value
        }

    }

    console.log({ formData });
    
    fetch( url + '/login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( response => response.json() )
    .then( ({ message, token }) => {

       if( message ) {
            return console.error( message );
       }

       localStorage.setItem( 'token', token );
       window.location = 'chat.html';

    })
    .catch( err => {
        console.log({ err });
    });
});

let EMAIL = localStorage.getItem('email');

EMAIL ? signOutBtn.disabled = false : signOutBtn.disabled = true;

// GOOGLE SIGN IN
function handleCredentialResponse(response) {
    // GOOGLE TOKEN: ID_TOKEN
    // console.log( 'GOOGLE_TOKEN => ', response.credential );

    const PAYLOAD = {
        google_token: response.credential
    }

    fetch( url + '/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( PAYLOAD )
        })
        .then( response => response.json() )
        .then( data => {
            console.log( data ),
            localStorage.setItem('email', data.user.email),
            localStorage.setItem('token', data.token ),
            signOutBtn.disabled = false,
            EMAIL = data.user.email,
            window.location = 'chat.html'
        })
        .catch(err => console.log(err));
}

if ( EMAIL ) {
    signOutBtn.onclick = () => {
        console.log('g_id => ', google.accounts.id);
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke( localStorage.getItem('email'), done => {
            localStorage.clear();
            location.reload();
            EMAIL = '';
        })
    }
}