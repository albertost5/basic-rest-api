const AuthController = require("../routes/controllers/auth.controller");
const CategoryController = require("../routes/controllers/category.controller");
const UserController = require("../routes/controllers/user.controller");


const registryControllers = new Array();
registryControllers.push( new UserController(), new AuthController(), new CategoryController() );

module.exports = registryControllers;