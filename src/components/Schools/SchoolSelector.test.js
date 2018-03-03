import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helper functions */
import helper from '../../../test/helpers/helper';

/* Dependent Components */
import HttpRequest from '../../adapters/httpRequest';
import constants from '../../utils/constants';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/* Component under test */
import SchoolSelector from "./SchoolSelector";
import RaisedButton from "material-ui/RaisedButton/index";
import AuthService from "../../utils/AuthService";
import TextField from "material-ui/TextField/index";

describe('School Selector Component Tests', function () {


    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            require('../../../test/data/schools/getAllSchoolsResponseData.json')
        )

        //STUB: Constants function used as argument to HttpRequest
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid");
    })

    // Test 1
    test('Should render school selector with SelectField and 2 MenuItems when data is fetched', async () => {
        const component = shallow(<SchoolSelector />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().schoolList.length).to.equal(2);
        expect(component.find(SelectField)).to.have.length(1);
        expect(component.find(MenuItem)).to.have.length(2);
    });

    // Test 2
    test('Should not render schools and display "ERROR LOADING SCHOOLS" when no schools are found', async () => {

        //STUB: componentWillMount so that no content is fetched
        sinon.stub(SchoolSelector.prototype, 'componentWillMount').returns(true);

        const component = shallow(<SchoolSelector />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().schoolList.length).to.equal(0);
        expect(component.find(SelectField)).to.have.length(0);
        expect(component.text()).to.equal("ERROR LOADING SCHOOLS");

        //UNSTUB: componentWillMount so it is not stubbed any next test cases
        SchoolSelector.prototype.componentWillMount.restore();
    });

    // Test 3
    test('Test that props updates', async () => {

        const component = shallow(<SchoolSelector errorMsg={"error"} />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.setProps({ "errorMsg":"error2" });

        expect(component.state().errorMsg).to.equal("error2");
    });
});