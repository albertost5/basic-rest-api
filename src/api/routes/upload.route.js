const express = require('express');
const { check } = require('express-validator');
const { checkCollections } = require('../../../helpers/checks');
const { checkErrors } = require('../../../middlewares/check-errors');
const { checkFile } = require('../../../middlewares/check-file');
const { uploadFile, updateFile, getFile } = require('./controllers/upload.controller');


class UploadRoute {

    #router = new express.Router(); 
    #basePath = '/uploads';

    #getMiddlewares = [
        check('id', 'Invalid id.').isMongoId(),
        check('collection').custom( c => checkCollections( c, ['users', 'products']) ),
        checkErrors
    ];

    #putMiddlewares = [
        checkFile,
        check('id', 'Invalid id.').isMongoId(),
        check('collection').custom( c => checkCollections( c, ['users', 'products']) ),
        checkErrors
    ];
    

    registerRoutes() {
        this.#router.get( this.#basePath + '/:collection/:id', this.#getMiddlewares, getFile ); 
        this.#router.post( this.#basePath, checkFile, uploadFile );
        this.#router.put( this.#basePath + '/:collection/:id', this.#putMiddlewares, updateFile );

        return this.#router;
    }
}

module.exports = UploadRoute;