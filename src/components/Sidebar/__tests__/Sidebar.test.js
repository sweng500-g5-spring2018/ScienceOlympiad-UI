//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import AuthService from "../../../utils/AuthService";
import routes from '../../../routes/app';
import {NavLink} from 'react-router-dom';

//COMPONENT TO TEST
import Sidebar from '../Sidebar';
import HeaderLinks from "../../Header/HeaderLinks";

describe('Sidebar Component Tests', function () {

    var sandbox;

    var props = {location: {pathname: "hello"}};

    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    })

    afterEach( () => {
        sandbox.restore();
    })

    // Test 1
    test('Should render Sidebar component with exepcted NavLinks from Routes', () => {
        sandbox.stub(AuthService, 'isUserRoleAllowed').returns(true);
        const component = shallow(<Sidebar {... props} />);

        expect(component.find("div#sidebar")).to.be.length(1);
        expect(component.find("div.sidebar-wrapper")).to.be.length(1);
        expect(component.find("div.logo")).to.be.length(1);

        let foundRefs = component.find('[href="#dashboard"]');
        expect(foundRefs).to.be.length(2);
        expect(foundRefs.at(1).text()).to.contain("Science Olympiad");

        let foundNavLinks = component.find(NavLink);

        for(var i = 0; i < foundNavLinks.length; i++ ) {
            expect(foundNavLinks.at(i).props().to).to.equal(routes[i].path);
        }
    })

    // Test 2
    test('Should render Sidebar component and not render NavLinks for routes with access restrictions', () => {
        sandbox.stub(AuthService, 'isUserRoleAllowed').returns(false);
        const component = shallow(<Sidebar {... props} />);

        let foundNavLinks = component.find(NavLink);

        let filteredRoutes = routes.filter( route => {
            return route.users === undefined;
        })

        for(var i = 0; i < foundNavLinks.length; i++ ) {
            expect(foundNavLinks.at(i).props().to).to.equal(filteredRoutes[i].path);
        }
    })

    // Test 3
    test('Should render Sidebar component and HeaderLinks child because of small screen width', () => {
        sandbox.stub(AuthService, 'isUserRoleAllowed').returns(false);
        const component = shallow(<Sidebar {... props} />);

        expect(component.find(HeaderLinks)).to.be.length(0);

        component.instance().setState({width: 500});
        component.update();

        expect(component.find(HeaderLinks)).to.be.length(1);
    })
});