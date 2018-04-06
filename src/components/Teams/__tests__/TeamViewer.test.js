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
        // console.log = consoleSpy;
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


        // console.log(component.debug());
        //
        // console.log(component.find(ReactTable).props
        // console.log(component.find(ReactTable).props().SubComponent({original: teamJson[0], viewIndex: 0}));
        //
        // console.log(subComp);
    });


    // Test 1
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

    // Test 1
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
    // // Test 2
    // test('Should render StudentViewer with students selectable', async () => {
    //     sandbox.stub(AuthService, 'isAuthorized').returns(true);
    //     axiosMock.onGet(constants.getServerUrl() + '/sweng500/getStudentsFromSchool/?schoolId=' + teamJson[2].school.id).reply(200, [studentJson]);
    //
    //     const component = shallow(<StudentViewer {... props} teamProp={teamJson[2]}/>);
    //     await helper.flushPromises();
    //     component.update();
    //
    //     const button = component.find(Button);
    //
    //     expect(button.simulate('click'));
    //
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.find(SelectField)).to.be.length(1);
    //     expect(component.find(MenuItem)).to.be.length(1);
    // });
    //
    // //test 3
    // test('Should render StudentViewer and add students to studentsSelectable state', async () => {
    //     sandbox.stub(AuthService, 'isAuthorized').returns(true);
    //     const component = shallow(<StudentViewer {... props} teamProp={teamJson[2]}/>);
    //
    //     //Set initial state
    //     component.instance().setState({studentsSelectable: [studentJson], openStudentSelector: true});
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.state().selectedStudents).to.be.length(0);
    //
    //     const selectField = component.find(SelectField);
    //
    //     expect(selectField.simulate('change', {}, null, [studentJson]));
    //
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.state().selectedStudents).to.be.length(1);
    // });
    //
    // //test 4
    // test('Should render StudentViewer and add selected students to team', async () => {
    //     sandbox.stub(AuthService, 'isAuthorized').returns(true);
    //     axiosMock.onPost(constants.getServerUrl() + '/sweng500/updateStudentsInTeam').reply(200, "yay good things");
    //
    //     const component = shallow(<StudentViewer {... props} teamProp={teamJson[2]}/>);
    //
    //     //Set initial state
    //     component.instance().setState({studentsSelectable: [studentJson], selectedStudents: [studentJson], openStudentSelector: true});
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.state().selectedStudents).to.be.length(1);
    //
    //     const addStudentsButton = component.find(RaisedButton);
    //
    //     expect(addStudentsButton.at(1).simulate('click'));
    //
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(notifySpy.called).to.be.true;
    //     expect(updateTableSpy.called).to.be.true;
    //     expect(component.state().openStudentSelector).to.be.false;
    //     notifySpy.resetHistory();
    //     updateTableSpy.resetHistory();
    // });
    //
    // // Test 5
    // test('Should render StudentViewer with selection renderer', async () => {
    //     sandbox.stub(HttpRequest, 'httpRequest').rejects("GOODBYE");
    //
    //     const component = shallow(<StudentViewer {... props} teamProp={teamJson[0]}/>);
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.instance().selectionRenderer()).to.equal('');
    //
    //     component.instance().setState({selectedStudents:[studentJson]})
    //     expect(component.instance().selectionRenderer()).to.contain(studentJson.firstName);
    //
    //     component.instance().setState({selectedStudents:[studentJson, studentJson]})
    //     expect(component.instance().selectionRenderer()).to.contain(2);
    //
    // });
    //
    // // Test 6
    // test('Should render StudentViewer and fail to obtain students for selectable students', async () => {
    //     sandbox.stub(AuthService, 'isAuthorized').returns(true);
    //     axiosMock.onGet(constants.getServerUrl() + '/sweng500/getStudentsFromSchool/?schoolId=' + teamJson[2].school.id).reply(400, "well this sucks");
    //
    //     const component = shallow(<StudentViewer {... props} teamProp={teamJson[2]}/>);
    //     await helper.flushPromises();
    //     component.update();
    //
    //     const button = component.find(Button);
    //
    //     expect(button.simulate('click'));
    //
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.find(SelectField)).to.be.length(0);
    //     expect(component.find(MenuItem)).to.be.length(0);
    //
    //     expect(component.state().studentsSelectable).to.be.length(0);
    // });
    //
    // //test 7
    // test('Should render StudentViewer and fail to add student to team', async () => {
    //     sandbox.stub(AuthService, 'isAuthorized').returns(true);
    //     axiosMock.onPost(constants.getServerUrl() + '/sweng500/updateStudentsInTeam').reply(400, "yay good things");
    //
    //     const component = shallow(<StudentViewer {... props} teamProp={teamJson[2]}/>);
    //
    //     //Set initial state
    //     component.instance().setState({studentsSelectable: [studentJson], selectedStudents: [studentJson], openStudentSelector: true});
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.state().selectedStudents).to.be.length(1);
    //
    //     const addStudentsButton = component.find(RaisedButton);
    //
    //     expect(addStudentsButton.at(1).simulate('click'));
    //
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(notifySpy.called).to.be.true;
    //     expect(updateTableSpy.called).to.be.false;
    //     expect(component.state().openStudentSelector).to.be.false;
    //     notifySpy.resetHistory();
    //     updateTableSpy.resetHistory();
    // });
});