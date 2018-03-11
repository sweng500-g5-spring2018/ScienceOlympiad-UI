import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';

/* Test Helper functions */
import MockAdapter from 'axios-mock-adapter';

/* Dependent Components */
import axios from 'axios';

/* Component under test */
import HttpRequest from "../httpRequest";
import AuthService from "../../utils/AuthService";

describe('HttpRequest Adapter Class Tests', function () {

    //Set up responses
    const happyResponse = {status: 200, data: "Happy Response"};
    const unhappyResponse = {response: {status: 404, data: "Not Found"}};

    //Set up Sandbox and Axios Mocker
    var sandbox;
    var axiosMock;

    //Set up test data before running any tests
    beforeAll( () => {
        //MOCK: Axios Library request returns
        axiosMock = new MockAdapter(axios);
    })

    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    })

    afterEach( () => {
        sandbox.restore();
    })

    // Test 1
    test('Should reject HttpRequest because unsupported method or if one was not supplied', () => {
        HttpRequest.httpRequest("http://dummy.com", "FAIL", {}, null).then(function (result) {
            expect(result).to.be.undefined;
        }).catch(function (error) {
            expect(error).to.not.be.undefined;
            expect(error).to.contain("not supported");

            HttpRequest.httpRequest("http://dummy.com").then(function (result) {
                expect(result).to.be.undefined;
            }).catch(function (error) {
                expect(error).to.not.be.undefined;
                expect(error).to.contain("Must supply an HTTP Request");
            })
        })
    });

    // Test 2
    test('Should reject HttpRequest and set window.location because unauthorized', () => {
        //STUB: AuthService
        sandbox.stub(AuthService, 'isAuthorized').returns(false);

        HttpRequest.httpRequest("http://dummy.com", "GET", {}, null, true).then(function (result) {
            expect(result).to.be.undefined;
        }).catch(function (error) {
            expect(error).to.not.be.undefined;
            expect(error).to.contain("Must be an authorized user");
        })
    });

    // Test 3
    test('Should send Axios GET request successfully for authorized user when session required', () => {
        //STUB: AuthService
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        //STUB: axios.get() return
        axiosMock.onGet('http://dummy.com').reply(happyResponse.status, happyResponse.data);

        HttpRequest.httpRequest("http://dummy.com", "GET", null, null, true).then(function (result) {
            expect(result).to.not.be.undefined;
            expect(result.status).to.equal(happyResponse.status);
            expect(result.body).to.equal(happyResponse.data);
        })
    });

    // Test 4
    test('Should send Axios GET request and return a 404 Not Found error', () => {
        //STUB: AuthService
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        //STUB: axios.get() return
        axiosMock.onGet('http://dummy.com').reply(unhappyResponse.response.status, unhappyResponse.response.data);

        HttpRequest.httpRequest("http://dummy.com", "GET", null, null, true).then(function (result) {
            expect(result).to.be.undefined;
        }).catch(function (error) {
            expect(error).to.not.be.undefined;
            expect(error.status).to.equal(unhappyResponse.response.status);
            expect(error.message).to.equal(unhappyResponse.response.data);
        })
    });

    // Test 5
    test('Should send Axios GET request and return 401 error through interceptor that does not try to revokeAuth', () => {
        //STUB: AuthService
        sandbox.stub(AuthService, 'isAuthorized').returns(true);
        sandbox.stub(AuthService, 'revokeAuth').returns(true);

        axiosMock.onGet('http://dummy.com').reply(401, "Unauthorized");

        HttpRequest.httpRequest("http://dummy.com", "GET", null, null, true).then(function (result) {
            expect(result).to.be.undefined;
        }).catch(function (error) {
            expect(error).to.not.be.undefined;
            expect(error.status).to.equal(401);
            expect(error.message).to.equal("Unauthorized");
        })
    });

    // Test 6
    test('Should send Axios PUT request successfully for authorized user when session required', () => {
        //STUB: AuthService
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        //STUB: axios.put() return
        axiosMock.onPut('http://dummy.com').reply(happyResponse.status, happyResponse.data);

        HttpRequest.httpRequest("http://dummy.com", "PUT", null, {}, true).then(function (result) {
            expect(result).to.not.be.undefined;
            expect(result.status).to.equal(happyResponse.status);
            expect(result.body).to.equal(happyResponse.data);
        })
    });

    // Test 7
    test('Should send Axios PUT request and return a 404 Not Found error', () => {
        //STUB: AuthService
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        //STUB: axios.put() return
        axiosMock.onPut('http://dummy.com').reply(unhappyResponse.response.status, unhappyResponse.response.data);

        HttpRequest.httpRequest("http://dummy.com", "PUT", null, {}, true).then(function (result) {
            expect(result).to.be.undefined;
        }).catch(function (error) {
            expect(error).to.not.be.undefined;
            expect(error.status).to.equal(unhappyResponse.response.status);
            expect(error.message).to.equal(unhappyResponse.response.data);
        })
    });

    // Test 8
    test('Should send Axios POST request successfully for authorized user when session required', () => {
        //STUB: AuthService
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        //STUB: axios.post() return
        axiosMock.onPost('http://dummy.com').reply(happyResponse.status, happyResponse.data);

        HttpRequest.httpRequest("http://dummy.com", "POST", null, {}, true).then(function (result) {
            expect(result).to.not.be.undefined;
            expect(result.status).to.equal(happyResponse.status);
            expect(result.body).to.equal(happyResponse.data);
        })
    });

    // Test 9
    test('Should send Axios POST request and return a 404 Not Found error', () => {
        //STUB: AuthService
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        //STUB: axios.post() return
        axiosMock.onPost('http://dummy.com').reply(unhappyResponse.response.status, unhappyResponse.response.data);

        HttpRequest.httpRequest("http://dummy.com", "POST", null, {}, true).then(function (result) {
            expect(result).to.be.undefined;
        }).catch(function (error) {
            expect(error).to.not.be.undefined;
            expect(error.status).to.equal(unhappyResponse.response.status);
            expect(error.message).to.equal(unhappyResponse.response.data);
        })
    });

    // Test 10
    test('Should send Axios DELETE request successfully for authorized user when session required', () => {
        //STUB: AuthService
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        //STUB: axios.delete() return
        axiosMock.onDelete('http://dummy.com').reply(happyResponse.status, happyResponse.data);

        HttpRequest.httpRequest("http://dummy.com", "DELETE", null, null, true).then(function (result) {
            expect(result).to.not.be.undefined;
            expect(result.status).to.equal(happyResponse.status);
            expect(result.body).to.equal(happyResponse.data);
        })
    });

    // Test 11
    test('Should send Axios DELETE request and return a 404 Not Found error', () => {
        //STUB: AuthService
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        //STUB: axios.delete() return
        axiosMock.onDelete('http://dummy.com').reply(unhappyResponse.response.status, unhappyResponse.response.data);

        HttpRequest.httpRequest("http://dummy.com", "DELETE", null, null, true).then(function (result) {
            expect(result).to.be.undefined;
        }).catch(function (error) {
            expect(error).to.not.be.undefined;
            expect(error.status).to.equal(unhappyResponse.response.status);
            expect(error.message).to.equal(unhappyResponse.response.data);
        })
    });

    // Test 12
    test('Should provide appropriate error responses from HttpRequest.errorHandler()', () => {
        //STUB: AuthService
        let myAuthStub = sandbox.stub(AuthService, 'revokeAuth').returns(true);

        let err1 = {};
        let err2 = {response: {}};
        let err3 = {response: {status:999, data: "you got 999"}};
        let err4 = {response: {status: 401, data: "incorrect username or password"}};
        let err5 = {response: {status: 401, data: "unauthorized"}};

        let err1Return = HttpRequest.errorHandler(err1);
            expect(err1Return.status).to.equal(500);
            expect(err1Return.message).to.contain("SOMETHING BAD HAPPENED");
            expect(myAuthStub.called).to.be.false;

        let err2Return = HttpRequest.errorHandler(err2);
            expect(err2Return.status).to.equal(500);
            expect(err1Return.message).to.contain("SOMETHING BAD HAPPENED");
            expect(myAuthStub.called).to.be.false;

        let err3Return = HttpRequest.errorHandler(err3);
            expect(err3Return.status).to.equal(err3.response.status);
            expect(err3Return.message).to.equal(err3.response.data);
            expect(myAuthStub.called).to.be.false;

        let err4Return = HttpRequest.errorHandler(err4);
            expect(err4Return.status).to.equal(err4.response.status);
            expect(err4Return.message).to.equal(err4.response.data);
            expect(myAuthStub.called).to.be.false;

        let err5Return = HttpRequest.errorHandler(err5);
            expect(err5Return.status).to.equal(err5.response.status);
            expect(err5Return.message).to.equal(err5.response.data);
            expect(myAuthStub.called).to.be.true;
    });
});