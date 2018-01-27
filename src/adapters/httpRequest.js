/** http_request.js
 *
 * Wrapper for Axios library for making HTTP Requests.
 */

var axios = require('axios');

var emptyHeader = {};

function httpRequest(url, httpMethod, httpHeader, requestData) {
    if(httpHeader == null) httpHeader = emptyHeader;

    var promise = new Promise(function (resolve, reject) {

        if(httpMethod == null) {
            reject('ERROR: Must supply an HTTP Request.  Please try : GET, DELETE, PUT, POST.');
        }

        if(httpMethod.toLowerCase() === 'get') {
            axios.get(url, httpHeader).then( function (result) {
                resolve(result.data);
            }).catch( function (error) {
                reject('Failed [' + httpMethod.toUpperCase() + '] request.  Message: ' + error.message);
            })
        } else if (httpMethod.toLowerCase() === 'put') {
            axios.put(url, requestData, httpHeader).then( function (result) {
                resolve(result.data);
            }).catch( function (error) {
                reject('Failed [' + httpMethod.toUpperCase() + '] request.  Message: ' + error.message);
            })
        } else if(httpMethod.toLowerCase() === 'post') {
            axios.post(url, requestData, httpHeader).then( function (result) {
                resolve(result.data);
            }).catch( function (error) {
                reject('Failed [' + httpMethod.toUpperCase() + '] request.  Message: ' + error.message);
            })
        } else if(httpMethod.toLowerCase() === 'delete') {
            axios.delete(url, requestData, httpHeader).then( function (result) {
                resolve(result.data);
            }).catch( function (error) {
                reject('Failed [' + httpMethod.toUpperCase() + '] request.  Message: ' + error.message);
            })
        } else {
            reject('ERROR: The requested HTTP method ' + httpMethod + ' is not supported');
        }
    });

    return promise;
}

module.exports.httpRequest = httpRequest;