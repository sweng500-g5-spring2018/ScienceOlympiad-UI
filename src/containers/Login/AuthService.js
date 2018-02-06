
import constants from '../../utils/constants';
//import HttpRequest from '../../adapters/httpRequest';

export default class AuthService {

    constructor(domain) {
        this.domain = constants.getServerUrl();
        this.login = this.login.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
        this.logout = this.logout.bind(this);
    }


    login(username, password) {
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
        this.setToken('username='+username+'~role=TestUser~expiration=SOMEDATE');

        console.log(this.getToken());
    }

    isLoggedIn() {
        const token = this.getToken();
        return !!token;
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


    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return true
        } else {
            return false;
        }
    }
}
