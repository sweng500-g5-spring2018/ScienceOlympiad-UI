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

/* Component under test */
import Schools from '../Schools';
import AuthService from "../../../utils/AuthService";
import RaisedButton from "material-ui/RaisedButton/index";

describe('School Component Tests', function () {

    const notify = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            require('../../../../test/data/schools/getAllSchoolsResponseData.json')
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
    test('Test adding a new school', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools/>);

        // Set the notification to a spy so we can look at it later

        // Fill out the forms and sets state for an addition
        component.instance().addNotification = sinon.spy();
        component.instance().setState({modal: true})
        component.instance().setState({modalAction: 'add'})
        component.instance().setState({schoolName: 'test'})
        component.instance().setState({schoolContactName: 'test'})
        component.instance().setState({schoolContactPhone: '11111111111'})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Simulate clicking the form buttom
        expect(component.find(RaisedButton).at(1).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Check to see that the school has been added (status code 200)
        expect(component.instance().addNotification.getCall(0).args[0]).to.equal("Success: The school has been added.");
    });

    // Test 9
    test('Test editing a school', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools/>);

        component.instance().addNotification = sinon.spy();

        component.instance().setState({modal: true})
        component.instance().setState({modalAction: 'edit'})
        component.instance().setState({schoolName: 'test'})
        component.instance().setState({schoolContactName: 'test'})
        component.instance().setState({schoolContactPhone: '11111111111'})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton).at(1).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Check to see that the school has been added (status code 200)
        expect(component.instance().addNotification.getCall(0).args[0]).to.equal("Success: The school has been updated.");
    });


    // Test 10
    test('Test closing the modal', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools/>);

        component.instance().addNotification = sinon.spy();

        component.instance().setState({modal: true})
        component.instance().setState({modalAction: 'add'})
        component.instance().setState({schoolName: 'test'})
        component.instance().setState({schoolContactName: 'test'})
        component.instance().setState({schoolContactPhone: '11111111111'})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton).at(0).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Check to see that the school has been added (status code 200)
        expect(component.state().modal).to.equal(false);
    });

    // Test 11
    test('Test deleting a school', async () => {

        //S imulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools/>);

        component.instance().addNotification = sinon.spy();

        // Setup a fake school to delete
        component.instance().setState({deleteID: '1'})

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Simulate opening the delete confirmation
        var s = [];
        s.ID = 1;
        s.name = "Test";
        component.instance().confirmSchoolDelete(s);

        // Checks to see if the dialog opened
        expect(component.state().confirmDialog).to.equal(true);

        // Simulate the confirm delete function opening
        component.instance().deleteSchool();

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Check notification to make sure the delete worked
        expect(component.instance().addNotification.getCall(0).args[0]).to.equal("Success: The school has been deleted.");
    });

    // Test 12
    test('Test open modal function', async () => {

        // Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools/>);

        component.instance().addNotification = sinon.spy();

        // Create a fake status variable
        var s = [];
        s.status = "add";

        // Call the opening modal function
        component.instance().openModal(s);

        // Check to see if the modal action is add
        expect(component.state().modalAction).to.equal("add");

        // Call the edit modal function
        s.status = "edit";
        component.instance().openModal(s);

        // Check to see if the modal action is edit
        expect(component.state().modalAction).to.equal("edit");
    });

});