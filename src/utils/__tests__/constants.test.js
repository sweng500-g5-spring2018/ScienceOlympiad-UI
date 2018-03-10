//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';

//COMPONENT TO TEST
import constants from '../constants';

describe('Constants Utilities Class Tests', function () {

    beforeAll(function () {
        //STUB: Using JSDOM - if no localStorage, stub its functions
        if (!global.window.location) {
            global.window.location = {
                protocol: 'http'
            }
        }
    })

    // Test 1
    test('Should return use credentials header', () => {
        expect(constants.useCredentials()).to.deep.equal({withCredentials: true});
    })

    //Test 2
    test('Should return true if object empty and false if it is not', () => {
        let testEmpty = {};
        let testNonEmpty = {notEmpty: "something"};

        expect(constants.isEmpty(testEmpty)).to.be.true;
        expect(constants.isEmpty(testNonEmpty)).to.be.false;
    })

    //Test 3
    test('Should retrieve server URL in both dev and prod', () => {
        let currentENV = process.env.NODE_ENV;
        process.env.NODE_ENV = "production";
        expect(constants.getServerUrl()).to.equal('http://server.sweng500.com');

        process.env.NODE_ENV = "development";
        expect(constants.getServerUrl()).to.equal('http://localhost:8080');

        process.env.NODE_ENV = currentENV;
        expect(process.env.NODE_ENV).to.equal(currentENV);
    })
});