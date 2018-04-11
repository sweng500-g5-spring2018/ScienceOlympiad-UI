import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helper functions */
import helper from '../../../../test/helpers/helper';

/* Dependent Components */
import HttpRequest from '../../../adapters/httpRequest';
import constants from '../../../utils/constants';
import Card from '../../../components/Cards/Card.js';
import TextField from 'material-ui/TextField';
import {Grid, Col, Row, Modal} from 'react-bootstrap';
import NotificationSystem from 'react-notification-system';

/* Component under test */
import Buildings from "../Buildings"
import AuthService from "../../../utils/AuthService";
import RaisedButton from "material-ui/RaisedButton/index";
import Dialog from 'material-ui/Dialog';
import {Route} from "react-router-dom";

describe('Building Component Tests', function () {

    var sandbox;
    const notify = sinon.spy();
    const consoleSpy = sinon.spy();

    const data = require('../../../../test/data/buildings/getAllBuildingsResponseData.json');

    beforeAll( () => {
        console.log = consoleSpy;
        console.error = consoleSpy;
    })

    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach( () => {
        sandbox.restore();
    });

    // Test 1
    test('Should render buttons when data is fetched', async () => {

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(HttpRequest, 'httpRequest').resolves(data);
        sandbox.stub(constants, 'getServerUrl').returns("wow tests are stupid");

        const component = mount(<Buildings />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        HttpRequest.httpRequest.restore();
        expect(component.find(RaisedButton).length).to.equal(5);
    });

    // Test 2
    test('Should not render buttons when data is not fetched', async () => {

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(HttpRequest, 'httpRequest').rejects("crap");
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid");

        const component = mount(<Buildings />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton).length).to.equal(1);
    });
});