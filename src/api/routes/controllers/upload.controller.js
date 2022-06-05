const { customErrorResponse } = require('../../../utils/error.util');
const path = require('path');

const loadFile = ( req, res ) => {

    // Check if there is a file to upload
    if ( !req.files || !req.files?.file || Object.keys(req.files).length === 0 ) {
        return res.status(400).json( customErrorResponse('40000', 'BAD_REQUEST', 'No files were uploaded.') );
    }

    // Get the file
    const { file } = req.files;
    // Set the path to store the file
    let uploadPath = path.join( __dirname, '../../../../uploads/', file.name );

    console.log('upload path => ', uploadPath);
    const slashRegExp = new RegExp( '\\\\', 'g' );

    // Move the file to the path defined
    file.mv( uploadPath , (err) => {
        if (err) {
            return res.status(500).json( customErrorResponse('50000', 'INTERNAL_SERVER_ERROR', 'There was a problem uploading the file.') );
        }
        
        if( slashRegExp.test( uploadPath ) ) {
            uploadPath = uploadPath.replace( slashRegExp, '/' );
        }

        return res.json({
            message: `File ${ file.name } uploaded to: ${ uploadPath }`
        })
    });
}

module.exports = {
    loadFile
}