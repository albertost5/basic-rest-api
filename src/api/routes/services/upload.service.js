const { getBaseResponse } = require("../../../utils/response.util")

const uploadServiceSend = ( fileName ) => {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data.message = `${ fileName } was uploaded successfully!`;

    return baseResponse;
}

module.exports = {
    uploadServiceSend
}