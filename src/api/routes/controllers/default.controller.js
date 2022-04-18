const express = require('express');

class DefaultController {

    #router = new express.Router(); 

    registerRoutes() {
        this.#router.get('/hello-world', (req, res) => {

            res.json( 'Hello World!' );
        });

        this.#router.get('/queryParam', (req, res) => {

            const { q = "blank" } = req.query;

            res.json({
                q
            });
        });

        this.#router.get('/pathVariable/:id', (req, res) => {

            const params = req.params;
            res.json({
                id: params.id
            });
        });

        this.#router.post('/hello-world', (req, res) => {
            
            if( Object.keys( req.body ).length > 0 ) {
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
            res.status(201).json({
                data: 'OK'
            })
        });

        this.#router.delete('/hello-world', (req, res) => {
            res.status(201).json('DELETE endpoint')
        });


        return this.#router;
    }

}

module.exports = DefaultController;
