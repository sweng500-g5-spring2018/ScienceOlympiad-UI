import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helper functions */
import helper from '../../../../test/helpers/helper';

/* Dependent Components */
import HttpRequest from '../../../adapters/httpRequest';
import constants from '../../../utils/constants';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/* Component under test */
import BuildingSelector from "../BuildingSelector";
import RaisedButton from "material-ui/RaisedButton/index";
import AuthService from "../../../utils/AuthService";
import TextField from "material-ui/TextField/index";
import SchoolSelector from "../../Schools/SchoolSelector";

describe('Building Selector Component Tests', function () {


    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response,
            //NOTE this data mimics exeuction for get all rooms and get all buildings
            require('../../../../test/data/buildings/getAllBuildingsResponseData.json')
        )

        //STUB: Constants function used as argument to HttpRequest
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid");
    })

    // Test 1
    test('Should render building selector with SelectField and 2 MenuItems when data is fetched', async () => {
        const component = shallow(<BuildingSelector />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().roomList.length).to.equal(2);

        expect(component.find(SelectField)).to.have.length(1);
        expect(component.find(MenuItem)).to.have.length(2);
    });

    // Test 2
    test('Should not render buildings and display "ERROR LOADING BUILDINGS" when no buildings are found', async () => {

        //STUB: componentWillMount so that no content is fetched
        sinon.stub(BuildingSelector.prototype, 'componentWillMount').returns(true);

        const component = shallow(<BuildingSelector />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().buildingList.length).to.equal(0);
        expect(component.find(SelectField)).to.have.length(0);
        expect(component.text()).to.equal("ERROR LOADING BUILDINGS");

        //UNSTUB: componentWillMount so it is not stubbed any next test cases
        BuildingSelector.prototype.componentWillMount.restore();
    });

    // Test 3
    test('Test that props updates', async () => {

        const component = shallow(<BuildingSelector errorMsg={"error"} />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.setProps({ "errorMsg":"error2" });

        expect(component.state().errorMsg).to.equal("error2");
    });

    // Test 4
    test('Test change drop down', async () => {

        var stub = sinon.stub();

        const component = shallow(<BuildingSelector callBack={stub}/>);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        var selectfield = component.find(SelectField).at(0);
        selectfield.simulate('change',{value : '5a92223925ac8ff0785f4d55'});

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(stub.getCall(0).args[0].value).to.equal("5a92223925ac8ff0785f4d55");
    });
});