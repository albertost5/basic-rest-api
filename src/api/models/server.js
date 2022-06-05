const express = require('express');
require('dotenv').config();
var cors = require('cors');
const dbConnection = require('../../../db/config');
const fileUpload = require('express-fileupload');

class Server {
    
    constructor( routes = [] ) {
        this.routes = routes;
        this.app = express();
        this.port = process.env.PORT || 3001;
        
        // Connection to DB
        this.dbConn();

        // Middlewares
        this.middlewares();
        
        // Initialize controllers
        this.initializeControllers();
    }

    initializeControllers() {
        this.routes.forEach( routes => {
            this.app.use( '/',  routes.registerRoutes() );
        });

        console.log(`Registered ${ this.routes.length } routes successfully!`);
    }

    middlewares() {
        this.app.use( cors() );
        this.app.use( express.json() ); 
        this.app.use( express.static('public') );
        // Load files
        this.app.use( fileUpload({
                useTempFiles : true,
                tempFileDir : '/tmp/'
            }) 
        );
    }

    async dbConn() {
        await dbConnection();
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Basic-rest-api listening on port ${ this.port }...`)
        });
    }

}

module.exports = Server;
