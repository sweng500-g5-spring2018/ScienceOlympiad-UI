import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';

/* Test Helper functions */
// import helper from '../../../../test/helpers/helper';

/* Dependent Components */
import HttpRequest from '../../adapters/httpRequest';
import constants from '../../utils/constants';
import jwt from 'jwt-simple';

/* Component under test */
import AuthService from "../AuthService";

describe('Auth Service Utilities Class Tests', function () {

    var token = "token12345";
    var sessionId = "session12345";
    var initialExpire = "2018-03-08T15:37:40.347";
    var updatedExpire = "2018-03-08T15:57:40.347";
    var decodedSession = {emailAddress: "test@sweng500.com", role: "TEST", expiration: "2018-03-08T15:37:40.347"}

    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            "YO"
            // require('../../../../test/data/schools/getAllSchoolsResponseData.json')
        )

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
    test('Should successfully set and revoke a token in localStorage', () => {
        expect(AuthService.getToken()).to.be.undefined;

        AuthService.setToken(token);

        expect(AuthService.getToken()).to.equal(token);

        AuthService.revokeToken();

        expect(AuthService.getToken()).to.be.undefined;
    });

    // Test 2
    test('Should successfully get and end a session in localStorage', () => {
        expect(AuthService.getSession()).to.be.undefined;

        AuthService.setSession(sessionId);

        expect(AuthService.getSession()).to.equal(sessionId);

        AuthService.endSession();

        expect(AuthService.getSession()).to.be.undefined;
    });

    // Test 3
    test('Should successfully decode session variables', () => {
        AuthService.setToken(token);
        AuthService.setSession(sessionId);

        var decoded = AuthService.decodeSessionVars();

        expect(decoded).to.deep.equal(decodedSession);
    });

    // Test 4
    test('Should successfully decode update the time stamp by 20 minutes', () => {
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
});