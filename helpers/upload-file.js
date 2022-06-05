const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { imgExtsAllowed } = require('../src/api/routes/types/extensions');
const { customErrorResponse } = require('../src/utils/error.util');

const uploadFileHelper = ( reqFiles,  fileExtsAllowedArr = imgExtsAllowed, folderName = '' ) => {

    return new Promise( ( resolve, reject )  => {

        // Get the file
        const { file } = reqFiles;

        // Get the extension file and check extensions allowed
        const fileArr = reqFiles.file.name.split('.');
        const FILE_EXTENSION = fileArr[ fileArr.length - 1 ].toLowerCase();
        
        if ( !fileExtsAllowedArr.includes( FILE_EXTENSION ) ) {
            return reject( 
                customErrorResponse('40000', 'BAD_REQUEST', `The extension file is not allowed. Extensions allowed: ${ fileExtsAllowedArr }.`) 
            );
        }

        // Create an unique file name (avoid the problem to upload files with the same name)
        const tempFileName = uuidv4() + '.' + FILE_EXTENSION;

        // Set the path to store the file
        let uploadPath = path.join( __dirname, '../uploads', folderName, tempFileName );

        console.log('upload path => ', uploadPath);
        const slashRegExp = new RegExp( '\\\\', 'g' );

        // Move the file to the path defined
        file.mv( uploadPath , (err) => {
            if (err) {
                return reject(
                    customErrorResponse('50000', 'INTERNAL_SERVER_ERROR', 'There was a problem uploading the file.')
                );
            }
            
            if( slashRegExp.test( uploadPath ) ) {
                uploadPath = uploadPath.replace( slashRegExp, '/' );
            }

            return resolve(
                tempFileName
            );
        });
    });

}

module.exports = {
    uploadFileHelper
}
