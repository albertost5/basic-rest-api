class AbstractController {

    __sendResponse ( req, res, controllerResponse ) {
        res.type( 'application/json' );
        res.status( controllerResponse.status || 200 ).send( controllerResponse.data );
    }
}

module.exports = {
    AbstractController
}