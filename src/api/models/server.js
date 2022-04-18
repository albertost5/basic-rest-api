const express = require('express');
require('dotenv').config();
var cors = require('cors')

class Server {
    
    constructor( controllers = [] ) {
        this.controllers = controllers;
        this.app = express();
        this.port = process.env.PORT || 3001;
        
        // Middlewares
        this.middlewares();
        
        // Initialize controllers
        this.initializeControllers();
    }

    initializeControllers() {
        this.controllers.forEach( controller => {
            this.app.use( '/',  controller.registerRoutes() );
        });

        console.log(`Registered ${ this.controllers.length } controllers successfully!`);
    }

    middlewares() {
        this.app.use( cors() );
        this.app.use( express.json() ); 
        this.app.use( express.static('public') );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Example app listening on port ${ this.port }...`)
        });
    }

}

module.exports = Server;
