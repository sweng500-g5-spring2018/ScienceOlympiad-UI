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
                resolve({status: result.status, body: result.data});
            }).catch( function (error) {
                reject(errorHandler(error));
            })
        } else if (httpMethod.toLowerCase() === 'put') {
            axios.put(url, requestData, httpHeader).then( function (result) {
                resolve({status: result.status, body: result.data});
            }).catch( function (error) {
                reject(errorHandler(error));
            })
        } else if(httpMethod.toLowerCase() === 'post') {
            axios.post(url, requestData, httpHeader).then( function (result) {
                resolve({status: result.status, body: result.data});
            }).catch( function (error) {
                reject(errorHandler(error));
            })
        } else if(httpMethod.toLowerCase() === 'delete') {
            axios.delete(url, httpHeader).then( function (result) {
                resolve({status: result.status, body: result.data});
            }).catch( function (error) {
                reject(errorHandler(error));
            })
        } else {
            reject('ERROR: The requested HTTP method ' + httpMethod + ' is not supported');
        }
    });

    return promise;
}

function errorHandler(error) {
    if(error.response) {
        if(error.response.status && error.response.data) {
            return {status: error.response.status, message: error.response.data};
        }
    }

    console.log(error);
    //IMPLEMENT SOMETHING BETTER LATER
    return {status: 500, message: "SOMETHING BAD HAPPENED WITH RESPONSE FROM BACKEND."};
}
module.exports.httpRequest = httpRequest;