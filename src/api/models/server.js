const express = require('express');
require('dotenv').config();

class Server {
    
    constructor(controllers = []) {
        this.controllers = controllers;
        this.app = express();
        this.port = process.env.PORT || 8080;
        
        // Middlewares
        this.middlewares();
        
        // Initialize controllers
        this.initializeControllers();

        // Routes
        this.routes();
    }

    initializeControllers() {
        this.controllers.forEach( controller => {
            this.app.use( '/',  controller.registerRoutes() );
        });

        console.log(`Registered ${ this.controllers.length } controllers successfully!`);
    }

    middlewares() {
        this.app.use( express.static('public') );
        this.app.use( express.json() ); 
    }

    routes() {

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Example app listening on port ${ this.port }...`)
        });
    }

}


module.exports = Server;
