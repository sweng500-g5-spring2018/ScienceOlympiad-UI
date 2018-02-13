import jwt from 'jwt-simple';
import moment from 'moment';

import constants from '../../utils/constants';
import HttpRequest from '../../adapters/httpRequest';

export default class AuthService {

    static login(username, password) {
        var promise = new Promise(function (resolve, reject) {
            var body = {};
            body.emailAddress = username;
            body.password = password;

            //var _this = this;
            HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/auth/login', 'POST', constants.useCredentials() , body ).then(function (result) {
                console.log(result);

                console.log("" + username + " " + password);
                let toEncode = {
                    emailAddress: result.body.emailAddress,
                    role: result.body.role,
                    expiration: moment().add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS')
                }

                console.log(toEncode);
                var encoded = jwt.encode(toEncode, result.body.session);

                AuthService.setSession(result.body.session);
                AuthService.setToken(encoded);

                console.log("finished promise success");
                resolve({status: result.status, message: "Authorized", emailAddress: result.body.emailAddress});
            }).catch(function (error) {
                console.log(error);

                console.log("finished promise failed");
                reject(error);
            })
        });

        return promise;
    }

    static logout() {
        var promise = new Promise(function (resolve, reject) {
            var body = {};

            const token = AuthService.getToken();
            const session = AuthService.getSession();
            if(token && session) {

                body.emailAddress = jwt.decode(token, session).emailAddress;

                HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/auth/logout', 'POST', constants.useCredentials(), body ).then(function (result) {
                    console.log(result);
                    AuthService.revokeAuth();

                    resolve({status: result.status, message: result.body});
                }).catch(function (error) {
                    console.log(error);
                    reject({status: error.status, message: error});
                })
            } else {
                reject({status: 410, message: "Token is expired."});
            }
        });

        return promise;
    }

    static isLoggedIn() {
        return AuthService.isAuthorized();
    }

    static isAuthorized() {
        const token = AuthService.getToken();
        const session = AuthService.getSession();
        if (token && session) {
            try {
                const decoded = jwt.decode(token, session);
                if (moment(decoded.expiration).isBefore(moment())) { // Checking if token is expired.
                    AuthService.revokeAuth();
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (err) {
                AuthService.revokeAuth();
                return false;
            }
        } else {
            if(session) AuthService.endSession();
            if(token) AuthService.revokeToken();

            return false;
        }
    }

    static setSession(session) {
        localStorage.setItem('blob', session);
    }

    static getSession() {
        return localStorage.getItem('blob');
    }

    static endSession() {
        localStorage.removeItem('blob');
    }

    static getToken() {
        return localStorage.getItem('id_token');
    }

    static setToken(idToken) {
        localStorage.setItem('id_token', idToken);
    }

    static revokeToken() {
        localStorage.removeItem('id_token');
    }

    static revokeAuth() {
        AuthService.revokeToken();
        AuthService.endSession();
    }
}
