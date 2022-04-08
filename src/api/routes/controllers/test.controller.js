const express = require('express');

class TestController {

    #router = new express.Router();

    registerRoutes() {
        this.#router.get('/test', (req, res) => {
            res.json('Response from testController.')
        });
        
        return this.#router;
    }
}

module.exports = TestController;
