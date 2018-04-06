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


describe('EventDetail Component Tests', function () {

    //TODO: REMOVE IF U WANT TO SEE CONSOLE LOGS...
    var consoleSpy = sinon.spy();
    console.log = consoleSpy;
    console.error = consoleSpy;


    let props;
    var sandbox;
    var axiosMock;
    var allJson;
    var notifySpy = sinon.spy();
    var showEventsSpy = sinon.spy();
    const judgeJson =
        [
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
    const teamJson =
        [
            {
                "id": "5a87826425acab41344f08aa",
                "name": "Joejudge",
                "school": {
                    "id" : "5555555555555555555",
                    "schoolName":"school"
                }
            }
        ]
    const buildingJson = {
        "lat": 42,
        "lng": 43,
        "building":"bname"
    }
    //Set up test data before running any tests
    beforeAll(function() {
        axiosMock = new MockAdapter(axios);
        allJson=require('../../../../test/data/events/eventDetail.json')

        props = {
            addNotification: notifySpy,
            showEvents: showEventsSpy,
            eventId:"5ac5175b0e6990ce65f873e9"
        };

    });

    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach( () => {
        sandbox.restore();
    });

    test('Should render eventdetails when fetched', async () => {
        let tempJson = JSON.parse(JSON.stringify(allJson));
        let tempJudgeJson = JSON.parse(JSON.stringify(judgeJson));
        let tempTeamJson = JSON.parse(JSON.stringify(teamJson));
        let tempBuildingJson = JSON.parse(JSON.stringify(buildingJson));
        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'isUserRoleAllowed').returns(true);

        axiosMock.onGet(constants.getServerUrl() + "/sweng500/event/5ac5175b0e6990ce65f873e9").reply(200, tempJson);
        //this is nested inside the above request
        axiosMock.onGet(constants.getServerUrl() + "/sweng500/getBuilding/"+tempJson.room.buildingID).reply(200, tempBuildingJson);

        axiosMock.onGet(constants.getServerUrl() + "/sweng500/event/judges/5ac5175b0e6990ce65f873e9").reply(200, tempJudgeJson);

        axiosMock.onGet(constants.getServerUrl() + "/sweng500/event/teams/5ac5175b0e6990ce65f873e9").reply(200, tempTeamJson);

        const component = shallow(<EventDetail {... props} />);
        await helper.flushPromises();
        component.update();
        expect(component.state().deleteTeam).to.equal(true)
    });

});