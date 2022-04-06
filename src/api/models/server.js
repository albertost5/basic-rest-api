const express = require('express');
require('dotenv').config();

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;

        this.routes();
    }

    routes() {
        this.app.get('/', ( req, res ) => {
            res.send('Hello World!')
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${ this.port }`)
        });
    }

}


module.exports = Server;