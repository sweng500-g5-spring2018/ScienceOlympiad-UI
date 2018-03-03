/** http_request.js
 *
 * Wrapper for Axios library for making HTTP Requests and handling sessions
 */
import AuthService from '../utils/AuthService';
import axios from 'axios';
var emptyHeader = {};

axios.interceptors.response.use(response => {
    return response;
}, error => {
    var filteredErr = HttpRequest.errorHandler(error);
    return Promise.reject(filteredErr);
})


export default class HttpRequest {

    static httpRequest(url, httpMethod, httpHeader, requestData, needsSession = false) {
        if (httpHeader == null) httpHeader = emptyHeader;

        //IF request requires session, check if User is still Authorized
        //  and update timestamp if they are
        if (needsSession && !AuthService.isAuthorized(true)) {
            window.location = '/#/login';
        }

        var promise = new Promise(function (resolve, reject) {

            if (httpMethod == null) {
                reject('ERROR: Must supply an HTTP Request.  Please try : GET, DELETE, PUT, POST.');
            }

            if (httpMethod.toLowerCase() === 'get') {
                axios.get(url, httpHeader).then(function (result) {
                    resolve({status: result.status, body: result.data});
                }).catch(function (error) {
                    reject(error);
                })
            } else if (httpMethod.toLowerCase() === 'put') {
                axios.put(url, requestData, httpHeader).then(function (result) {
                    resolve({status: result.status, body: result.data});
                }).catch(function (error) {
                    reject(error);
                })
            } else if (httpMethod.toLowerCase() === 'post') {
                axios.post(url, requestData, httpHeader).then(function (result) {
                    resolve({status: result.status, body: result.data});
                }).catch(function (error) {
                    reject(error);
                })
            } else if (httpMethod.toLowerCase() === 'delete') {
                axios.delete(url, httpHeader).then(function (result) {
                    resolve({status: result.status, body: result.data});
                }).catch(function (error) {
                    reject(error);
                })
            } else {
                reject('ERROR: The requested HTTP method ' + httpMethod + ' is not supported');
            }
        });

        return promise;
    }

    static errorHandler(error) {
        var errResponse = {};
        errResponse.status = 500;

        if (error.response) {
            if (error.response.status === 401) {
                if(!error.response.data.includes("incorrect")) {
                    AuthService.revokeAuth(true);
                    window.location = '/#/login';
                }
            }

            if (error.response.status) {
                errResponse.status = error.response.status;
            }

            if (error.response.data) {
                errResponse.message = error.response.data;
            } else {
                errResponse.message = "SOMETHING BAD HAPPENED WITH RESPONSE FROM BACKEND.";
            }
        } else {
            errResponse.message = "SOMETHING BAD HAPPENED WITH RESPONSE FROM BACKEND: " + error;
        }

        return errResponse;
    }
}
