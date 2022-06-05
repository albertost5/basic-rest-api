const { customErrorResponse } = require('../../../utils/error.util');
const { uploadFileHelper } = require('../../../../helpers/upload-file');

const uploadFile = async( req, res ) => {

    // Check if there is a file to upload
    if ( !req.files || !req.files?.file || Object.keys(req.files).length === 0 ) {
        return res.status(400).json( customErrorResponse('40001', 'BAD_REQUEST', 'No files were uploaded.') );
    }

    try {
        const fileName = await uploadFileHelper( req.files, undefined, 'imgs' );
        return res.json({
            message: `${ fileName } was uploaded successfully!`
        });
    } catch (error) {
        const statusCode = error.code.slice( 0, 3 );
        return res.status( statusCode ).json( error );
    }
    
}

module.exports = {
    uploadFile
}