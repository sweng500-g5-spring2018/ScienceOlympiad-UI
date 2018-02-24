//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../test/helpers/helper';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import AuthService from "../../containers/Login/AuthService";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import PasswordField from 'material-ui-password-field'
import {Redirect} from 'react-router-dom';

//COMPONENT TO TEST
import Login from "./Login";

describe('Login Component Tests', function () {

    const notify = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {
    })

    afterEach(function () {
        //Always unstub AuthService.isLoggedIn() in case we want it to return different values
        AuthService.isLoggedIn.restore();
    })

    // Test 1
    test('Renders login-div container with appropriate content when user is not logged in', function () {
        //Simulate not-logged-in user
        sinon.stub(AuthService, 'isLoggedIn').returns(false);

        const component = shallow(<Login />);

        expect(component.find('div#login-div')).to.have.length(1);
        expect(component.find(MuiThemeProvider)).to.have.length(1);
        expect(component.find(PasswordField)).to.have.length(1);
        expect(component.find(TextField)).to.have.length(1);
        expect(component.find(AppBar)).to.have.length(1);
        expect(component.find(RaisedButton)).to.have.length(1);
        //expect(component.find())
    });

    // Test 2
    test('Renders RaisedButton that calls this.handlClick() when clicked', function () {
        //Simulate not-logged-in user
        sinon.stub(AuthService, 'isLoggedIn').returns(false);

        const peeker = sinon.stub(Login.prototype, 'handleClick').returns(true);
        const component = shallow(<Login />);

        expect(component.find('div#login-div')).to.have.length(1);
        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));
        expect(peeker.calledOnce).to.equal(true);

        Login.prototype.handleClick.restore();
    });

    // Test 3
    test('Renders a Redirect because user is already logged in', function () {
        //Simulate logged-in user
        sinon.stub(AuthService, 'isLoggedIn').returns(true);

        const component = shallow(<Login />);

        expect(component.find(Redirect)).to.have.length(1);
    });

    // Test 4
    test('Successfully invokes handleClick(), simulates state change, and renders Redirect', function () {
        //Stub handleClick() and AuthService functions
        const fakeRedirect = sinon.stub(Login.prototype, 'handleClick').callsFake(() => {
            component.instance().setState({redirect: true});
        });
        sinon.stub(AuthService, 'isLoggedIn').returns(false);
        sinon.stub(AuthService, 'login').resolves(true);

        const component = shallow(<Login notify = {notify}/>);

        component.instance().setState({emailAddress: "me@me.com", password: "hello"});

        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        // component.instance().forceUpdate();
        // component.update();

        expect(fakeRedirect.calledOnce).to.equal(true);
        expect(component.state().redirect).to.equal(true);

        Login.prototype.handleClick.restore();
        AuthService.login.restore();
    });

    // Test 5
    test('Should invoke handleClick(), check email (not provided), and updates state with message', async () => {

        sinon.stub(AuthService, 'isLoggedIn').returns(false);

        const component = shallow(<Login notify = {notify}/>);


        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().emailRequired).to.equal("An email address is required.");
        expect(component.state().passwordRequired).to.equal(undefined);
    });

    // Test 6
    test('Should invoke handleClick(), check email (provided) & password (not provided), and update state with message', async () => {

        sinon.stub(AuthService, 'isLoggedIn').returns(false);

        const component = shallow(<Login notify = {notify}/>);

        component.instance().setState({emailAddress: "HELLO@HELLO.COM"});
        expect(component.find(RaisedButton)).to.have.length(1);
        expect(component.find(RaisedButton).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().emailRequired).to.equal(undefined);
        expect(component.state().passRequired).to.equal("Password is required.");
    });

    // Test 7
    test('Should update state of emailAddress & password onChange of Text/Pass Fields', async () => {
        const consoleSpy = sinon.spy();
        console.log = consoleSpy;

        sinon.stub(AuthService, 'isLoggedIn').returns(false);
        sinon.stub(AuthService, 'login').rejects();

        const component = shallow(<Login notify = {notify}/>);

        var textField = component.find(TextField);
        var passField = component.find(PasswordField);

        expect(textField).to.have.length(1);
        expect(passField).to.have.length(1);
        expect(textField.simulate('change', {target: {value: 'email'}}, 'email'));
        expect(passField.simulate('change', {target: {value: 'password'}}, 'password'));

        await helper.flushPromises();
        component.update();

        expect(component.state().emailRequired).to.equal(undefined);
        expect(component.state().passRequired).to.equal(undefined);
        expect(component.state().emailAddress).to.equal('email');
        expect(component.state().password).to.equal('password');

        expect(component.find(RaisedButton).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(consoleSpy.called).to.equal(true);
        expect(notify.called).to.equal(true);
        AuthService.login.restore();
    });


    // Test 7
    test('Should update state of emailAddress & password onChange of Text/Pass Fields and attempt login', async () => {
        //STUB: console logs in component and spy on them if called
        const consoleSpy = sinon.spy();
        console.log = consoleSpy;

        //STUB: AuthService methods being run
        sinon.stub(AuthService, 'isLoggedIn').returns(false);
        sinon.stub(AuthService, 'login').rejects();

        //RENDER component
        const component = shallow(<Login notify = {notify}/>);

        //FIND children components being rendered
        var textField = component.find(TextField);
        var passField = component.find(PasswordField);

        //CHECK components found & simulate on change event
        expect(textField).to.have.length(1);
        expect(passField).to.have.length(1);
        expect(textField.simulate('change', {target: {value: 'email'}}, 'email'));
        expect(passField.simulate('change', {target: {value: 'password'}}, 'password'));

        //FLUSH promises and update component
        await helper.flushPromises();
        component.update();

        //CHECK that state has been successfully changed based on the simulated onchange events
        expect(component.state().emailRequired).to.equal(undefined);
        expect(component.state().passRequired).to.equal(undefined);
        expect(component.state().emailAddress).to.equal('email');
        expect(component.state().password).to.equal('password');

        //CHECK that simulate on click of submit button is successful
        expect(component.find(RaisedButton).simulate('click', {preventDefault: () => {}}));

        //FLUSH promises and update component again
        await helper.flushPromises();
        component.update();

        //CHECK that console.log was called AND notificiation called because the login attempt failed
        expect(consoleSpy.called).to.equal(true);
        expect(notify.called).to.equal(true);

        //STUB AuthService.isLoggedIn to return true to set redirect state
        AuthService.isLoggedIn.restore();
        sinon.stub(AuthService, 'isLoggedIn').returns(true);

        //CHECK that simulating another button click occurs
        expect(component.find(RaisedButton).simulate('click', {preventDefault: () => {}}));

        //FLUSH promises and update component again
        await helper.flushPromises();
        component.update();

        expect(component.state().redirect).to.equal(true);

        AuthService.login.restore();
    });

    //GOOD EXAMPLE
    // const wrapper = shallow(<MyForm {...props}/>)

    // Stub the handleSubmit method
    // const component = wrapper.instance()
    // let handleSubmitStub = sinon.stub(component, 'handleSubmit', () => { })

    // Force the component and wrapper to update so that the stub is used
    // ONLY works when both of these are present
    // component.forceUpdate()
    // wrapper.update()

    // Submit the form
    // wrapper.find('form').simulate('submit')

    // expect(handleSubmitStub.callCount).to.equal(1)

});