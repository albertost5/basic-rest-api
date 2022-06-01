const express = require('express');
const { check } = require('express-validator')
const { findBy } = require('./controllers/find.controller');

class FindRoute {
    #router = new express.Router();
    #basePath = '/find';
    

    registerRoutes() {
        this.#router.get( this.#basePath + '/:collection/:term', findBy ); 

        return this.#router;
    }
}


module.exports = FindRoute;