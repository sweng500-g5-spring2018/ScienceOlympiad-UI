//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import { NavItem, Nav, NavDropdown } from 'react-bootstrap';

//COMPONENT TO TEST
import HeaderLinks from '../HeaderLinks';
import AuthService from "../../../utils/AuthService";

describe('HeaderLinks Component Tests', function () {

    //Test Suite Mocks/Spies
    const mockedEvent = { target: {}, preventDefault : () => {} }
    const consoleSpy = sinon.spy();
    console.log = consoleSpy;

    //Set up test data before running any tests
    beforeAll(function () {

    })

    afterEach(function () {
    })

    // Test 1
    test('Should render HeaderLinks with Nav/Menu components', () => {
        const component = shallow(<HeaderLinks />);

        expect(component.find(Nav)).to.have.length(2);
        expect(component.find(NavItem)).to.have.length(2);

    })

    // Test 2
    test('Should render render NavItem for logging out and fail log out', async () => {
        sinon.stub(AuthService, 'logout').rejects("DEAD");

        const component = shallow(<HeaderLinks />);

        let navItems = component.find(NavItem);
        expect(navItems).to.have.length(2);

        let navLogout = navItems.at(1);
        expect(navLogout.simulate('click', mockedEvent));

        await helper.flushPromises();
        expect(consoleSpy.calledOnce).to.equal(true);

        consoleSpy.resetHistory();
        AuthService.logout.restore();
    })

    // Test 3
    test('Should render render NavItem for logging out and successfully log out', async () => {
        sinon.stub(AuthService, 'logout').resolves("SUCCESS");

        const component = shallow(<HeaderLinks />);

        let navItems = component.find(NavItem);
        expect(navItems).to.have.length(2);

        let navLogout = navItems.at(1);
        expect(navLogout.simulate('click', mockedEvent));

        await helper.flushPromises();
        expect(consoleSpy.calledOnce).to.equal(true);

        consoleSpy.resetHistory();
        AuthService.logout.restore();
    })

});