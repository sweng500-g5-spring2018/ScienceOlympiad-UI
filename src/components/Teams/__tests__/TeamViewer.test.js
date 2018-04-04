//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import {RaisedButton, MuiThemeProvider, SelectField} from 'material-ui'
import Button from '../../../elements/CustomButton/CustomButton';
import {Panel} from 'react-bootstrap';
import ReactTable from 'react-table';

//COMPONENT TO TEST
import TeamViewer from '../TeamViewer';
import HttpRequest from "../../../adapters/httpRequest";

describe('TeamViewer Component Tests', function () {

    var teamJson;
    var props;

    var sandbox;
    var notifySpy = sinon.spy();
    var updateTableSpy = sinon.spy();
    var panelSpy = sinon.spy();

    //Set up test data before running any tests
    beforeAll(function () {
        teamJson = require('../../../../test/data/teams/getAllTeamsResponseData');

        props = {
            addNotification: notifySpy,
            updateTable: updateTableSpy,
            viewIndex: 0
        }
    });

    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach( () => {
        sandbox.restore();
    });

    // Test 1
    test('Should render TeamViewer with expected children components', async () => {
        sandbox.stub(HttpRequest, 'httpRequest').resolves({body: teamJson});

        const component = shallow(<TeamViewer {... props} />);
        await helper.flushPromises();
        component.update();

        expect(component.find(ReactTable)).to.be.length(1);
        expect(component.find(RaisedButton)).to.be.length(2);

    });

    // // Test 1
    // test('Should render StudentViewer without SelectField because no students can be added', async () => {
    //     sandbox.stub(HttpRequest, 'httpRequest').rejects("GOODBYE");
    //
    //     const component = shallow(<StudentViewer {... props} teamProp={teamJson[1]}/>);
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.find(MuiThemeProvider)).to.be.length(1);
    //     expect(component.find(ReactTable)).to.be.length(1);
    //     expect(component.find(Panel)).to.be.length(1);
    //     expect(component.find(Button)).to.be.length(1);
    //     expect(component.find(RaisedButton)).to.be.length(2);
    //
    // });

    // // Test 2
    // test('Should handle field changes', async () => {
    //     sandbox.stub(HttpRequest, 'httpRequest').rejects("GOODBYE");
    //
    //     const component = shallow(<StudentAdder {... props} />);
    //     await helper.flushPromises();
    //     component.update();
    //
    //     var textFields = component.find(TextField);
    //
    //     for(let i = 0; i < textFields.length; i++) {
    //         textFields.at(i).simulate('change', {}, "hello" + i);
    //
    //         await helper.flushPromises();
    //         component.update();
    //     }
    //     expect(component.state().firstName).to.equal("hello0");
    //     expect(component.state().lastName).to.equal("hello1");
    //     expect(component.state().emailAddress).to.equal("hello2");
    // });
    //
    // // Test 3
    // test('Should handle button clicks and manipulate state', async () => {
    //     sandbox.stub(HttpRequest, 'httpRequest').resolves("GOODBYE");
    //
    //     const component = shallow(<StudentAdder {... props} />);
    //     await helper.flushPromises();
    //     component.update();
    //
    //     var textFields = component.find(TextField);
    //
    //     expect(panelSpy.called).to.be.false;
    //     var buttons = component.find(RaisedButton);
    //
    //     //Cancel button functions appropriately
    //     expect(buttons.at(0).simulate('click'));
    //     expect(panelSpy.called).to.be.true;
    //
    //     expect(component.state().errors).to.deep.equal({});
    //
    //     //Submit Student button functions appropriately
    //     expect(buttons.at(1).simulate('click'));
    //     await helper.flushPromises();
    //     component.update();
    //     expect(component.state().errors.firstNameError).to.not.equal(undefined);
    //
    //     textFields.at(0).simulate('change', null, "HELLOO");
    //     // textFields.at(0).simulate('change', null, {trim: () => {return "HELLO"}});
    //     await helper.flushPromises();
    //     component.update();
    //     expect(buttons.at(1).simulate('click'));
    //     expect(component.state().errors.firstNameError).to.equal(undefined);
    //     expect(component.state().errors.lastNameError).to.not.equal(undefined);
    //
    //     textFields.at(1).simulate('change', null, "hello");
    //     await helper.flushPromises();
    //     component.update();
    //     expect(buttons.at(1).simulate('click'));
    //     expect(component.state().errors.emailAddressError).to.not.equal(undefined);
    //
    //     textFields.at(2).simulate('change', null, "hello@hello.com");
    //     await helper.flushPromises();
    //     component.update();
    //     expect(buttons.at(1).simulate('click'));
    //     expect(component.state().errors.schoolError).to.not.equal(undefined);
    //
    //     component.instance().selectedSchool({ selectedSchool: {id: "23839829", schoolName: "hi school"}});
    //
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(buttons.at(1).simulate('click'));
    //
    //     await helper.flushPromises();
    //     component.update();
    //
    //     expect(component.state().errors).to.deep.equal({});
    //     expect(updateTableSpy.called).to.be.true;
    // });
});