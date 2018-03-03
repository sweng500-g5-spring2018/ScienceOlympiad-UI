import jwt from 'jwt-simple';
import moment from 'moment';

import constants from './constants';
import HttpRequest from '../adapters/httpRequest';

export default class AuthService {

    static login(username, password) {
        var promise = new Promise(function (resolve, reject) {
            var body = {};
            body.emailAddress = username;
            body.password = password;

            //var _this = this;
            HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/auth/login', 'POST', constants.useCredentials() , body ).then(function (result) {
                let toEncode = {
                    emailAddress: result.body.emailAddress,
                    role: result.body.role,
                    expiration: moment().add(20, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS')
                }

                var encoded = jwt.encode(toEncode, result.body.session);

                AuthService.setSession(result.body.session);
                AuthService.setToken(encoded);

                resolve({status: result.status, message: "Authorized", emailAddress: result.body.emailAddress});
            }).catch(function (error) {
                console.log(error);
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
                    AuthService.revokeAuth();
                    console.log(error);
                    resolve({status: error.status, message: error});
                })
            } else {
                AuthService.revokeAuth();
                resolve({status: 410, message: "Token is expired."});
            }
        });

        return promise;
    }

    static isLoggedIn() {
        return AuthService.isAuthorized();
    }

    static isAuthorized(isServerCall) {
        const token = AuthService.getToken();
        const session = AuthService.getSession();
        if (token && session) {
            try {
                var decoded = AuthService.decodeSessionVars();
                if (!decoded || moment(decoded.expiration).isBefore(moment())) { // Checking if token is expired.
                    AuthService.revokeAuth(true);
                    return false;
                }
                else {
                    if(isServerCall) {
                        AuthService.updateTimeStamp(decoded);
                    }

                    return true;
                }
            }
            catch (err) {
                AuthService.revokeAuth(true);
                return false;
            }
        } else {
            AuthService.revokeAuth();
            return false;
        }
    }

    static isUserRoleAllowed(listOfAllowedRoles) {
        if(listOfAllowedRoles && listOfAllowedRoles.length > 0){
            return listOfAllowedRoles.indexOf(AuthService.getUserRole()) > -1;
        }

        return true;
    }

    static revokeAuth(withAlert) {
        AuthService.revokeToken();
        AuthService.endSession();

        if(withAlert) {
            //DO SOMETHING BETTER THAN THIS
            alert("Your session has ended.  Please log back in to continue");
        }
    }

    static getUserRole() {
        let decoded = AuthService.decodeSessionVars();
        return (decoded && decoded.role) ? decoded.role : undefined;
    }

    static getUserEmail() {
        let decoded = AuthService.decodeSessionVars();
        return (decoded && decoded.emailAddress) ? decoded.emailAddress : undefined;
    }

    static decodeSessionVars() {
        const session = AuthService.getSession();
        const token = AuthService.getToken();

        if(token && session) {
            var sessionInfo = jwt.decode(token, session);
            return sessionInfo;
        } else {
            return undefined;
        }
    }

    static encodeAndSetToken(json) {
        try {
            localStorage.setItem('id_token', jwt.encode(json, AuthService.getSession()));
            return true;
        } catch (error) {
            return false;
        }
    }

    static updateTimeStamp(decoded) {
        decoded.timestamp = moment().add(20, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS');
        return AuthService.encodeAndSetToken(decoded);
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

}
