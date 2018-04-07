//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import {RaisedButton, SelectField, AppBar} from 'material-ui'
import Button from '../../../elements/CustomButton/CustomButton';
import {Modal} from 'react-bootstrap';
import ReactTable from 'react-table';
import Loader from 'react-loader'

//COMPONENT TO TEST
import TeamViewer from '../TeamViewer';

//MOCK AXIOS
/* Test Helper functions */
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import constants from '../../../utils/constants';
import AuthService from "../../../utils/AuthService";
import StudentViewer from "../../Students/StudentViewer";

describe('TeamViewer Component Tests', function () {

    var axiosMock;
    var teamJson;
    var studentJson;
    var props;

    var sandbox;
    var notifySpy = sinon.spy();
    var updateTableSpy = sinon.spy();
    var consoleSpy = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {
        teamJson = require('../../../../test/data/teams/getAllTeamsResponseData');
        studentJson = {
            "id": "XXXXXX",
            "firstName": "test",
            "lastName": "test",
            "emailAddress": "test@test.com",
            "phoneNumber": "",
            "minutesBeforeEvent": 10,
            "receiveText": false,
            "lastLoginDate": null,
            "school": {
                "id": "5a88cf0025acab41344f08af",
                "schoolName": "Hogwarts",
                "schoolContactName": "Albus Dumbledore",
                "schoolContactPhone": "15554837751"
            },
        };

        props = {
            tableUpdateToggler: false,
            addNotification: notifySpy,
            updateTable: updateTableSpy,
            viewIndex: 0
        }

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
    test('Should render TeamViewer with expected children components when no students available', async () => {
        let tempTeamJson = JSON.parse(JSON.stringify(teamJson));

        sandbox.stub(AuthService, 'isAuthorized').returns(true);
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getTeams').reply(200, tempTeamJson);

        const component = shallow(<TeamViewer {... props} />);
        await helper.flushPromises();
        component.update();

        expect(component.find(Loader)).to.be.length(1);
        expect(component.find(ReactTable)).to.be.length(1);
        expect(component.find(Modal)).to.be.length(1);
        expect(component.find(AppBar)).to.be.length(1);
        expect(component.find(RaisedButton)).to.be.length(2);
        expect(component.find(SelectField)).to.be.length(0);

        component.instance().columns[0].filterMethod({value: 'name'},[]);
        component.instance().columns[1].filterMethod({value: 'coachName'},[]);
        component.instance().columns[2].filterMethod({value: 'schoolName'},[]);

        const table = component.find(ReactTable);

        table.simulate('expandedChange', null, 0, null);
        await helper.flushPromises();
        component.update();

        component.instance().componentWillReceiveProps({tableUpdateToggler: true});
        component.instance().componentWillReceiveProps({tableUpdateToggler: false});

        const closeButton = component.find(RaisedButton).at(0);
        closeButton.simulate('click');
        await helper.flushPromises();
        component.update();

    });


    // Test 2
    test('Should render TeamViewer and handle delete of team', async () => {
        let tempTeamJson = JSON.parse(JSON.stringify(teamJson));

        expect(tempTeamJson.length).to.equal(teamJson.length);

        sandbox.stub(AuthService, 'isAuthorized').returns(true);
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getTeams').reply(200, tempTeamJson);
        axiosMock.onDelete(constants.getServerUrl() + "/sweng500/removeTeam/" + tempTeamJson[0].id).reply(200, "YAY");

        const component = shallow(<TeamViewer {... props} />);
        await helper.flushPromises();
        component.update();

        component.instance().deleteTeamButtonClicked(tempTeamJson[0]);

        await helper.flushPromises();
        component.update();

        expect(component.state().modal).to.be.true;
        expect(component.state().selectedTeam.id).to.equal(tempTeamJson[0].id);
        expect(component.state().modalInfo.modalAction).to.equal("DELETE");

        const modalButtons = component.find(Modal.Footer).find(RaisedButton);
        expect(modalButtons).to.be.length(2);

        expect(modalButtons.at(1).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().teams.length).to.equal(teamJson.length - 1);
        expect(component.state().modal).to.be.false
        expect(notifySpy.called).to.be.true;
        notifySpy.resetHistory();
    });

    // Test 3
    test('Should render TeamViewer and handle delete of team', async () => {
        let tempTeamJson = JSON.parse(JSON.stringify(teamJson));
        let studentID = JSON.parse(JSON.stringify(tempTeamJson[1].students[0].id));

        expect(tempTeamJson.length).to.equal(teamJson.length);

        sandbox.stub(AuthService, 'isAuthorized').returns(true);
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getTeams').reply(200, tempTeamJson);
        axiosMock.onDelete(constants.getServerUrl() + "/sweng500/deleteStudent/" + studentID).reply(200, "YAY");

        const component = shallow(<TeamViewer {... props} />);
        await helper.flushPromises();
        component.update();

        component.instance().deleteStudentClicked(tempTeamJson[1].students[0]);

        await helper.flushPromises();
        component.update();

        expect(component.state().modal).to.be.true;
        expect(component.state().selectedStudent.id).to.equal(studentID);
        expect(component.state().modalInfo.modalAction).to.equal("DELETESTUDENT");

        const modalButtons = component.find(Modal.Footer).find(RaisedButton);
        expect(modalButtons).to.be.length(2);

        expect(modalButtons.at(1).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().modal).to.be.false
        expect(notifySpy.called).to.be.true;
        notifySpy.resetHistory();
    });

    // Test 4
    test('Should render TeamViewer and handle remove student from team', async () => {

        let tempTeamJson = JSON.parse(JSON.stringify(teamJson));
        let tempTeamSelected = tempTeamJson[1];
        let tempStudentSelected = tempTeamSelected.students[0];

        expect(tempTeamJson[1].students.length).to.equal(1);

        sandbox.stub(AuthService, 'isAuthorized').returns(true);
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getTeams').reply(200, tempTeamJson);
        axiosMock.onPost(constants.getServerUrl() + '/sweng500/updateStudentsInTeam').reply(200, tempTeamSelected);

        const component = shallow(<TeamViewer {... props} />);
        await helper.flushPromises();
        component.update();

        component.instance().removeStudentFromTeamButtonClicked(tempStudentSelected, tempTeamSelected);

        await helper.flushPromises();
        component.update();

        expect(component.state().modal).to.be.true;
        expect(component.state().selectedStudent.id).to.equal(tempStudentSelected.id);
        expect(component.state().selectedTeam.id).to.equal(tempTeamSelected.id);
        expect(component.state().modalInfo.modalAction).to.equal("REMOVESTUDENTFROMTEAM");

        const modalButtons = component.find(Modal.Footer).find(RaisedButton);
        expect(modalButtons).to.be.length(2);

        expect(modalButtons.at(1).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.state().selectedTeam).to.equal(null);
        expect(component.state().selectedStudent).to.equal(null);
        expect(component.state().expanded).to.deep.equal({});
        expect(component.state().modal).to.be.false
        expect(notifySpy.called).to.be.true;
        notifySpy.resetHistory();

        let changedTeam = component.state().teams.find( (team) => {
            return team.id ===tempTeamSelected.id;
        });

        expect(changedTeam.students.length).to.equal(0);
    });

    // Test 5
    test('Should render TeamViewer with working updateTeam function to pass to child', async () => {
        let tempTeamJson = JSON.parse(JSON.stringify(teamJson));
        let tempTeamSelected = tempTeamJson[1];

        let updatedTeam = JSON.parse(JSON.stringify(tempTeamSelected));
        updatedTeam.students = [];

        sandbox.stub(AuthService, 'isAuthorized').returns(true);
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getTeams').reply(200, tempTeamJson);

        const component = shallow(<TeamViewer {... props} />);
        await helper.flushPromises();
        component.update();

        let theExpandedThing = [0];
        component.setState({expanded: theExpandedThing});

        let teamThatWillBeUpdated = component.state().teams.find( (team) => {
            return team.id === tempTeamSelected.id;
        });

        expect(teamThatWillBeUpdated.students).to.be.length(1);

        component.instance().updateTeam(updatedTeam, theExpandedThing);

        await helper.flushPromises();
        component.update();

        let teamThatWasUpdated = component.state().teams.find( (team) => {
            return team.id === tempTeamSelected.id;
        });

        expect(teamThatWasUpdated.students).to.be.length(0);
    });

    // Test 6
    test('Should render TeamViewer and handle errors', async () => {

        let tempTeamJson = JSON.parse(JSON.stringify(teamJson));
        let tempTeamSelected = tempTeamJson[1];
        let tempStudentSelected = tempTeamSelected.students[0];

        expect(tempTeamJson[1].students.length).to.equal(1);

        sandbox.stub(AuthService, 'isAuthorized').returns(true);
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getTeams').reply(400, "fail");

        const studentlessComponent = shallow(<TeamViewer {... props} />);
        await helper.flushPromises();
        studentlessComponent.update();

        expect(notifySpy.called).to.be.true;
        notifySpy.resetHistory();

        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getTeams').reply(200, tempTeamJson);
        axiosMock.onPost(constants.getServerUrl() + '/sweng500/updateStudentsInTeam').reply(400, "fail");
        axiosMock.onDelete(constants.getServerUrl() + "/sweng500/deleteStudent/" + tempStudentSelected.id).reply(400, "fail");
        axiosMock.onDelete(constants.getServerUrl() + "/sweng500/removeTeam/" + tempTeamSelected.id).reply(400, "fail");

        const component = shallow(<TeamViewer {... props} />);
        await helper.flushPromises();
        component.update();

        //REMOVE STUDENT FROM TEAM
        expect(notifySpy.called).to.be.false;
        component.instance().removeStudentFromTeamButtonClicked(tempStudentSelected, tempTeamSelected);

        let modalButtons = component.find(Modal.Footer).find(RaisedButton);
        expect(modalButtons).to.be.length(2);

        expect(modalButtons.at(1).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(notifySpy.called).to.be.true;
        notifySpy.resetHistory();

        //DELETE STUDENT
        expect(notifySpy.called).to.be.false;
        component.instance().deleteStudentClicked(tempTeamJson[2].students[0]);

        modalButtons = component.find(Modal.Footer).find(RaisedButton);
        expect(modalButtons).to.be.length(2);

        expect(modalButtons.at(1).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(notifySpy.called).to.be.true;
        notifySpy.resetHistory();

        //DELETE TEAM
        expect(notifySpy.called).to.be.false;
        component.instance().deleteTeamButtonClicked(tempTeamSelected);

        modalButtons = component.find(Modal.Footer).find(RaisedButton);
        expect(modalButtons).to.be.length(2);

        expect(modalButtons.at(1).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(notifySpy.called).to.be.true;
        notifySpy.resetHistory();
    });

    // Test 7
    test('Should render TeamViewer and add buttons to team which are clickable', async () => {

        let tempTeamJson = JSON.parse(JSON.stringify(teamJson));

        sandbox.stub(AuthService, 'isAuthorized').returns(true);
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getTeams').reply(200, tempTeamJson);

        const component = mount(<TeamViewer {... props} />);
        await helper.flushPromises();
        component.update();

        let cols = component.find('Td.rt-expandable');

        expect(cols.at(1).simulate('click'));

        await helper.flushPromises();
        component.update();

        let studentViewer = component.find(StudentViewer);

        let studentButtons = studentViewer.find(RaisedButton);
        expect(studentButtons).to.be.length(12);

        expect(studentButtons.at(0).simulate('click'));
        expect(studentButtons.at(1).simulate('click'));

        await helper.flushPromises();
        component.update();

        expect(component.find(RaisedButton).at(0).simulate('click'));
        await helper.flushPromises();
        component.update();
    });

});