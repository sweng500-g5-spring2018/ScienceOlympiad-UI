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
        expect(component.find(Button)).to.have.length(3);
    });

    // // Test 2
    // test('Test for input validation on signup page 1', async () => {
    //     const component = shallow(<Signup notify = {notify}/>);
    //
    //     //Wait for setState's to finish and re-render component
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.find(RaisedButton)).to.have.length(1);
    //     expect(component.find(RaisedButton).simulate('click'));
    //
    //     expect(component.state().firstNameRequired).to.equal("First name is required.");
    //     expect(component.state().lastNameRequired).to.equal("Last name is required.");
    //     expect(component.state().phoneNumberRequired).to.equal("A phone number is required.");
    //     expect(component.state().emailAddressRequired).to.equal("An email address is required.");
    // });
    //
    // // Test 3
    // test('Test for an invalid email address', async () => {
    //     const component = shallow(<Signup notify = {notify}/>);
    //
    //     //Wait for setState's to finish and re-render component
    //     await helper.flushPromises();
    //     component.update();
    //
    //     component.instance().setState({emailAddress: "badAddress.com"})
    //
    //     expect(component.find(RaisedButton)).to.have.length(1);
    //     expect(component.find(RaisedButton).simulate('click'));
    //
    //     expect(component.state().emailAddressRequired).to.equal("A valid email address is required.");
    // });
    //
    // // Test 4
    // test('Test school district selection', async () => {
    //
    //     const component = shallow(<Signup  notify = {notify}/>);
    //
    //     component.instance().setState({firstName: "John"})
    //     component.instance().setState({lastName: "Doe"})
    //     component.instance().setState({emailAddress: "jdoe123@test1234.com"})
    //     component.instance().setState({phoneNumber: "11111111111"})
    //     component.instance().setState({password: "Password1"})
    //     component.instance().setState({confirm: "Password1"})
    //     component.instance().setState({stepIndex: 1})
    //     component.instance().setState({school: '5a87826425acab41344f08aa'})
    //
    //     //Wait for setState's to finish and re-render component
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.find(RaisedButton)).to.have.length(1);
    //     expect(component.find(RaisedButton).simulate('click'));
    //
    //     expect(component.state().schoolRequired).to.equal(undefined);
    // });
    //
    // // Test 5
    // test('Test no school district selection', async () => {
    //
    //     const component = shallow(<Signup  notify = {notify}/>);
    //
    //     component.instance().setState({firstName: "John"})
    //     component.instance().setState({lastName: "Doe"})
    //     component.instance().setState({emailAddress: "jdoe123@test1234.com"})
    //     component.instance().setState({phoneNumber: "11111111111"})
    //     component.instance().setState({password: "Password1"})
    //     component.instance().setState({confirm: "Password1"})
    //     component.instance().setState({stepIndex: 1})
    //
    //     //Wait for setState's to finish and re-render component
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.find(RaisedButton)).to.have.length(1);
    //     expect(component.find(RaisedButton).simulate('click'));
    //
    //     expect(component.state().schoolRequired).to.equal("Please select your school district.");
    // });
    //
    // // Test 6
    // test('Test back button', async () => {
    //
    //     const component = shallow(<Signup notify = {notify}/>);
    //
    //     component.instance().setState({firstName: "John"})
    //     component.instance().setState({lastName: "Doe"})
    //     component.instance().setState({emailAddress: "jdoe123@test1234.com"})
    //     component.instance().setState({phoneNumber: "11111111111"})
    //     component.instance().setState({password: ""})
    //     component.instance().setState({confirm: ""})
    //     component.instance().setState({stepIndex: 1})
    //
    //     //Wait for setState's to finish and re-render component
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.find(FlatButton)).to.have.length(1);
    //     expect(component.find(FlatButton).simulate('click'));
    //
    //     expect(component.state().stepIndex).to.equal(0);
    // });
    //
    // // Test 7
    // test('Test if passwords match', async () => {
    //
    //     const component = shallow(<Signup  notify = {notify}/>);
    //
    //     component.instance().setState({firstName: "John"})
    //     component.instance().setState({lastName: "Doe"})
    //     component.instance().setState({emailAddress: "jdoe123@test1234.com"})
    //     component.instance().setState({phoneNumber: "11111111111"})
    //     component.instance().setState({password: "a1"})
    //     component.instance().setState({confirm: "b1"})
    //     component.instance().setState({stepIndex: 1})
    //
    //     //Wait for setState's to finish and re-render component
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.find(RaisedButton)).to.have.length(1);
    //     expect(component.find(RaisedButton).simulate('click'));
    //
    //     expect(component.state().passwordRequired).to.equal("Passwords must match.");
    // });
    //
    // // Test 8
    // test('Test if passwords are complex', async () => {
    //
    //     const component = shallow(<Signup  notify = {notify}/>);
    //
    //     component.instance().setState({firstName: "John"})
    //     component.instance().setState({lastName: "Doe"})
    //     component.instance().setState({emailAddress: "jdoe123@test1234.com"})
    //     component.instance().setState({phoneNumber: "11111111111"})
    //     component.instance().setState({password: "a1"})
    //     component.instance().setState({confirm: "a1"})
    //     component.instance().setState({stepIndex: 1})
    //
    //     //Wait for setState's to finish and re-render component
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.find(RaisedButton)).to.have.length(1);
    //     expect(component.find(RaisedButton).simulate('click'));
    //
    //     expect(component.state().passwordRequired).to.equal("A complex password is required.");
    // });
    //
    // // Test 9
    // test('Test if passwords is blank', async () => {
    //
    //     const component = shallow(<Signup  notify = {notify}/>);
    //
    //     component.instance().setState({firstName: "John"})
    //     component.instance().setState({lastName: "Doe"})
    //     component.instance().setState({emailAddress: "jdoe123@test1234.com"})
    //     component.instance().setState({phoneNumber: "11111111111"})
    //     component.instance().setState({password: ""})
    //     component.instance().setState({confirm: ""})
    //     component.instance().setState({stepIndex: 1})
    //
    //     //Wait for setState's to finish and re-render component
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.find(RaisedButton)).to.have.length(1);
    //     expect(component.find(RaisedButton).simulate('click'));
    //
    //     expect(component.state().passwordRequired).to.equal("A complex password is required.");
    //     expect(component.state().confirmRequired).to.equal("A complex password is required.");
    // });
    //
    // // Test 10
    // test('Test on change of page 1', async () => {
    //
    //     //RENDER component
    //     const component = shallow(<Signup notify = {notify}/>);
    //
    //     // Makes sure there are 4 textareas
    //     expect(component.find(TextField)).to.have.length(4);
    //
    //     //FIND children components being rendered
    //     var textField1 = component.find(TextField).at(0);
    //     var textField2 = component.find(TextField).at(1);
    //     var textField3 = component.find(TextField).at(2);
    //     var textField4 = component.find(TextField).at(3);
    //
    //     expect(textField1.simulate('change', {target: {value: 'name={"fname"}'}}, 'John'));
    //     expect(textField2.simulate('change', {target: {value: 'name={"lname"}'}}, 'Doe'));
    //     expect(textField3.simulate('change', {target: {value: 'name={"phone"}'}}, '1'));
    //     expect(textField4.simulate('change', {target: {value: 'name={"email"}'}}, 'test@test.com'));
    //
    //     expect(component.find(RaisedButton).simulate('click'));
    // });
    //
    // // Test 11
    // test('Test on change of page 2', async () => {
    //
    //     //RENDER component
    //     const component = shallow(<Signup notify = {notify}/>);
    //
    //     component.instance().setState({firstName: "John"})
    //     component.instance().setState({lastName: "Doe"})
    //     component.instance().setState({emailAddress: "jdoe123@test1234.com"})
    //     component.instance().setState({phoneNumber: "11111111111"})
    //     component.instance().setState({password: ""})
    //     component.instance().setState({confirm: ""})
    //     component.instance().setState({stepIndex: 1})
    //
    //     //Wait for setState's to finish and re-render component
    //     await helper.flushPromises();
    //     component.update();
    //
    //
    //     // Makes sure there are 4 textareas
    //     expect(component.find(PasswordField)).to.have.length(2);
    //
    //     //FIND children components being rendered
    //     var passwordField1 = component.find(PasswordField).at(0);
    //     var passwordField2 = component.find(PasswordField).at(1);
    //
    //     expect(passwordField1.simulate('change', {target: {value: 'name={"password"}'}}, 'pass'));
    //     expect(passwordField2.simulate('change', {target: {value: 'name={"confirm"}'}}, 'pass'));
    //
    //     expect(component.find(RaisedButton).simulate('click'));
    // });

});