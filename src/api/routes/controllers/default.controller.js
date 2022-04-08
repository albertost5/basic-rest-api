const express = require('express');

class DefaultController {

    #router = new express.Router(); 

    registerRoutes() {
        this.#router.get('/hello-world', (req, res) => {
            res.json('Hello world from defaultController.');
        });

        return this.#router;
    }

}

module.exports = DefaultController;
