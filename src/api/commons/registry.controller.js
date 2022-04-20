const UserController = require("../routes/controllers/user.controller");


const registryControllers = new Array();
registryControllers.push( new UserController() );

module.exports = registryControllers;