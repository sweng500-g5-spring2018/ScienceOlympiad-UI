import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helper functions */
import helper from '../../../../test/helpers/helper';

/* Dependent Components */
import HttpRequest from '../../../adapters/httpRequest';
import constants from '../../../utils/constants';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import PasswordField from 'material-ui-password-field';
import Button from '../../../elements/CustomButton/CustomButton.js';
import NotificationSystem from 'react-notification-system';

/* Component under test */
import Extras from '../Extras';
import AuthService from "../../../utils/AuthService";
import MockAdapter from "axios-mock-adapter";
import axios from "axios/index";

describe('Extras Component Tests', function () {

    let axiosMock;
    let sandbox;
    var consoleSpy = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {
        //MOCK axios
        axiosMock = new MockAdapter(axios);

        //Ignore console logs
        console.log = consoleSpy;
    });

    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach( () => {
        sandbox.restore();
    });

    // Test 1
    test('Should render Extras component with appropriate children', async () => {
        const component = shallow(<Extras />);

        expect(component.find(MuiThemeProvider)).to.have.length(1);
        expect(component.find(TextField)).to.have.length(2);
        expect(component.find(Button)).to.have.length(2);

        component.instance().handleSelect("1");
        await helper.flushPromises();
        component.update();

        expect(component.state().activeKey).to.equal("1");
    });

    // Test 1
    test('Should render Extras component and successfully send email', async () => {

        axiosMock.onPost(constants.getServerUrl() + '/sweng500/sendTestEmail').reply(200, "YAY");

        const component = shallow(<Extras />);
        await helper.flushPromises();
        component.update();

        component.instance().setState({_notificationSystem: {addNotification: () => {} }});

        const textFields = component.find(TextField);

        expect(textFields.at(0).simulate('change', {}, "hello@hello.com"));

        await helper.flushPromises();
        component.update();

        const buttons = component.find(Button);

        expect(buttons.at(0).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().emailAddress).to.equal("");
    });

    // Test 1
    test('Should render Extras component and fail to send email', async () => {

        axiosMock.onPost(constants.getServerUrl() + '/sweng500/sendTestEmail').reply(400, "CRAP");

        const component = shallow(<Extras />);
        await helper.flushPromises();
        component.update();

        component.instance().setState({_notificationSystem: {addNotification: () => {} }});

        const textFields = component.find(TextField);

        expect(textFields.at(0).simulate('change', {}, "hello@hello.com"));

        await helper.flushPromises();
        component.update();

        const buttons = component.find(Button);

        expect(buttons.at(0).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().emailAddress).to.equal("hello@hello.com");
    });

    // Test 1
    test('Should render Extras component and successfully send text', async () => {

        axiosMock.onPost(constants.getServerUrl() + '/sweng500/sendTestText').reply(200, "YAY");

        const component = shallow(<Extras />);
        await helper.flushPromises();
        component.update();

        component.instance().setState({_notificationSystem: {addNotification: () => {} }});

        const textFields = component.find(TextField);

        expect(textFields.at(1).simulate('change', {}, "14127607291"));

        await helper.flushPromises();
        component.update();

        const buttons = component.find(Button);

        expect(buttons.at(1).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().phoneNumber).to.equal("");
    });

    // Test 1
    test('Should render Extras component and fail to send text', async () => {

        axiosMock.onPost(constants.getServerUrl() + '/sweng500/sendTestText').reply(400, "CRAP");

        const component = shallow(<Extras />);
        await helper.flushPromises();
        component.update();

        component.instance().setState({_notificationSystem: {addNotification: () => {} }});

        const textFields = component.find(TextField);

        expect(textFields.at(1).simulate('change', {}, "14127607291"));

        await helper.flushPromises();
        component.update();

        const buttons = component.find(Button);

        expect(buttons.at(1).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().phoneNumber).to.equal("14127607291");
    });

    test('Should render Extras with working notification system', async () => {

        const component = shallow(<Extras/>);

        await helper.flushPromises();
        component.update();

        //Renders children Components
        expect(component.find(NotificationSystem)).to.have.length(1);

        component.instance().setState({_notificationSystem: {addNotification: () => {} }});
        component.instance().notify("YO", "yo", "yo", 2);
        component.instance().notify("YO");
    });

});