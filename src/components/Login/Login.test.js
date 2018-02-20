//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

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

    //Test Data declarations
    let chuckData;

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