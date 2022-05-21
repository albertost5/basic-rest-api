// const AuthController = require("../routes/controllers/auth.controller");
// const CategoryController = require("../routes/controllers/category.controller");

const UserRoute = require("../routes/user.route");



const registryRoutes = new Array();
registryRoutes.push( new UserRoute() );

module.exports = registryRoutes;