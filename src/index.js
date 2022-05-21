const Server = require('./api/models/server');
const registry = require('./api/commons/registry.routes');


const server = new Server( registry );

server.listen();
