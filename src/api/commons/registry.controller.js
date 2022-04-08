const DefaultController = require("../routes/controllers/default.controller");
const TestController = require("../routes/controllers/test.controller");


const registryControllers = new Array();
registryControllers.push( new DefaultController(), new TestController() );

module.exports = registryControllers;