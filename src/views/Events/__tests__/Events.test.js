import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';
import $ from 'jquery';
/* Test Helper functions */
import helper from '../../../../test/helpers/helper';

/* Dependent Components */
import HttpRequest from '../../../adapters/httpRequest';
import constants from '../../../utils/constants';
import Card from '../../../components/Cards/Card.js';
import TextField from 'material-ui/TextField';
import {Grid, Col, Row, Modal} from 'react-bootstrap';
import Loader from 'react-loader'
import NotificationSystem from 'react-notification-system';

/* Component under test */
import Events from '../Events';
import AuthService from "../../../utils/AuthService";
import PasswordField from "material-ui-password-field";
import RaisedButton from "material-ui/RaisedButton/index";
import Dialog from 'material-ui/Dialog';
import {DatePicker, TimePicker} from "material-ui";
import BuildingSelector from "../../../components/Buildings/BuildingSelector";
import ReactTable from 'react-table'
import EventDetail from "../EventDetail";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';


describe('Event Component Tests', function () {

    //TODO: REMOVE IF U WANT TO SEE CONSOLE LOGS...
    var consoleSpy = sinon.spy();
    console.log = consoleSpy;
    console.error = consoleSpy;

    const notify = sinon.spy();
    const judgeJson = {
        "status": 200,
        "body": [
            {
                "id":"5a87826425acab41344f08aa",
                "firstName":"Joe",
                "lastName":"Smith",
                "email":"testdata@test.com"
            },
            {
                "id":"5a87826425acab41334f08bb",
                "firstName":"Jimmy",
                "lastName":"Smith",
                "email":"testdata2@test.com"
            }
        ]
    }
    //Set up test data before running any tests
    beforeAll( () => {
        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            require('../../../../test/data/events/getEventData.json')
         )
        //jquery val method to return an email for certain tests
        sinon.stub($.prototype,'val').returns('test@test.com');
    })

    afterEach(function () {
        //Always unstub AuthService.isLoggedIn() in case we want it to return different values
        AuthService.isLoggedIn.restore();
        AuthService.isUserRoleAllowed.restore();

    })
    // Test 1
    test('Should render events when fetched', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)
        //sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)

        const component = shallow(<Events />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().events.length).to.equal(2);
        expect(component.find(ReactTable)).to.have.length(1);
    });

    // Test 2
    test('Test to render the create event modal', async () => {


        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)


        const component = shallow(<Events />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.instance().setState({modal: true})

        expect(component.find(Modal)).to.have.length(1);

        //expect(component.find(RaisedButton).at(1).simulate('click'));
        //Wait for setState's to finish and re-render component
       // await helper.flushPromises();
       // component.update();

        //render create event button
        component.instance().setState({stepIndex: 2})
        component.instance().setState({editMode: false})
        await helper.flushPromises();
        component.update();
        //add new judge, remove new judge, back to existing and create event buttons
        expect(component.find(RaisedButton)).to.have.length(4)
    });

    //test 3
    test('Test opening create event modal ', async () => {


        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)
        //sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)


        const component = shallow(<Events />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();
        component.instance().setState({modal: true})
        //click the create event button (should be the first one?)
        expect(component.find(RaisedButton).at(1).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update()
        expect(component.find(TextField)).to.have.length(5);
        expect(component.find(DatePicker)).to.have.length(1);
        expect(component.find(TimePicker)).to.have.length(2);
        expect(component.find(BuildingSelector)).to.have.length(1);
    });

    //test 4
    test('Test deleting a school', async () => {

        //S imulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)
       // sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)


        const component = shallow(<Events/>);

        component.instance().addNotification = sinon.spy();

        // Setup a fake school to delete
       // component.instance().setState({deleteID: '1'})

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Simulate opening the delete confirmation, which sets deleteID state
        var s = [];
        s.ID = 1;
        s.name = "Test";
        component.instance().confirmEventDelete(s);

        // Checks to see if the dialog opened
        expect(component.state().confirmDialog).to.equal(true);

        // Simulate the confirm delete function opening
        component.instance().removeEvent();

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        // Check notification to make sure the delete worked
        expect(component.instance().addNotification.getCall(0).args[0]).to.equal("Success: The event has been deleted.");
    });

    // Test 5
    test('Make sure action buttons are rendered in table', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)


        //load full component?
        const component = mount(<Events />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        //two fake events loaded so 3 actions for each and 1 create event button

        expect(component.find(RaisedButton)).to.have.length(7);
    });

    // Test 6
    test('Simulate opening an event details', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)


        //load full component?
        const component = mount(<Events />);

        //simulate loading in the event details
        component.instance().eventDetails('1');

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(EventDetail)).to.have.length(1);
    });

    // Test 7
    test('Test input validation', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
       sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)


        const component = shallow(<Events/>);

        component.instance().setState({stepIndex: 0})

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();
        component.instance().nextStep();
        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();
        expect(component.state().eventNameError).to.equal("Event name is required");
        expect(component.state().eventDateError).to.equal("Event date is required");
        expect(component.state().startTimeError).to.equal("Event start time is required");
        expect(component.state().endTimeError).to.equal("Event end time is required");
        expect(component.state().eventLocationError).to.equal("Please select a building for the event");
        expect(component.state().eventDescriptionError).to.equal("Event description is required");
    });

    // Test 8
    test('Test event name does not exist ', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)


        const component = shallow(<Events/>);

        component.instance().setState({stepIndex: 0});
        component.instance().setState({eventName: 'Event8'});
        component.instance().setState({eventDate: 'test'});
        component.instance().setState({startTime: 'test'});
        component.instance().setState({endTime: 'test'});
        component.instance().setState({eventLocation: 'test'});
        component.instance().setState({eventDescription: 'test'});

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.instance().nextStep();
        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();
        expect(component.state().eventNameError).to.equal(undefined);
    });

    // Test 9
    test('Test previousStep method', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)


        const component = shallow(<Events />);
        component.instance().setState({stepIndex: 1});
        await helper.flushPromises();
        component.update();

        component.instance().previousStep();

        expect(component.state().stepIndex).to.equal(0);
    });

    // Test 10
    test('Get Judges request test ', async () => {

        //load in new data so reset the wrapper
        HttpRequest.httpRequest.restore();
        var judgeStub = sinon;
        judgeStub.stub(HttpRequest,'httpRequest').resolves(
            require('../../../../test/data/events/getJudges.json')
        );

        //STUB: AuthService
        judgeStub.stub(AuthService, 'isLoggedIn').returns(true);
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)

        const component = shallow(<Events/>);
        await helper.flushPromises();
        component.update();
        expect(component.state().existingJudgeEmails.length).to.equal(2);
    });

    //Test 11
    test('Access controls making sure limited buttons are in table', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(false)


        //load full component?
        const component = mount(<Events />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        //two fake events view details

        expect(component.find(RaisedButton)).to.have.length(2);
    });


    //Test 12
    test('Creating or editing an event with no judges', async () => {

        //S imulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true);
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true);
        // sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)


        const component = shallow(<Events/>);

        component.instance().addNotification = sinon.spy();
        component.instance().setState({modal: true});
        component.instance().setState({editMode: true});
        component.instance().setState({stepIndex: 2});
        component.instance().setState({editEventId: 2});
        component.instance().setState({startTime: new Date()});
        component.instance().setState({eventDate: new Date()});
        component.instance().setState({endTime: new Date()});
        component.instance().setState({eventLocation: 5});

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton)).to.have.length(4);
        expect(component.find(RaisedButton).at(3).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();
        expect(component.instance().addNotification.getCall(0).args[0]).to.equal("Error: Please assign at least one judge to the event or create a new one.");
    });

    //Test 13
    test('Editing event', async () => {

        //S imulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true);
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true);
        // sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)


        const component = shallow(<Events/>);
        var existingJudgeVals = [];
        existingJudgeVals.push("555555555555555555");
        component.instance().addNotification = sinon.spy();
        component.instance().setState({modal: true});
        component.instance().setState({editMode: true});
        component.instance().setState({stepIndex: 2});
        component.instance().setState({editEventId: 2});
        component.instance().setState({startTime: new Date()});
        component.instance().setState({eventDate: new Date()});
        component.instance().setState({endTime: new Date()});
        component.instance().setState({eventLocation: 5});
        component.instance().setState({existingJudgeValues:existingJudgeVals});

        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton)).to.have.length(4);
        expect(component.find(RaisedButton).at(3).simulate('click'));

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();
        expect(component.instance().addNotification.getCall(0).args[0]).to.equal("Success: The event has been saved.");

    });
//Test 14
    test('Validate a new judge', async () => {

        //S imulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true);
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true);
        // sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)

        const component = shallow(<Events/>);
        var existingJudgeVals = [];
        existingJudgeVals.push("555555555555555555");
        component.instance().addNotification = sinon.spy();
        component.instance().setState({modal: true});
        component.instance().setState({editMode: true});
        component.instance().setState({stepIndex: 2});
        component.instance().setState({existingJudgeValues:existingJudgeVals});
        component.instance().setState({judgeCount:1});


        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();
        //account for the "Remove new judge" button
        expect(component.find(RaisedButton)).to.have.length(5);
        //will try to run, but it relies on jquery so skip to extract data so skip for now.
        expect(component.find(RaisedButton).at(4).simulate('click'));
    });

    //Test 15
    test('Test going from existing judges to new judges in stepper', async () => {

        //S imulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true);
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true);
        // sinon.stub(AuthService, 'isUserRoleAllowed').returns(true)

        const component = shallow(<Events/>);
        var existingJudgeVals = [];
        existingJudgeVals.push("555555555555555555");
        component.instance().addNotification = sinon.spy();
        component.instance().setState({modal: true});
        component.instance().setState({editMode: true});
        component.instance().setState({stepIndex: 1});



        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();
        expect(component.find(RaisedButton)).to.have.length(4);
        expect(component.find(RaisedButton).at(3).simulate('click'));
        // Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();
        expect(component.state().stepIndex).to.equal(2);
    });

    test('Valid email and close modal',async () => {
        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true);
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true);
        const component = shallow(<Events/>);
        // Wait for setState's to finish and re-render component
        component.instance().setState({editEventId: 1});
        await helper.flushPromises();
        component.update();
        //test the validemail funtion
        expect(component.instance().validEmail('tes@test.com')).to.equal(false);
        expect(component.instance().validEmail('estest.com')).to.equal(true);

        component.instance().closeModal();
        await helper.flushPromises();
        component.update();
        expect(component.state().modal).to.equal(false);
        expect(component.state().editMode).to.equal(false);
        expect(component.state().editEventId).to.equal('');

    });

    test('Test adding a new judge input, mock the jquery email call',async () => {
        sinon.stub(AuthService, 'isLoggedIn').returns(true);
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true);
        //not sure how to remove this stub after it executes

        const component = shallow(<Events/>);
        expect(component.state().judgeInputs.length).to.equal(0);
        component.instance().setState({judgeCount: 1});
        component.instance().addJudgeInputs();
        await helper.flushPromises();
        component.update();
        expect(component.state().judgeCount).to.equal(2);

        expect(component.state().judgeInputs.length).to.equal(1);

    });

    test('Test removing a judge, mock the jquery call',async () => {
        sinon.stub(AuthService, 'isLoggedIn').returns(true);
        sinon.stub(AuthService, 'isUserRoleAllowed').returns(true);

        const component = shallow(<Events/>);
        expect(component.state().judgeInputs.length).to.equal(0);
        component.instance().setState({judgeCount: 1});
        component.instance().setState({judgeInputs: ['test']});

        expect(component.state().judgeInputs.length).to.equal(1);

        component.instance().removeNewJudge();
        await helper.flushPromises();
        component.update();
        expect(component.state().judgeCount).to.equal(0);
        expect(component.state().judgeInputs.length).to.equal(0);

    });
});