const UserRoute = require("../routes/user.route");
const AuthRoute = require("../routes/auth.route");
const CategoryRoute = require("../routes/category.route");


const registryRoutes = new Array();
registryRoutes.push( new UserRoute(), new AuthRoute(), new CategoryRoute() );

module.exports = registryRoutes;