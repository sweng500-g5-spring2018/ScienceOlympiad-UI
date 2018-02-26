import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helper functions */
import helper from '../../../test/helpers/helper';

/* Dependent Components */
import HttpRequest from '../../adapters/httpRequest';
import constants from '../../utils/constants';
import Card from '../../components/Card/Card.js';
import TextField from 'material-ui/TextField';
import {Grid, Col, Row, Modal} from 'react-bootstrap';

/* Component under test */
import Schools from './Schools';
import AuthService from "../../containers/Login/AuthService";

describe('School Component Tests', function () {


    //Set up test data before running any tests
    beforeAll(function () {

        //STUB: Http request to simulate data retrieval from API
        sinon.stub(HttpRequest, 'httpRequest').resolves(
            //import test data JSON for response
            require('../../../test/data/schools/getAllSchoolsResponseData.json')
        )

        //STUB: Constants function used as argument to HttpRequest
        sinon.stub(constants, 'getServerUrl').returns("wow tests are stupid")
    })

    afterEach(function () {
        //Always unstub AuthService.isLoggedIn() in case we want it to return different values
        AuthService.isLoggedIn.restore();
    })

    // Test 1
    test('Should render school when data is fetched', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().schoolList.length).to.equal(2);
        expect(component.find(Card)).to.have.length(1);
    });

    // Test 2
    test('Should not render schools when no schools are found', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        //STUB: componentWillMount so that no content is fetched
        sinon.stub(Schools.prototype, 'componentWillMount').returns(true);

        const component = shallow(<Schools />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        expect(component.state().schoolList.length).to.equal(0);

        //UNSTUB: componentWillMount so it is not stubbed any next test cases
        Schools.prototype.componentWillMount.restore();
    });

    // Test 3
    test('Test to render the modal', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.instance().setState({modal: true})
        expect(component.find(Modal)).to.have.length(1);
    });

    // Test 4
    test('Test add school modal renders 3 TextFields', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.instance().setState({modal: true})
        component.instance().setState({modalAction: "add"})

        expect(component.find(TextField)).to.have.length(3);
    });

    // Test 5
    test('Test edit school modal renders 3 TextFields', async () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)

        const component = shallow(<Schools />);

        //Wait for setState's to finish and re-render component
        await helper.flushPromises();
        component.update();

        component.instance().setState({modal: true})
        component.instance().setState({modalAction: "edit"})

        expect(component.find(TextField)).to.have.length(3);
    });

});