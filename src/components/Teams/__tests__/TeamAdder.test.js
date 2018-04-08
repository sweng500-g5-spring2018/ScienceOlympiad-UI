//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import {MuiThemeProvider, AppBar, TextField, RaisedButton} from 'material-ui'
import CustomDropdown from '../../../elements/CustomSelector/CustomDropdown';

//COMPONENT TO TEST
import TeamAdder from '../TeamAdder';
import HttpRequest from "../../../adapters/httpRequest";

describe('TeamAdder Component Tests', function () {

    var httpReturn;
    var props;

    var sandbox;
    var notifySpy = sinon.spy();
    var updateTableSpy = sinon.spy();
    var panelSpy = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {
        httpReturn = require('../../../../test/data/schools/getAllSchoolsResponseData');

        props = {
            addNotification: notifySpy,
            updateTable: updateTableSpy,
            togglePanel: panelSpy
        }
    });

    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach( () => {
        sandbox.restore();
    });

    // Test 1
    test('Should render TeamAdder with expected children components', async () => {
        sandbox.stub(HttpRequest, 'httpRequest').rejects("GOODBYE");

        const component = shallow(<TeamAdder {... props} />);
        await helper.flushPromises();
        component.update();

        expect(component.find(MuiThemeProvider)).to.be.length(1);
        expect(component.find(AppBar)).to.be.length(1);
        expect(component.find(TextField)).to.be.length(1);
        expect(component.find(CustomDropdown)).to.be.length(2);
        expect(component.find(RaisedButton)).to.be.length(2);
    });

    // Test 2
    test('Should handle field changes', async () => {
        sandbox.stub(HttpRequest, 'httpRequest').rejects("GOODBYE");

        const component = shallow(<TeamAdder {... props} />);
        await helper.flushPromises();
        component.update();

        var textFields = component.find(TextField);

        for(let i = 0; i < textFields.length; i++) {
            textFields.at(i).simulate('change', {}, "hello" + i);

            await helper.flushPromises();
            component.update();
        }
        expect(component.state().teamName).to.equal("hello0");

    });

    // Test 3
    test('Should handle button clicks and manipulate state', async () => {
        sandbox.stub(HttpRequest, 'httpRequest').resolves("GOODBYE");

        const component = shallow(<TeamAdder {... props} />);
        await helper.flushPromises();
        component.update();

        var textFields = component.find(TextField);

        expect(panelSpy.called).to.be.false;
        var buttons = component.find(RaisedButton);

        //Cancel button functions appropriately
        expect(buttons.at(0).simulate('click'));
        expect(panelSpy.called).to.be.true;

        expect(component.state().errors).to.deep.equal({});

        //Submit Student button functions appropriately
        expect(buttons.at(1).simulate('click'));
        await helper.flushPromises();
        component.update();
        expect(component.state().errors.teamNameError).to.not.equal(undefined);

        textFields.at(0).simulate('change', null, "HELLOO");
        await helper.flushPromises();
        component.update();

        component.instance().selectedCoach({ selectedCoach: {id: "23839829", name: "hi coach"}});
        component.instance().selectedSchool({ selectedSchool: {id: "23839829", schoolName: "hi school"}});

        expect(buttons.at(1).simulate('click'));
        await helper.flushPromises();
        component.update();

        expect(notifySpy.called).to.be.true;
        expect(updateTableSpy.called).to.be.true;
        notifySpy.resetHistory();
        updateTableSpy.resetHistory();

    });

    // Test 4
    test('Should handle button clicks and manipulate state and handle errors appropriately', async () => {
        sandbox.stub(HttpRequest, 'httpRequest').rejects("GOODBYE");

        const component = shallow(<TeamAdder {... props} />);
        await helper.flushPromises();
        component.update();

        var buttons = component.find(RaisedButton);

        //Submit Student button functions appropriately
        expect(buttons.at(1).simulate('click'));
        await helper.flushPromises();
        component.update();
        expect(component.state().errors.teamNameError).to.not.equal(undefined);
        expect(component.state().errors.schoolError).to.not.equal(undefined);
        expect(component.state().errors.coachError).to.not.equal(undefined);

        await helper.flushPromises();
        component.update();

        component.setState({
            selectedCoach: {id: "23839829", name: "hi coach"},
            selectedSchool: {id: "23839829", schoolName: "hi school"},
            teamName: "HELLLOO TEAM"
        })

        expect(buttons.at(1).simulate('click'));
        await helper.flushPromises();
        component.update();

        expect(notifySpy.called).to.be.true;
        expect(updateTableSpy.called).to.be.false;
        notifySpy.resetHistory();
        updateTableSpy.resetHistory();

    });
});