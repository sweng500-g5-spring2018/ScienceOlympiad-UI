//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import { Button } from 'react-bootstrap';
import {MuiThemeProvider, SelectField, MenuItem} from 'material-ui'

//COMPONENT TO TEST
import CustomDropdown from '../CustomDropdown';
import HttpRequest from "../../../adapters/httpRequest";
import {Route} from "react-router-dom";

describe('CustomDropdown Component Tests', function () {
    const mountWithMuiTheme = node => mount(<MuiThemeProvider>{node}</MuiThemeProvider>);
    const shallowWithMuiTheme = node => shallow(<MuiThemeProvider>{node}</MuiThemeProvider>);

    var httpReturn;
    var props;

    var sandbox;

    //Set up test data before running any tests
    beforeAll(function () {
        httpReturn = require('../../../../test/data/schools/getAllSchoolsResponseData');

        props = {
            name: "school",
            selected: "",
            selectedValue: sinon.spy(),
            endpoint: "/sweng500/getCoaches",
            sortKey: "schoolName",
            hintText: "hint",
            labelText: "label",
            textKeys: ["schoolName"]
        }
    });

    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach( () => {
        sandbox.restore();
    });

    // Test 1
    test('Should render CustomDropdown as empty span', async () => {
        sandbox.stub(HttpRequest, 'httpRequest').rejects("GOODBYE");

        const component = shallow(<CustomDropdown {... props} />);
        await helper.flushPromises();
        component.update();

        expect(component.find(SelectField)).to.be.length(0);
        expect(component.find(MenuItem)).to.be.length(0);
        expect(component.find('span')).to.be.length(1);
    });

    // Test 2
    test('Should render CustomDropdown component with appropriate sub components', async () => {
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            httpReturn
        );

        const component = shallow(<CustomDropdown {... props} />);
        await helper.flushPromises();
        component.update();

        expect(component.find(SelectField)).to.be.length(1);
        expect(component.find(MenuItem)).to.be.length(2);
    });

    // Test 3
    test('Should full DOM render CustomDropdown component and update state based on Props', async () => {
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            httpReturn
        );

        const component = mountWithMuiTheme(<CustomDropdown {... props} />);
        await helper.flushPromises();
        component.update();

        var custDropdown = component.find(CustomDropdown);
        //
        custDropdown.instance().componentWillReceiveProps({errorText: "HELLOO"});
        custDropdown.instance().updateValues(null, null, {idk: 'idk'});

        // let selector = shallowWithMuiTheme(component.find(SelectField).instance().componentWillReceiveProps({errorText: "HELLO"}));
        await helper.flushPromises();
        component.update();

        custDropdown.instance().componentWillReceiveProps({errorText: "HELLOO"});
        await helper.flushPromises();
        component.update();

        expect(true);
    });

    // Test 3
    test('Should full DOM render with limited props', async () => {
        //STUB: Http request to simulate data retrieval from API
        sandbox.stub(HttpRequest, 'httpRequest').resolves(
            httpReturn
        );

        delete props['sortKey'];
        delete props['textKeys'];

        const component = mountWithMuiTheme(<CustomDropdown {... props} />);
        await helper.flushPromises();
        component.update();

        expect(true);
    });
});