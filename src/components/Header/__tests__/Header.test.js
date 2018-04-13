//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import { Navbar } from 'react-bootstrap';
import HeaderLinks from '../HeaderLinks.js';

//COMPONENT TO TEST
import Header from '../Header';
import Dashboard from "../../../views/Dashboard/Dashboard";

describe('Header Component Tests', function () {

    //Test Suite Mocks/Spies/Data
    const reactRouterData = require('../../../../test/data/header/reactRouterTest');

    //Set up test data before running any tests
    beforeAll(function () {
    })

    afterEach(function () {
    })

    // Test 1
    test('Should render Header component with React Bootstrap Navbar components', () => {
        const component = shallow(<Header {... reactRouterData} location={"app/dashboard"}/>);

        expect(component.find(Navbar)).to.have.length(1);
        expect(component.find(Navbar.Header)).to.have.length(1);
        expect(component.find(Navbar.Brand)).to.have.length(1);
        expect(component.find(Navbar.Toggle)).to.have.length(1);
        expect(component.find(Navbar.Collapse)).to.have.length(1);

        expect(component.find(HeaderLinks)).to.have.length(1);

    })

    // Test 2
    test('Should render div containing the result of getBrand() which should equal "Dashboard"', () => {
        const component = shallow(<Header {... reactRouterData} />);

        let brandDisplay = component.find('div#brand-display');
        expect(brandDisplay).to.have.length(1);
        expect(brandDisplay.text()).to.equal("Dashboard");
    })

    // Test 3
    test('Should render Navbar and run function to handle mobileSidebarToggle event', async () => {
        const component = shallow(<Header {... reactRouterData} />);

        let navbarToggle = component.find(Navbar.Toggle);
        expect(navbarToggle).to.have.length(1);

        expect(component.instance().state.sidebarExists).to.equal(false);

        expect(navbarToggle.simulate('click', helper.mockedEvent));

        await helper.flushPromises();
        component.update();

        expect(component.instance().state.sidebarExists).to.equal(true);
    })

    // Test 4
    test('Should render Header but fail finding sidebar"', () => {
        var myNode;
        document.body.appendChild = (node) => {myNode = node};
        document = {createElement: () => { return new Node('div')}};

        sinon.stub(document, 'createElement').returns({});

        const component = shallow(<Header {... reactRouterData} location={{pathname: "/app/dashboard"}}/>);
        component.instance().parentElement = {removeChild: () => {}};

        component.setState({sidebarExists: true});

        component.instance().mobileSidebarToggle({preventDefault: () => {}})
        try{
            myNode.onclick();
        } catch(e) {

        }
    })
});