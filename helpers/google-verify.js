const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

async function googleVerify( token ) {
    const TICKET = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, picture, email } = TICKET.getPayload();
    // payload.email / payload.name / payload.given_name / payload.family_name
    return {
        name,
        picture,
        email
    };
}

module.exports = {
    googleVerify
}