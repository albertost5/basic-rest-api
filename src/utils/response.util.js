function getBaseResponse() {
    const response = {
        status: 200,
        data: {},
        contentType: null,
    }
    
    return response;
}

function sendResponse( req, res, serviceResponse ) {
    res.contentType( 'application/json' );
    res.status( serviceResponse.status || 200).send( serviceResponse.data );
}

module.exports = { 
    getBaseResponse, 
    sendResponse
}
