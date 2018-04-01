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
import {Modal} from 'react-bootstrap';
import Button from '../../../elements/CustomButton/CustomButton.js';

/* Component under test */
import UserProfile from '../UserProfile';
import AuthService from "../../../utils/AuthService";
import RaisedButton from "material-ui/RaisedButton/index";
import PasswordField from 'material-ui-password-field';

describe('User profile tests', function () {

    const notify = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            require('../../../../test/data/user/getUserResponseData')
        )
        //STUB: Constants function used as argument to HttpRequest
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid")
    })

    afterEach(function () {
        //Always unstub AuthService.isLoggedIn() in case we want it to return different values
        AuthService.isLoggedIn.restore();
        AuthService.getUserRole.restore();
    })

    // Test 1
    test('Should render text and password fields when data is fetched', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<UserProfile />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(TextField).length).to.equal(4);
        expect(component.find(PasswordField).length).to.equal(4);
    });

    // Test 2
    test('Test password validation function', async () => {

        var result = -1;

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<UserProfile />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        result = component.instance().validPassword("t");
        expect(result).to.equal(false);

        result = component.instance().validPassword("Password1");
        expect(result).to.equal(true);
    });

    // Test 3
    test('Try to update the users information without a password', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<UserProfile />);

        component.instance().notify = sinon.spy();

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Simulate clicking the form button
        expect(component.find(Button).at(0).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        console.log(component.instance().notify.getCall(0).args[0]);

        //expect(component.instance().addNotification.getCall(0).args[0]).to.equal("Enter your current password");
    });

});