//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../test/helpers/helper';
import TestComponent from '../../../test/helpers/TestComponent';

//CHILDREN COMPONENTS
import AuthService from "../../utils/AuthService";
import {Route, Redirect, HashRouter} from 'react-router-dom'

//COMPONENT TO TEST
import AuthenticatedRoute from "../AuthenticatedRoute";
import Dashboard from "../../views/Dashboard/Dashboard";

describe('Authenticated Route Tests', function () {
    const mountWithRouter = node => mount(<HashRouter>{node}</HashRouter>);
    const shallowWithRouter = node => shallow(<HashRouter>{node}</HashRouter>);

    //Create Sinon Sandbox
    var sandbox;

    const route = {};
    const locationProps = {};

    //Build route information as props to AuthenticatedRoute
    beforeAll( () => {
        // { path: "/app/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
        route.path = "/test";
        route.name = "Testing";
        route.text = "This is for test";
        route.component = TestComponent;

        locationProps.props = {location: 'idk'};
    })

    //Before each test, recreate a sinon sandbox
    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    })

    //After each test, tear down the sinon sandbox
    afterEach( () => {
        sandbox.restore();
    })

    //Test 1
    test('Should render an Authenticated Route with an actual Route and the expected Test Component', () => {
        sandbox.stub(AuthService, "isLoggedIn").returns(true);
        sandbox.stub(AuthService, "isUserRoleAllowed").returns(true);

        const component = mountWithRouter(<AuthenticatedRoute {... route}  />);

        let renderedRoute = component.find(Route);
        expect(renderedRoute).to.be.length(1);

        //Expect props passed into Component
        expect(renderedRoute.instance().props.path).to.equal(route.path);
        expect(renderedRoute.instance().props.name).to.equal(route.name);

        //Call render of Route since it is a function
        const renderedComp = mount(component.find(Route).instance().props.render());

        //Expect the TestComponent passed into Authenticated Route to be rendered
        expect(renderedComp.find(TestComponent)).to.be.length(1);
        expect(renderedComp.find("div#test-component-id")).to.be.length(1);

        component.unmount();
    });

    //Test 2
    test('Should render an Authenticated Route with a Redirect for unauthorized users', () => {
        sandbox.stub(AuthService, "isLoggedIn").returns(false);
        sandbox.stub(AuthService, "isUserRoleAllowed").returns(true);

        const component = mountWithRouter(<AuthenticatedRoute {... route}  />);
        let renderedRoute = component.find(Route);
        expect(renderedRoute).to.be.length(1);

        //Call render of Route since it is a function
        const renderedComp = shallowWithRouter(component.find(Route).instance().props.render(locationProps));
        expect(renderedComp.find(Redirect)).to.be.length(1);

        component.unmount();
    });

});