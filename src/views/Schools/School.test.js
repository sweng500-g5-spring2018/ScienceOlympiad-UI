import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helper functions */
import helper from '../../../test/helpers/helper';

/* Dependent Components */
import HttpRequest from '../../adapters/httpRequest';
import constants from '../../utils/constants';
import Card from '../../components/Card/Card.js';
import TextField from 'material-ui/TextField';
import {Grid, Col, Row, Modal} from 'react-bootstrap';
import Loader from 'react-loader'
import NotificationSystem from 'react-notification-system';

/* Component under test */
import Schools from './Schools';
import AuthService from "../../containers/Login/AuthService";
import PasswordField from "material-ui-password-field";
import RaisedButton from "material-ui/RaisedButton/index";

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
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid")
    })

    afterEach(function () {
        //Always unstub AuthService.isLoggedIn() in case we want it to return different values
        AuthService.isLoggedIn.restore();
    })

    // Test 1
    test('Should render school when data is fetched', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().schoolList.length).to.equal(2);
        expect(component.find(Card)).to.have.length(1);
    });


    // Test 2
    test('Should not render schools when no schools are found', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        //STUB: componentDidMount so that no content is fetched
        sinon.stub(Schools.prototype, 'componentDidMount').returns(true);

        const component = shallow(<Schools />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().schoolList.length).to.equal(0);

        //UNSTUB: componentDidMount so it is not stubbed any next test cases
        Schools.prototype.componentDidMount.restore();
    });


    // Test 3
    test('Test to render the modal', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.instance().setState({modal: true})
        expect(component.find(Modal)).to.have.length(1);
    });

    // Test 4
    test('Test add school modal renders 3 TextFields', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.instance().setState({modal: true})
        component.instance().setState({modalAction: "add"})

        expect(component.find(TextField)).to.have.length(3);
    });


    // Test 5
    test('Test edit school modal renders 3 TextFields', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.instance().setState({modal: true})
        component.instance().setState({modalAction: "edit"})

        expect(component.find(TextField)).to.have.length(3);
    });

    // Test 6
    test('Test onchange event', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools />);

        component.instance().setState({Modal: true})
        component.instance().setState({modalAction: 'add'})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        //FIND children components being rendered
        var textfield1 = component.find(TextField).at(0);
        var textfield2 = component.find(TextField).at(1);
        var textfield3 = component.find(TextField).at(2);

        expect(textfield1.simulate('change', {target: {value: 'name={"schoolName"}'}}, 'TestSchool123'));
        expect(textfield2.simulate('change', {target: {value: 'name={"schoolContactName"}'}}, 'John Doe'));
        expect(textfield3.simulate('change', {target: {value: 'name={"schoolContactPhone"}'}}, '15551111111'));
    });

    // Test 7
    test('Test input validation', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools />);

        component.instance().setState({Modal: true})
        component.instance().setState({modalAction: 'add'})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton).at(1).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().schoolNameRequired).to.equal("School name is required");
        expect(component.state().schoolContactNameRequired).to.equal("School contact name is required");
        expect(component.state().schoolContactPhoneRequired).to.equal("School phone number is required");
    });

    // Test 8
    test('Test input validation', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        //sinon.stub(Schools, 'addNotification').returns('some stuffs');

        const component = shallow(<Schools/>);
        await helper.flushPromises();
        component.update();

        component.instance().addNotification = sinon.spy();

        component.instance().setState({Modal: true})
        component.instance().setState({modalAction: 'add'})
        component.instance().setState({schoolName: 'test'})
        component.instance().setState({schoolContactName: 'test'})
        component.instance().setState({schoolContactPhone: '11111111111'})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton).at(1).simulate('click'));

    });


});