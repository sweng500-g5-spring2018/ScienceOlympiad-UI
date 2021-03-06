import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helper functions */
import helper from '../../../../test/helpers/helper';

/* Dependent Components */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import constants from '../../../utils/constants';

/* Component under test */
import Forgot from '../Forgot';
import AuthService from "../../../utils/AuthService";
import PasswordField from "material-ui-password-field";

describe('School Component Tests', function () {

    const notify = sinon.spy();
    var axiosMock;

    //Set up test data before running any tests
    beforeAll(function () {

        //MOCK axios
        axiosMock = new MockAdapter(axios);

    })

    afterEach(function () {
        //Always unstub AuthService.isLoggedIn() in case we want it to return different values
        AuthService.isLoggedIn.restore();
    })

    // Test 1
    test('Test to see if components are rendered', async () => {

        sinon.stub(AuthService, 'isLoggedIn').returns(false);

        const component = shallow(<Forgot notify={notify}/>);

        expect(component.find(MuiThemeProvider)).to.have.length(1);
        expect(component.find(TextField)).to.have.length(1);
        expect(component.find(RaisedButton)).to.have.length(1);
    });

    // Test 2
    test('Test for valid input detection', async () => {

        sinon.stub(AuthService, 'isLoggedIn').returns(false);

        const component = shallow(<Forgot notify={notify}/>);

        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        expect(component.state().emailRequired).to.equal("An email address is required.");
    });

    // Test 3
    // test('Test redirect if the user is logged in', async () => {
    //
    //     sinon.stub(AuthService, 'isLoggedIn').returns(true);
    //
    //     const component = shallow(<Forgot notify={notify}/>);
    //
    //     expect(component.state().redirect).to.equal(true);
    // });


    // Test 4
    test('Test an email address', async () => {
        axiosMock.onPost(constants.getServerUrl() + '/sweng500/resetPassword').reply(200, "YAY");

        sinon.stub(AuthService, 'isLoggedIn').returns(false);

        const component = shallow(<Forgot notify={notify}/>);
        component.state().email = "test@test.com";

        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().emailRequired).to.equal(null);
    });

    // Test 5
    test('Test an email address fails because it exists', async () => {
        axiosMock.onPost(constants.getServerUrl() + '/sweng500/resetPassword').reply(400, "CRAP");

        sinon.stub(AuthService, 'isLoggedIn').returns(false);

        const component = shallow(<Forgot notify={notify}/>);
        component.state().email = "test@test.com";

        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().emailRequired).to.not.equal(null);
    });

    // test 6
    test('Should update state of emailAddress onChange of TextField', async () => {
        //STUB: console logs in component and spy on them if called
        const consoleSpy = sinon.spy();
        console.log = consoleSpy;

        //STUB: AuthService methods being run
        sinon.stub(AuthService, 'isLoggedIn').returns(false);

        //RENDER component
        const component = shallow(<Forgot notify = {notify}/>);

        //FIND children components being rendered
        var textField = component.find(TextField);

        //CHECK components found & simulate on change event
        expect(textField).to.have.length(1);
        expect(textField.simulate('change', {target: {value: 'name={"email"}'}}, 'test@test.com'));

        //FLUSH promises and update component
        await helper.flushPromises();
        component.update();

        //CHECK that state has been successfully changed based on the simulated onchange events
        expect(component.state().emailRequired).to.equal(undefined);
        expect(component.state().email).to.equal('test@test.com');

        //CHECK that simulate on click of submit button is successful
        expect(component.find(RaisedButton).simulate('click', {preventDefault: () => {}}));
    });

});