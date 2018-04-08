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

    const notify = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            require('../../../../test/data/buildings/getAllBuildingsResponseData.json')
        )
        //STUB: Constants function used as argument to HttpRequest
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid")
    })

    afterEach(function () {
        //Always unstub AuthService.isLoggedIn() in case we want it to return different values
        AuthService.isLoggedIn.restore();
    })

    // Test 1
    test('Should render buttons when data is fetched', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = mount(<Buildings />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton).length).to.equal(5);
    });

    // Test 2
    test('Should not render buttons when data is not fetched', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        HttpRequest.httpRequest.restore();

        const component = mount(<Buildings />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton).length).to.equal(1);
    });
});