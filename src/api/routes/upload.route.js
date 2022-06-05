const express = require('express');
const { uploadFile } = require('./controllers/upload.controller');


class UploadRoute {

    #router = new express.Router(); 
    #basePath = '/uploads';

    #postMiddlewares = [

    ];
    

    registerRoutes() {
        this.#router.post( this.#basePath, uploadFile );

        return this.#router;
    }
}

module.exports = UploadRoute;