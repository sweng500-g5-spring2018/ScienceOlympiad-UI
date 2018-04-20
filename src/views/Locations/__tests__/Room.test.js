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
import Rooms from '../Rooms';
import AuthService from "../../../utils/AuthService";
import RaisedButton from "material-ui/RaisedButton/index";
import CustomDropdown from "../../../elements/CustomSelector/CustomDropdown";

describe('Room Component Tests', function () {

    const notify = sinon.spy();
    const consoleSpy = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            require('../../../../test/data/rooms/getAllRoomsResponseData.json')
        )
        //STUB: Constants function used as argument to HttpRequest
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid");

        console.log = consoleSpy;
    })

    afterEach(function () {
        //Always unstub AuthService.isLoggedIn() in case we want it to return different values
        AuthService.isLoggedIn.restore();
    })

    // Test 1
    test('Should render room when data is fetched', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Rooms />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().roomList.length).to.equal(2);
        expect(component.find(Card)).to.have.length(1);
    });

    // Test 2
    test('Test adding a new room', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Rooms/>);

        // Set the notification to a spy so we can look at it later

        // Fill out the forms and sets state for an addition
        component.instance().addNotification = sinon.spy();
        component.instance().setState({modal: true})
        component.instance().setState({modalAction: 'add'})
        component.instance().setState({roomName: 'New Room'})
        component.instance().setState({roomCapacity: 10})
        component.instance().setState({building: 5})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Simulate clicking the form buttom
        expect(component.find(RaisedButton).at(1).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Check to see that the school has been added (status code 200)
        expect(component.instance().addNotification.getCall(0).args[0]).to.equal("Success: The room has been added.");
    });

    // Test 3
    test('Test editing a room', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Rooms/>);

        component.instance().addNotification = sinon.spy();

        component.instance().addNotification = sinon.spy();
        component.instance().setState({modal: true})
        component.instance().setState({modalAction: 'edit'})
        component.instance().setState({roomName: 'Edit Room'})
        component.instance().setState({roomCapacity: 10})
        component.instance().setState({building: 5})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton).at(1).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Check to see that the school has been added (status code 200)
        expect(component.instance().addNotification.getCall(0).args[0]).to.equal("Success: The room has been updated.");
    });

    // Test 4
    test('Test deleting a room', async () => {

        //S imulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Rooms/>);

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
        component.instance().confirmRoomDelete(s);

        // Checks to see if the dialog opened
        expect(component.state().confirmDialog).to.equal(true);

        // Simulate the confirm delete function opening
        component.instance().deleteRoom();

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Check notification to make sure the delete worked
        expect(component.instance().addNotification.getCall(0).args[0]).to.equal("Success: The room has been deleted.");
    });

    // Test 5
    test('Test input validation', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Rooms />);

        component.instance().setState({Modal: true})
        component.instance().setState({modalAction: 'add'})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton).at(1).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().roomNameRequired).to.equal("A room name or number is required");
        expect(component.state().roomCapacityRequired).to.equal("A room capacity is required");
        expect(component.state().buildingRequired).to.equal("A building is required");
    });

    // Test 6
    test('Test closing the modal', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Rooms/>);

        component.instance().addNotification = sinon.spy();

        component.instance().setState({modal: true})
        component.instance().setState({modalAction: 'add'})
        component.instance().setState({roomName: 'Room 1'})
        component.instance().setState({roomCapacity: 10})
        component.instance().setState({building: 5})

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


    // Test 7
    test('Test onchange event', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Rooms />);

        component.instance().setState({Modal: true})
        component.instance().setState({modalAction: 'add'})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        //FIND children components being rendered
        var textfield1 = component.find(TextField).at(0);
        var textfield2 = component.find(TextField).at(1);
        var selector = component.find(CustomDropdown);

        expect(textfield1.simulate('change', {target: {value: 'name={"roomName"}'}}, 'Room1'));
        expect(textfield2.simulate('change', {target: {value: 'name={"roomCapacity"}'}}, 5));
        expect(selector.simulate('change', {target: {value: 'name={"building"}'}}, 1));
    });

    // Test 8
    test('Test open modal function', async () => {

        // Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Rooms/>);

        component.instance().addNotification = sinon.spy();

        // Create a fake status variable
        var s = {};
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

        s.status = "idk";
        component.instance().openModal(s);
        expect(component.state().modalAction).to.equal("edit");
    });

    // Test 9
    test('Test notification system and modals', async () => {

        // Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Rooms/>);

        // Call the opening modal function
        component.instance().setState({_notificationSystem: {addNotification: () => {} }});
        component.instance().addNotification("YO", "yo", "yo", 2);
        component.instance().addNotification("YO");

        component.instance().buildingCallback(0);
        expect(component.state().buildingDropdownValue).to.equal(0);

        component.instance().closeConfirmDialog();
        expect(component.state().confirmDialog).to.equal(false);


        HttpRequest.httpRequest.restore();

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').rejects(
            //import test data JSON for response
            "awww"
        );

        component.instance().deleteRoom();
        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().confirmDialog).to.equal(false);

        // Fill out the forms and sets state for an addition
        component.instance().setState({modal: true})
        component.instance().setState({modalAction: 'add'})
        component.instance().setState({roomName: 'New Room'})
        component.instance().setState({roomCapacity: 10})
        component.instance().setState({building: 5})

        component.instance().handleSubmit();
        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().modal).to.equal(false);

        component.instance().setState({modalAction: 'add'})
        component.instance().handleSubmit();

        await helper.flushPromises();
        component.update();

        expect(component.state().modal).to.equal(false);

        component.instance().getAllRoomsAndBuildings();
        await helper.flushPromises();
        component.update();

        component.instance().columns[0].filterMethod({value: 'roomName'},[]);
        component.instance().columns[1].filterMethod({value: 'buildingName'},[]);
        component.instance().columns[2].filterMethod({value: 'capacity'},[]);
    });


    // Test 10
    test('Test getting building name', async () => {
        HttpRequest.httpRequest.restore();

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            require('../../../../test/data/buildings/getAllBuildingsResponseData.json')
        );

        // Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true);

        const component = shallow(<Rooms/>);
        await helper.flushPromises();
        component.update();

        // Call the opening modal function
        component.instance().setState({_notificationSystem: {addNotification: () => {} }});
        component.instance().addNotification("YO", "yo", "yo", 2);
        component.instance().addNotification("YO");

        let build = component.state().buildingList[0];
        expect(component.instance().getBuildingName(build.id)).to.deep.equal(build.building);

    });



});