const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { createServer } = require('http');
const fileUpload = require('express-fileupload');

const dbConnection = require('../../../db/config');
const { socketController } = require('../routes/controllers/socket.controller');


class Server {
    
    constructor( routes = [] ) {
        this.routes = routes;
        this.app = express();
        this.port = process.env.PORT || 3001;
        this.server = createServer( this.app );
        this.io = require('socket.io')(this.server);
        
        // Connection to DB
        this.dbConn();

        // Middlewares
        this.middlewares();
        
        // Initialize controllers
        this.initializeControllers();

        // Sockets
        this.sockets();
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
                tempFileDir : '/tmp/',
                createParentPath: true
            }) 
        );
    }

    async dbConn() {
        await dbConnection();
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log(`Basic-rest-api listening on port ${ this.port }...`)
        });
    }

    sockets() {
        this.io.on( 'connection', socketController ); 
    }

}

module.exports = Server;
