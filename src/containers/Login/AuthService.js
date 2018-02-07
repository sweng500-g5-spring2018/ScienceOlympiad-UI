import jwt from 'jwt-simple';
import moment from 'moment';


import constants from '../../utils/constants';
//import HttpRequest from '../../adapters/httpRequest';

export default class AuthService {

    constructor(domain) {
        this.domain = domain || constants.getServerUrl();
        this.login = this.login.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
        this.logout = this.logout.bind(this);

        //TODO: Stop faking security ;)
        this.secret = 'superGoodAuth';
    }


    login(username, password) {

        //TODO: We need to make an HTTP call here to the backend...
        //var body = {'username': username, 'password': password };
        //var _this = this;
        // _this.serverRequest = HttpRequest.httpRequest(this.domain + '/users', 'POST', null, body ).then(function (result) {
        //     console.log(result);
        //     if(this._checkStatus(result)) {
        //         console.log("authorized");
        //         this.setToken('username='+username+'~role=TestUser');
        //     } else {
        //         console.log("unauthorized");
        //     }
        // }).catch(function (error) {
        //     console.log(error);
        // })

        let toEncode = {
            username: username,
            role: 'Coach',
            expiration: moment().add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS')
        }

        var encoded = jwt.encode(toEncode, this.secret);

        this.setToken(encoded);
    }

    isLoggedIn() {
        const token = this.getToken();

        return !!token && !this.isTokenExpired(token);
    }

    getToken() {
        return localStorage.getItem('id_token');
    }

    setToken(idToken) {
        localStorage.setItem('id_token', idToken);
    }

    logout() {
        localStorage.removeItem('id_token');
    }

    isTokenExpired(token) {
        try {
            const decoded = jwt.decode(token, this.secret);
            if (moment(decoded.expiration).isBefore(moment())) { // Checking if token is expired.
                this.logout();
                return true;
            }
            else {
                return false;
            }
        }
        catch (err) {
            return false;
        }
    }


    //TODO: Use this later to check HTTP call status when hitting /login endpoint
    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return true
        } else {
            return false;
        }
    }
}
