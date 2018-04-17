//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

//COMPONENT TO TEST
import Dashboard from '../Dashboard';
import CoachCount from '../CoachCount';
import EventCount from '../EventCount';
import JudgeCount from '../JudgeCount';
import TeamCount from '../TeamCount';
import TodaysEvents from '../TodaysEvents';
import ChuckParent from '../../../components/HttpExample/ChuckParent'

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

import AuthService from "../../../utils/AuthService";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import constants from "../../../utils/constants";

describe('Dashboard Component Tests', function () {

    var axiosMock;
    var sandbox;

    var consoleSpy = sinon.spy();

    var coachesJson = require('../../../../test/data/dashboard/coaches.json');
    var eventsJson = require('../../../../test/data/dashboard/events.json');
    var judgesJson = require('../../../../test/data/dashboard/judges.json');
    var teamsJson = require('../../../../test/data/dashboard/teams.json');
    var chuckJson = require('../../../../test/data/dashboard/chuck.json');

    //Set up test data before running any tests
    beforeAll(function () {

        //MOCK axios
        axiosMock = new MockAdapter(axios);
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/events').reply(200, JSON.parse(JSON.stringify(eventsJson)));
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getTeams').reply(200, JSON.parse(JSON.stringify(teamsJson)));
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getJudges').reply(200, JSON.parse(JSON.stringify(judgesJson)));
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getCoaches').reply(200, JSON.parse(JSON.stringify(coachesJson)));
        axiosMock.onGet('https://api.chucknorris.io/jokes/random').reply(200, JSON.parse(JSON.stringify(chuckJson)));

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
    test('Should render Dashboard component for ADMIN', () => {

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN");

        const component = shallow(<Dashboard />);

        expect(component.find('div.content')).to.have.length(1);
        expect(component.find(EventCount)).to.have.length(1);
        expect(component.find(TeamCount)).to.have.length(1);
        expect(component.find(CoachCount)).to.have.length(1);
        expect(component.find(JudgeCount)).to.have.length(1);
        expect(component.find(TodaysEvents)).to.have.length(1);
        expect(component.find(ChuckParent)).to.have.length(1);
    })

    // Test 2
    test('Should render Dashboard component for COACH', () => {

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'getUserRole').returns("COACH");

        const component = shallow(<Dashboard />);

        expect(component.find('div.content')).to.have.length(1);
        expect(component.find(EventCount)).to.have.length(1);
        expect(component.find(TeamCount)).to.have.length(1);
        expect(component.find(CoachCount)).to.have.length(0);
        expect(component.find(JudgeCount)).to.have.length(0);
        expect(component.find(TodaysEvents)).to.have.length(1);
        expect(component.find(ChuckParent)).to.have.length(0);
    })

    // Test 3
    test('Should render Dashboard component for JUDGE', () => {

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'getUserRole').returns("JUDGE");

        const component = shallow(<Dashboard />);

        expect(component.find('div.content')).to.have.length(1);
        expect(component.find(EventCount)).to.have.length(1);
        expect(component.find(TeamCount)).to.have.length(1);
        expect(component.find(CoachCount)).to.have.length(1);
        expect(component.find(JudgeCount)).to.have.length(0);
        expect(component.find(TodaysEvents)).to.have.length(1);
        expect(component.find(ChuckParent)).to.have.length(0);
    })

    // Test 4
    test('Should render Dashboard component for STUDENT', () => {

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'getUserRole').returns("STUDENT");

        const component = shallow(<Dashboard />);

        expect(component.find('div.content')).to.have.length(1);
        expect(component.find(EventCount)).to.have.length(0);
        expect(component.find(TeamCount)).to.have.length(0);
        expect(component.find(CoachCount)).to.have.length(0);
        expect(component.find(JudgeCount)).to.have.length(0);
        expect(component.find(TodaysEvents)).to.have.length(1);
        expect(component.find(ChuckParent)).to.have.length(0);
    })

    // Test 5
    test('Should render CoachCount component', async () => {

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        const component = shallow(<CoachCount />);

        await helper.flushPromises();
        component.update();

        expect(component.state().result.length).to.be.greaterThan(0);
    })

    // Test 6
    test('Should render EventCount component', async () => {

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        const component = shallow(<EventCount />);

        await helper.flushPromises();
        component.update();

        expect(component.state().result.length).to.be.greaterThan(0);
    })

    // Test 7
    test('Should render TeamCount component', async () => {

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        const component = shallow(<TeamCount />);

        await helper.flushPromises();
        component.update();

        expect(component.state().result.length).to.be.greaterThan(0);
    })


    // Test 7
    test('Should render JudgeCount component', async () => {

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        const component = shallow(<JudgeCount />);

        await helper.flushPromises();
        component.update();

        expect(component.state().result.length).to.be.greaterThan(0);
    })

    // Test 8
    test('Should render TodaysEvents component', async () => {
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/events').reply(200, JSON.parse(JSON.stringify(eventsJson)));

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        const component = shallow(<TodaysEvents />);

        await helper.flushPromises();
        component.update();

        expect(component.state().result.length).to.be.greaterThan(0);
    })

    // Test 8
    test('Should fail everycomponent fetch data', async () => {
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/events').reply(400, "aw");
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getTeams').reply(400, "aw");
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getJudges').reply(400, "aw");
        axiosMock.onGet(constants.getServerUrl() + '/sweng500/getCoaches').reply(400, "aw");
        axiosMock.onGet('https://api.chucknorris.io/jokes/random').reply(400, "aw");

        //Simulate the user be logged on
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN");
        sandbox.stub(AuthService, 'isAuthorized').returns(true);

        const component1 = shallow(<Dashboard />);
        const component2 = shallow(<CoachCount />);
        const component3 = shallow(<EventCount />);
        const component4 = shallow(<JudgeCount />);
        const component5 = shallow(<TeamCount />);
        const component6 = shallow(<TodaysEvents />);

        await helper.flushPromises();
        component1.update();
        component2.update();
        component3.update();
        component4.update();
        component5.update();
        component6.update();

        expect(consoleSpy.callCount).to.equal(5);
    })
});