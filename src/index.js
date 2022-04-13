const Server = require('./api/models/server');
const registry = require('./api/commons/registry.controller');


const server = new Server( registry );

server.listen();
