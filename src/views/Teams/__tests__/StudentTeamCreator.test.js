//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import {MuiThemeProvider, Popover, Menu, MenuItem, RaisedButton} from 'material-ui';
import {Panel, PanelGroup} from 'react-bootstrap';
import StudentAdder from "../../../components/Teams/TeamAdder";
import TeamAdder from "../../../components/Teams/TeamAdder";


//COMPONENT TO TEST
import StudentTeamCreator from '../StudentTeamCreator';

describe('StudentTeamCreator Component Tests', function () {

    const mockedEvent = { target: {}, currentTarget: {} , preventDefault : () => {} }

    var sandbox;

    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach( () => {
        sandbox.restore();
    });

    // Test 1
    test('Should render StudentTeamCreator component with expected child components', () => {
        const component = shallow(<StudentTeamCreator />);

        expect(component.find(MuiThemeProvider)).to.be.length(1);
        expect(component.find(RaisedButton)).to.be.length(1);
        expect(component.find(Popover)).to.be.length(1);
        expect(component.find(Menu)).to.be.length(1);
        expect(component.find(MenuItem)).to.be.length(2);
        expect(component.find(PanelGroup)).to.be.length(1);
        expect(component.find(Panel)).to.be.length(2);
        expect(component.find(StudentAdder)).to.be.length(1);
        expect(component.find(TeamAdder)).to.be.length(1);

    })

    test('Should control Popover onClick of RaisedButton', async () => {
        // sandbox.stub(AuthService, 'isUserRoleAllowed').returns(true);
        const component = shallow(<StudentTeamCreator />);

        expect(component.state().popOverOpen).to.equal(false);
        expect(component.state().anchorEl).to.equal(undefined);

        var popOverButtonController = component.find(RaisedButton);

        expect(popOverButtonController.simulate('click', mockedEvent));

        await helper.flushPromises();
        component.update();

        expect(component.state().popOverOpen).to.equal(true);
        expect(component.state().anchorEl).to.not.equal(undefined);

    });

    test('Should simulate menu item clicked to change between Student and Team adders', async () => {
        // sandbox.stub(AuthService, 'isUserRoleAllowed').returns(true);
        var currentOpen = "";

        const component = shallow(<StudentTeamCreator />);

        expect(component.state().addPanel).to.equal(currentOpen);


        let foundMenuItems = component.find(MenuItem);
        expect(foundMenuItems).to.be.length(2);

        for(var i = 0; i < foundMenuItems.length; i++) {
            expect(foundMenuItems.at(i).simulate('click'));
            await helper.flushPromises();
            component.update();

            expect(component.state().addPanel).to.not.equal(currentOpen);
            currentOpen = component.state().addPanel;
        }

        let panelgroup = component.find(PanelGroup);
        expect(panelgroup.simulate('select'));

        await helper.flushPromises();
        component.update();

    });
});