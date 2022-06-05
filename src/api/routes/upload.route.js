const express = require('express');
const { check } = require('express-validator');
const { loadFile } = require('./controllers/upload.controller');


class UploadRoute {

    #router = new express.Router(); 
    #basePath = '/uploads';

    #postMiddlewares = [

    ];


    registerRoutes() {
        this.#router.post( this.#basePath, loadFile );

        return this.#router;
    }
}

module.exports = UploadRoute;