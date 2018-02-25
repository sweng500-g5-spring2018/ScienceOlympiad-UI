import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helper functions */
import helper from '../../../test/helpers/helper';

/* Dependent Components */
import HttpRequest from '../../adapters/httpRequest';
import constants from '../../utils/constants';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import PasswordField from 'material-ui-password-field';

/* Component under test */
import Signup from './Signup';

describe('School Component Tests', function () {

    const notify = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            require('../../../test/data/schools/getAllSchoolsResponseData.json')
        )

        //STUB: Constants function used as argument to HttpRequest
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid");
    })


    // Test 1
    test('Render components', async () => {
        const component = shallow(<Signup notify = {notify}/>);

        expect(component.find(MuiThemeProvider)).to.have.length(1);
        expect(component.find(TextField)).to.have.length(4);
        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(FlatButton)).to.have.length(1);
        expect(component.find(FlatButton)).to.have.length(1);
        expect(component.find(PasswordField)).to.have.length(2);
    });

    // Test 2
    test('Test for input validation on signup page 1', async () => {
        const component = shallow(<Signup notify = {notify}/>);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        expect(component.state().firstNameRequired).to.equal("First name is required.");
        expect(component.state().lastNameRequired).to.equal("Last name is required.");
        expect(component.state().phoneNumberRequired).to.equal("A phone number is required.");
        expect(component.state().emailAddressRequired).to.equal("An email address is required.");
    });

    // Test 3
    test('Test for an invalid email address', async () => {
        const component = shallow(<Signup notify = {notify}/>);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.instance().setState({emailAddress: "badAddress.com"})

        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        expect(component.state().emailAddressRequired).to.equal("A valid email address is required.");
    });

    // Test 4
    test('Test valid school district selection', async () => {

        const component = shallow(<Signup  notify = {notify}/>);

        component.instance().setState({firstName: "John"})
        component.instance().setState({lastName: "Doe"})
        component.instance().setState({emailAddress: "jdoe123@test1234.com"})
        component.instance().setState({phoneNumber: "11111111111"})
        component.instance().setState({password: "Password1"})
        component.instance().setState({confirm: "Password1"})
        component.instance().setState({stepIndex: 1})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        expect(component.state().schoolRequired).to.equal("Please select your school district.");
    });

    // Test 5
    test('Test back button', async () => {

        const component = shallow(<Signup notify = {notify}/>);

        component.instance().setState({firstName: "John"})
        component.instance().setState({lastName: "Doe"})
        component.instance().setState({emailAddress: "jdoe123@test1234.com"})
        component.instance().setState({phoneNumber: "11111111111"})
        component.instance().setState({password: ""})
        component.instance().setState({confirm: ""})
        component.instance().setState({stepIndex: 1})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(FlatButton)).to.have.length(1);
        expect(component.find(FlatButton).simulate('click'));

        expect(component.state().stepIndex).to.equal(0);
    });

    // Test 6
    test('Test if passwords match', async () => {

        const component = shallow(<Signup  notify = {notify}/>);

        component.instance().setState({firstName: "John"})
        component.instance().setState({lastName: "Doe"})
        component.instance().setState({emailAddress: "jdoe123@test1234.com"})
        component.instance().setState({phoneNumber: "11111111111"})
        component.instance().setState({password: "a1"})
        component.instance().setState({confirm: "b1"})
        component.instance().setState({stepIndex: 1})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        expect(component.state().passwordRequired).to.equal("Passwords must match.");
    });

    // Test 7
    test('Test if passwords are complex', async () => {

        const component = shallow(<Signup  notify = {notify}/>);

        component.instance().setState({firstName: "John"})
        component.instance().setState({lastName: "Doe"})
        component.instance().setState({emailAddress: "jdoe123@test1234.com"})
        component.instance().setState({phoneNumber: "11111111111"})
        component.instance().setState({password: "a1"})
        component.instance().setState({confirm: "a1"})
        component.instance().setState({stepIndex: 1})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        expect(component.state().passwordRequired).to.equal("A complex password is required.");
    });

    // Test 8
    test('Test if passwords is blank', async () => {

        const component = shallow(<Signup  notify = {notify}/>);

        component.instance().setState({firstName: "John"})
        component.instance().setState({lastName: "Doe"})
        component.instance().setState({emailAddress: "jdoe123@test1234.com"})
        component.instance().setState({phoneNumber: "11111111111"})
        component.instance().setState({password: ""})
        component.instance().setState({confirm: ""})
        component.instance().setState({stepIndex: 1})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        expect(component.state().passwordRequired).to.equal("A complex password is required.");
        expect(component.state().confirmRequired).to.equal("A complex password is required.");
    });



});