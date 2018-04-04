//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';

//COMPONENT TO TEST
import constants from '../validator';

describe('Validator Utility Tests', function () {

    beforeAll(function () {
        //STUB: Using JSDOM - if no localStorage, stub its functions
        if (!global.window.location) {
            global.window.location = {
                protocol: 'http'
            }
        }
    })

    var teams = {
        teamUndefined: undefined,
        teamTooShort: "asdf",
        teamImproperSyntax: "&^%asdfasdf",
        teamValid: "YAY ITS MY TEAM"
    };

    var emails = {
        emailUndefined: undefined,
        emailEmpty: "",
        badEmail: "ryan.com",
        badEmail2: "ryan@ryan",
        emailValid: "ryan@ryan.com"
    };

    // Test 1
    test('Should properly validate a team name', () => {
        expect(constants.validateTeamName(teams.teamUndefined).isValid).to.equal(false);
        expect(constants.validateTeamName(teams.teamTooShort).isValid).to.equal(false);
        expect(constants.validateTeamName(teams.teamImproperSyntax).isValid).to.equal(false);
        expect(constants.validateTeamName(teams.teamValid).isValid).to.equal(true);

    });

    //Test 2
    test('Should properly validate an email address', () => {
        expect(constants.validateEmail(emails.emailUndefined).isValid).to.equal(false);
        expect(constants.validateEmail(emails.emailEmpty).isValid).to.equal(false);
        expect(constants.validateEmail(emails.badEmail).isValid).to.equal(false);
        expect(constants.validateEmail(emails.badEmail2).isValid).to.equal(false);
        expect(constants.validateEmail(emails.emailValid).isValid).to.equal(true);


    })

});