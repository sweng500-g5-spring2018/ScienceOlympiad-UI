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
    const nextTick = () => new Promise(res => process.nextTick(res));
    const notify = sinon.spy();
    var s;

    var userData = require('../../../../test/data/user/getUserResponseData')

    var sandbox = sinon.sandbox.create();

    //Set up test data before running any tests
    beforeAll(function () {
        //STUB: Constants function used as argument to HttpRequest
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid")

    })

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        s = sandbox.spy();
        console.log = s;
    })

    afterEach(function () {
        //Always unstub AuthService.isLoggedIn() in case we want it to return different values
        sandbox.restore();
    })


    // Test 1
    test('Should render text and password fields when data is fetched', async () => {
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            userData
        )

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<UserProfile />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(TextField).length).to.equal(4);
        expect(component.find(PasswordField).length).to.equal(4);
    });

    // Test 2
    test('Test password validation function', async () => {
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            userData
        )

        var result = -1;

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN")

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
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            userData
        )

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<UserProfile />);
        component.instance().setState({password: ""});
        component.instance().notify = sinon.spy();

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Simulate clicking the form button
        expect(component.find(Button).at(0).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.instance().state.code).to.equal(1);
    });

    // Test 4
    test('Try to update the users information with a wrong password', async () => {
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').rejects(
            //import test data JSON for response
            {status: 400, message: "crap"}
        );

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN")
        sandbox.stub(UserProfile.prototype, 'cleanPhone').returns("+1111111111")

        const component = shallow(<UserProfile />);

        component.instance().notify = sinon.spy();
        component.instance().setState({password: "WrongPassword!"});

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        let u={};
        u.phoneNumber = 1111111111;
        component.instance().setState({user: u});

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Simulate clicking the form button
        expect(component.find(Button).at(0).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // expect(component.instance().state.code).to.equal(11);
    });

    // Test 5
    test('Try to update the password with bad input', async () => {
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            userData
        )

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<UserProfile />);
        component.instance().notify = sinon.spy();

        component.instance().setState({currentPassword: "WrongPassword!"});
        component.instance().setState({newPassword: "Password1!"});
        component.instance().setState({confirmPassword: "Password2!"});

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Simulate clicking the form button
        expect(component.find(Button).at(1).simulate('click'));


        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.instance().state.code).to.equal(3);
    });

    // Test 6
    test('Try to update the password with good input but invalid passwords', async () => {
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            userData
        )

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<UserProfile />);
        component.instance().notify = sinon.spy();

        component.instance().setState({currentPassword: "WrongPassword!"});
        component.instance().setState({newPassword: "a"});
        component.instance().setState({confirmPassword: "a"});

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Simulate clicking the form button
        expect(component.find(Button).at(1).simulate('click'));


        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.instance().state.code).to.equal(4);
    });

    // Test 7
    test('Try to update the password with good input but invalid passwords', async () => {

        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').rejects(
            //import test data JSON for response
            {status: 400, message: "crap" }
        )

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<UserProfile />);
        component.instance().notify = sinon.spy();

        component.instance().setState({currentPassword: "WrongPassword!"});
        component.instance().setState({newPassword: "Password1"});
        component.instance().setState({confirmPassword: "Password1"});

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Simulate clicking the form button
        expect(component.find(Button).at(1).simulate('click'));

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        await helper.flushPromises();
        component.update();


        expect(component.instance().state.code).to.equal(7);
    });

    // Test 8
    test('Check coach profile picture', async () => {
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            userData
        )

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("COACH")

        const component = shallow(<UserProfile />);
        component.instance().notify = sinon.spy();

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        await helper.flushPromises();
        component.update();

        expect(component.instance().state.imageUrl).to.equal("https://baseballmomstuff.com/wp-content/uploads/2016/02/coach-cartoon.jpg");
    });

    // Test 9
    test('Check judge profile picture', async () => {
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            userData
        )

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("JUDGE")

        const component = shallow(<UserProfile />);
        component.instance().notify = sinon.spy();

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.instance().state.imageUrl).to.equal("https://www.how-to-draw-funny-cartoons.com/image-files/cartoon-judge-010.jpg");
    });

    // Test 10
    test('Check student profile picture', async () => {
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            userData
        )

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("STUDENT")

        const component = shallow(<UserProfile />);
        component.instance().notify = sinon.spy();

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.instance().state.imageUrl).to.equal("https://classroomclipart.com/images/gallery/Clipart/Science/TN_female-student-holding-flask-and-test-tube-in-science-lab-science-clipart.jpg");
    });

    // Test 11
    test('Test phone format', async () => {
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            userData
        )

        var result = -1;

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<UserProfile />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        result = component.instance().cleanPhone("111-111-1111");
        expect(result).to.equal("+1111111111");
    });

    // Test 12
    test('Handle a failed request', async () => {

        sandbox.stub(HttpRequest, 'httpRequest').rejects({"status": 401});

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true)
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<UserProfile />);
        component.instance().notify = sinon.spy();

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        await helper.flushPromises();
        component.update();

        expect(s.callCount).to.equal(1);
    });

});