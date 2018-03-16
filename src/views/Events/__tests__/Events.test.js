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


describe('Event Component Tests', function () {

    const notify = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            require('../../../../test/data/events/getEventData.json')
        )
        //STUB: Constants function used as argument to HttpRequest
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid")
    })

    afterEach(function () {
        //Always unstub AuthService.isLoggedIn() in case we want it to return different values
        AuthService.isLoggedIn.restore();
    })

    // Test 1
    test('Should render events when fetched', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

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

        const component = shallow(<Events />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.instance().setState({modal: true})
        expect(component.find(Modal)).to.have.length(1);
    });

    //test 3
    test('Test opening create event modal ', async () => {


        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Events />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();
        component.instance().setState({modal: true})
        //click the create event button (should be the first one?)
        expect(component.find(RaisedButton).at(1).simulate('click'));

        expect(component.find(TextField)).to.have.length(5);
        expect(component.find(DatePicker)).to.have.length(1);
        expect(component.find(TimePicker)).to.have.length(2);
        expect(component.find(BuildingSelector)).to.have.length(1);
    });

    //test 4
    test('Test deleting a school', async () => {

        //S imulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

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

        //load full component?
        const component = mount(<Events />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        //two fake events loaded so 2 actions for each and 1 create event button

        expect(component.find(RaisedButton)).to.have.length(5);
    });

    // Test 6
    test('Simulate opening an event details', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        //load full component?
        const component = mount(<Events />);

        //simulate loading in the event details
        component.instance().eventDetails('1');

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.find(EventDetail)).to.have.length(1);
    });
});