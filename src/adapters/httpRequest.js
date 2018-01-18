/** http_request.js
 *
 * Wrapper for Axios library for making HTTP Requests.
 */

var axios = require('axios');

var emptyHeader = {};

function httpRequest(url, httpMethod, httpHeader, requestData) {
    if(httpHeader == null) httpHeader = emptyHeader;

    var promise = new Promise(function (resolve, reject) {
        var returnJson = {};

        if(httpMethod.toLowerCase() === 'get') {
            axios.get(url, httpHeader).then( function (result) {
                resolve(result.data);
            }).catch( function (error) {
                reject('Failed [' + httpMethod.toUpperCase() + '] request.  Message: ' + error.message);
            })
        } else {
            resolve(returnJson);
        }
    });

    return promise;
}

module.exports.httpRequest = httpRequest;