const { getBaseResponse } = require("../../../utils/response.util")

const uploadServiceSend = ( fileName ) => {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data.link = `${ fileName }`;

    return baseResponse;
}


const uploadServiceSendObj = ( object ) => {
    const baseResponse = getBaseResponse();
    baseResponse.contentType = 'application/json';
    baseResponse.data = object;

    return baseResponse;
}

module.exports = {
    uploadServiceSend,
    uploadServiceSendObj
}