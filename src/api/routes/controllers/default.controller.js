const express = require('express');

class DefaultController {

    #router = new express.Router(); 

    registerRoutes() {
        this.#router.get('/hello-world', (req, res) => {
            res.json( 'Hello World!' );
        });

        this.#router.get('/queryParam', (req, res) => {
            res.json({
                data: req.query.q
            });
        });

        this.#router.get('/pathVariable/:q', (req, res) => {
            res.json({
                pathVariable: req.params.q
            });
        });

        this.#router.post('/hello-world', (req, res) => {
            if( req.body ) {
                res.json({
                    data: 'POST endpoint.'
                });
            } else {
                res.status('404').json({
                    error: 'Should send a request body.'
                });
            }
        });

        this.#router.put('/hello-world', (req, res) => {
            if( Object.keys(req.body).length !== 0 ) {
                res.json({
                    data: 'PUT endpoint.'
                });
            } else {
                res.status('404').json({
                    error: 'Should send a request body.'
                });
            }
        });

        this.#router.delete('/hello-world', (req, res) => {
            if( Object.keys(req.body).length !== 0 ) {
                res.json({
                    data: 'PUT endpoint.'
                });
            } else {
                res.status('404').json({
                    error: 'Should send a request body.'
                });
            }
        });


        return this.#router;
    }

}

module.exports = DefaultController;
