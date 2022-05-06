const AuthController = require("../routes/controllers/auth.controller");
const UserController = require("../routes/controllers/user.controller");


const registryControllers = new Array();
registryControllers.push( new UserController(), new AuthController() );

module.exports = registryControllers;