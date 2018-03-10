import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';

/* Test Helper functions */
import helper from '../../../test/helpers/helper';

/* Dependent Components */
import HttpRequest from '../../adapters/httpRequest';
import constants from '../../utils/constants';
import jwt from 'jwt-simple';
import moment from 'moment';

/* Component under test */
import AuthService from "../AuthService";

describe('Auth Service Utilities Class Tests', function () {

    var token = "token12345";
    var sessionId = "session12345";
    var initialExpire = "2018-03-08T15:37:40.347";
    var updatedExpire = "2018-03-08T15:57:40.347";
    var decodedSession = {emailAddress: "test@sweng500.com", role: "TEST", expiration: "2018-03-08T15:37:40.347"}
    var httpHappyResponse = {status: 200, body: "YAY you did it"};
    var httpSadResponse = {status: 999, message: "Life sucks"};
    var httpLogin = {
        status: 200,
        body: {
            emailAddress: decodedSession.emailAddress,
            role: decodedSession.role,
            session: sessionId
        }
    }

    //Set up Global Spy
    const alertSpy = sinon.spy();
    const consoleSpy = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Alerts and Console.log
        window.alert = alertSpy;

        //STUB: Constants function used as argument to HttpRequest
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid");
        sinon.stub(constants, 'useCredentials').returns("wow tests are stupid");

        //STUB: JWT
        sinon.stub(jwt, 'decode').returns(decodedSession);
        sinon.stub(jwt, 'encode').callsFake( (json, session) => {
            decodedSession.expiration = updatedExpire;
            return decodedSession;
        });

        //STUB: Using JSDOM - if no localStorage, stub its functions
        if (!global.window.localStorage) {
            global.window.myTestItems = {};
            global.window.localStorage = {
                getItem(item) { return global.window.myTestItems[item] },
                setItem(key, value) { global.window.myTestItems[key] = value; },
                removeItem(key) { delete global.window.myTestItems[key]; }
            };
        }
    })

    //BEFORE EACH: Reset volatile test objects
    beforeEach(function () {
        global.window.myTestItems = {};
        decodedSession = {emailAddress: "test@sweng500.com", role: "TEST", expiration: "2018-03-08T15:37:40.347"}
    })

    // Test 1
    test('Should set and revoke a token in localStorage', () => {
        expect(AuthService.getToken()).to.be.undefined;

        AuthService.setToken(token);

        expect(AuthService.getToken()).to.equal(token);

        AuthService.revokeToken();

        expect(AuthService.getToken()).to.be.undefined;
    });

    // Test 2
    test('Should get and end a session in localStorage', () => {
        expect(AuthService.getSession()).to.be.undefined;

        AuthService.setSession(sessionId);

        expect(AuthService.getSession()).to.equal(sessionId);

        AuthService.endSession();

        expect(AuthService.getSession()).to.be.undefined;
    });

    // Test 3
    test('Should decode session variables', () => {
        AuthService.setToken(token);
        AuthService.setSession(sessionId);

        var decoded = AuthService.decodeSessionVars();

        expect(decoded).to.deep.equal(decodedSession);

        global.window.myTestItems = {};

        expect(AuthService.decodeSessionVars()).to.be.undefined;
    });

    // Test 4
    test('Should decode update the time stamp by 20 minutes', () => {
        AuthService.setToken(token);
        AuthService.setSession(sessionId);

        expect(decodedSession.expiration).to.equal(initialExpire);

        let returnValue = AuthService.updateTimeStamp(decodedSession);

        expect(returnValue).to.equal(true);

        let decoded = AuthService.getToken();

        expect(decoded).to.not.be.undefined;
        expect(decoded.expiration).to.not.be.undefined;
        expect(decoded.expiration).to.equal(updatedExpire);
    });

    // Test 5
    test('Should decode User Email and User Role', () => {
        AuthService.setToken(token);
        AuthService.setSession(sessionId);

        expect(AuthService.getUserRole()).to.equal(decodedSession.role);
        expect(AuthService.getUserEmail()).to.equal(decodedSession.emailAddress);

        global.window.myTestItems = {};
        expect(AuthService.getUserEmail()).to.be.undefined;
        expect(AuthService.getUserRole()).to.be.undefined;

    });

    // Test 6
    test('Should revoke Authorization with and without alert', () => {
        AuthService.setToken(token);
        AuthService.setSession(sessionId);

        expect(global.window.myTestItems['id_token']).to.not.be.undefined;
        expect(global.window.myTestItems['blob']).to.not.be.undefined;

        AuthService.revokeAuth(true);

        expect(global.window.myTestItems['id_token']).to.be.undefined;
        expect(global.window.myTestItems['blob']).to.be.undefined;
        expect(alertSpy.called).to.be.true;

        alertSpy.resetHistory();
        expect(alertSpy.called).to.be.false;

        AuthService.revokeAuth();
        expect(alertSpy.called).to.be.false;
    });

    // Test 7
    test('Should return true when Authorized User Role is allowed and false when they are not', () => {
        AuthService.setToken(token);
        AuthService.setSession(sessionId);

        expect(global.window.myTestItems['id_token']).to.not.be.undefined;
        expect(global.window.myTestItems['blob']).to.not.be.undefined;

        expect(AuthService.isUserRoleAllowed(["ADMIN", "COACH"])).to.be.false;
        expect(AuthService.isUserRoleAllowed(["TEST", "COACH"])).to.be.true;
        expect(AuthService.isUserRoleAllowed()).to.be.true;
    });

    // Test 8
    test('Should return true when user is Authorized (has token/session and within expiration timestamp)', () => {
        AuthService.setToken(token);
        AuthService.setSession(sessionId);

        expect(global.window.myTestItems['id_token']).to.not.be.undefined;
        expect(global.window.myTestItems['blob']).to.not.be.undefined;

        expect(AuthService.isAuthorized()).to.be.false;

        expect(alertSpy.called).to.be.true;
        alertSpy.resetHistory();

        expect(AuthService.isAuthorized()).to.be.false;
        expect(alertSpy.called).to.be.false;

        decodedSession.expiration = moment().add(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS');
        AuthService.setToken(token);
        AuthService.setSession(sessionId);

        jwt.decode.restore();
        sinon.stub(jwt, 'decode').returns(decodedSession);
        expect(AuthService.isLoggedIn()).to.be.true;

        expect(AuthService.isAuthorized(true)).to.be.true;
    });

    // Test 9
    test('Should log a user out', () => {
        console.log = consoleSpy;

        AuthService.setToken(token);
        AuthService.setSession(sessionId);

        expect(global.window.myTestItems['id_token']).to.not.be.undefined;
        expect(global.window.myTestItems['blob']).to.not.be.undefined;

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            httpHappyResponse
        );

        AuthService.logout().then(function (result) {
            expect(result.status).to.equal(httpHappyResponse.status);
            expect(result.message).to.equal(httpHappyResponse.body);
            expect(global.window.myTestItems['id_token']).to.be.undefined;
            expect(global.window.myTestItems['blob']).to.be.undefined;

            AuthService.logout().then(function(result) {
                expect(result).to.deep.equal({status: 410, message: "Token is expired."});

                expect(consoleSpy.called).to.be.true;

                HttpRequest.httpRequest.restore();

                AuthService.setToken(token);
                AuthService.setSession(sessionId);

                sinon.stub(HttpRequest, 'httpRequest').rejects(
                    httpSadResponse
                );

                AuthService.logout().then(function (result) {
                    expect(result).to.deep.equal(httpSadResponse);
                    HttpRequest.httpRequest.restore();
                })
            });
        }).catch(function (error) {
            expect(error).to.be.undefined;
        });
    });

    // Test 10
    test('Should log a user in', () => {

        expect(global.window.myTestItems['id_token']).to.be.undefined;
        expect(global.window.myTestItems['blob']).to.be.undefined;

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            httpLogin
        );

        AuthService.login("dummy","dummy").then(function (result) {
            expect(result.status).to.equal(httpHappyResponse.status);
            expect(result.message).to.equal("Authorized");
            expect(result.emailAddress).to.equal(httpLogin.body.emailAddress);

            expect(global.window.myTestItems['id_token']).to.not.be.undefined;
            expect(global.window.myTestItems['blob']).to.not.be.undefined;

            expect(global.window.myTestItems['blob']).to.equal(sessionId);
            expect(global.window.myTestItems['id_token'].emailAddress).to.equal(decodedSession.emailAddress);

            HttpRequest.httpRequest.restore();
            sinon.stub(HttpRequest, 'httpRequest').rejects(
                httpSadResponse
            );

            AuthService.login("dummy", "dummy").then(function () {
                expect(result).to.be.undefined;
            }).catch(function (error) {
                expect(error).to.deep.equal(httpSadResponse);
            })
        }).catch(function (error) {
            expect(error).to.be.undefined;
        });
    });
});